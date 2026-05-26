package com.baersolutions.driver_finance_app.fuel.service.impl;

import com.baersolutions.driver_finance_app.common.exception.ResourceNotFoundException;
import com.baersolutions.driver_finance_app.common.time.TimeProvider;
import com.baersolutions.driver_finance_app.fuel.dto.CreateFuelLoadRequest;
import com.baersolutions.driver_finance_app.fuel.dto.FuelLoadResponse;
import com.baersolutions.driver_finance_app.fuel.entity.FuelLoad;
import com.baersolutions.driver_finance_app.fuel.repository.FuelLoadRepository;
import com.baersolutions.driver_finance_app.fuel.service.FuelLoadService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FuelLoadServiceImpl implements FuelLoadService {

  private static final Logger log = LoggerFactory.getLogger(FuelLoadServiceImpl.class);

  private final FuelLoadRepository fuelLoadRepository;
  private final TimeProvider timeProvider;

  @Override
  @Transactional
  public FuelLoadResponse registerFuelLoad(CreateFuelLoadRequest request) {
    Objects.requireNonNull(request, "request no puede ser null");

    validateLoadDate(request.loadDate());

    log.info("Registrando carga de combustible para fecha: {}", request.loadDate());

    FuelLoad fuelLoad = new FuelLoad();

    fuelLoad.setLoadDate(request.loadDate());
    fuelLoad.setLiters(request.liters());
    fuelLoad.setTotalCost(request.totalCost());
    fuelLoad.setOdometer(request.odometer());

    FuelLoad saved = fuelLoadRepository.save(fuelLoad);

    log.info("FuelLoad creado con id: {}", saved.getId());

    return toResponse(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public List<FuelLoadResponse> getFuelLoads(LocalDate from, LocalDate to) {
    validateRange(from, to);

    log.debug("Obteniendo cargas de combustible. from={}, to={}", from, to);

    return findByRange(from, to).stream()
        .sorted((a, b) -> b.getLoadDate().compareTo(a.getLoadDate()))
        .map(this::toResponse)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public FuelLoadResponse getFuelLoadById(Long id) {
    log.debug("Buscando FuelLoad por id: {}", id);

    FuelLoad fuelLoad = fuelLoadRepository.findById(requireId(id))
        .orElseThrow(() -> {
          log.warn("FuelLoad no encontrado: {}", id);
          return new ResourceNotFoundException("FuelLoad no encontrado: " + id);
        });

    return toResponse(fuelLoad);
  }

  @Override
  @Transactional
  public void deleteFuelLoad(Long id) {
    log.warn("Eliminando FuelLoad id: {}", id);

    FuelLoad fuelLoad = fuelLoadRepository.findById(requireId(id))
        .orElseThrow(() -> new ResourceNotFoundException("FuelLoad no encontrado: " + id));

    fuelLoadRepository.delete(fuelLoad);
  }

  // ===================== HELPERS =====================

  private List<FuelLoad> findByRange(LocalDate from, LocalDate to) {
    if (from != null && to != null) {
      return fuelLoadRepository.findByLoadDateBetween(from, to);
    }

    if (from != null) {
      return fuelLoadRepository.findByLoadDateGreaterThanEqual(from);
    }

    if (to != null) {
      return fuelLoadRepository.findByLoadDateLessThanEqual(to);
    }

    return fuelLoadRepository.findAll(Sort.by(Sort.Direction.DESC, "loadDate"));
  }

  private void validateLoadDate(LocalDate loadDate) {
    LocalDate today = timeProvider.today();

    if (loadDate.isAfter(today)) {
      throw new IllegalArgumentException("loadDate no puede ser futura");
    }
  }

  private void validateRange(LocalDate from, LocalDate to) {
    if (from != null && to != null && from.isAfter(to)) {
      throw new IllegalArgumentException("from no puede ser mayor que to");
    }
  }

  private Long requireId(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("id no puede ser null");
    }

    return id;
  }

  private FuelLoadResponse toResponse(FuelLoad fuelLoad) {
    return new FuelLoadResponse(
        fuelLoad.getId(),
        fuelLoad.getLoadDate(),
        fuelLoad.getLiters(),
        fuelLoad.getTotalCost(),
        fuelLoad.getOdometer(),
        fuelLoad.getPricePerLiter()
    );
  }
}