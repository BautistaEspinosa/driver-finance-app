package com.baersolutions.driver_finance_app.shift.service.impl;

import com.baersolutions.driver_finance_app.common.dto.PageResponse;
import com.baersolutions.driver_finance_app.common.exception.ResourceNotFoundException;
import com.baersolutions.driver_finance_app.shift.entity.Shift;
import com.baersolutions.driver_finance_app.shift.repository.ShiftRepository;
import com.baersolutions.driver_finance_app.shift.service.ShiftService;
import com.baersolutions.driver_finance_app.shift.dto.CreateShiftRequest;
import com.baersolutions.driver_finance_app.shift.dto.PatchShiftRequest;
import com.baersolutions.driver_finance_app.shift.dto.ShiftResponse;
import com.baersolutions.driver_finance_app.shift.dto.ShiftSummaryResponse;
import com.baersolutions.driver_finance_app.shift.dto.UpdateShiftRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
// MEJORA: @RequiredArgsConstructor elimina el constructor manual —
// Lombok lo genera a partir de los campos final.
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {

	private static final Logger log = LoggerFactory.getLogger(ShiftServiceImpl.class);

	private final ShiftRepository shiftRepository;

	@Override
	// MEJORA: @Transactional garantiza rollback si save() lanza una excepción
	// en medio de una operación compuesta futura.
	@Transactional
	public ShiftResponse registerShift(CreateShiftRequest request) {
		Objects.requireNonNull(request, "request no puede ser null");
		log.info("Registrando nuevo shift para fecha: {}", request.shiftDate());

		Shift shift = new Shift();
		shift.setShiftDate(Objects.requireNonNull(request.shiftDate(), "shiftDate"));
		shift.setIncome(request.income());
		shift.setGas(request.gas());
		shift.setOtherExpenses(request.otherExpenses());

		Shift saved = shiftRepository.save(shift);
		log.info("Shift creado con id: {}", saved.getId());
		return toResponse(saved);
	}

	@Override
	// MEJORA: readOnly=true comunica intención y permite optimizaciones del ORM.
	@Transactional(readOnly = true)
	public List<ShiftResponse> getShiftHistory(LocalDate from, LocalDate to) {
		validateRange(from, to);
		log.debug("Obteniendo historial de shifts. from={}, to={}", from, to);

		return findByRange(from, to).stream()
				.sorted((a, b) -> b.getShiftDate().compareTo(a.getShiftDate()))
				.map(this::toResponse)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<ShiftResponse> getShiftHistory(LocalDate from, LocalDate to, Pageable pageable) {
		validateRange(from, to);
		log.debug("Obteniendo historial paginado. from={}, to={}, page={}", from, to, pageable.getPageNumber());

		Page<Shift> page = findPageByRange(from, to, pageable);

		return new PageResponse<>(
				page.getContent().stream().map(this::toResponse).toList(),
				page.getNumber(),
				page.getSize(),
				page.getTotalElements(),
				page.getTotalPages(),
				page.hasNext(),
				page.hasPrevious()
		);
	}

	@Override
	@Transactional(readOnly = true)
	public ShiftSummaryResponse getShiftSummary(LocalDate from, LocalDate to) {
		validateRange(from, to);
		log.debug("Calculando resumen de shifts. from={}, to={}", from, to);

		List<Shift> shifts = findByRange(from, to);

		BigDecimal totalIncome = shifts.stream().map(Shift::getIncome).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal totalGas    = shifts.stream().map(Shift::getGas).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal totalOther  = shifts.stream().map(Shift::getOtherExpenses).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal net         = shifts.stream().map(Shift::getNetEarnings).reduce(BigDecimal.ZERO, BigDecimal::add);

		return new ShiftSummaryResponse(totalIncome, totalGas, totalOther, net);
	}

	@Override
	@Transactional(readOnly = true)
	public ShiftResponse getShiftById(Long id) {
		log.debug("Buscando shift por id: {}", id);

		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> {
					log.warn("Shift no encontrado: {}", id);
					return new ResourceNotFoundException("Shift no encontrado: " + id);
				});

		return toResponse(shift);
	}

	@Override
	@Transactional
	public ShiftResponse updateShift(Long id, UpdateShiftRequest request) {
		Objects.requireNonNull(request, "request no puede ser null");
		log.info("Actualizando shift id: {}", id);

		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));

		shift.setShiftDate(request.shiftDate());
		shift.setIncome(request.income());
		shift.setGas(request.gas());
		shift.setOtherExpenses(request.otherExpenses());

		Shift updated = shiftRepository.save(shift);
		log.info("Shift actualizado id: {}", id);
		return toResponse(updated);
	}

	@Override
	@Transactional
	public ShiftResponse patchShift(Long id, PatchShiftRequest request) {
		Objects.requireNonNull(request, "request no puede ser null");
		log.info("Patch shift id: {}", id);

		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));

		if (request.shiftDate() != null)      shift.setShiftDate(request.shiftDate());
		if (request.income() != null)         shift.setIncome(request.income());
		if (request.gas() != null)            shift.setGas(request.gas());
		if (request.otherExpenses() != null)  shift.setOtherExpenses(request.otherExpenses());

		return toResponse(shiftRepository.save(shift));
	}

	@Override
	@Transactional
	public void deleteShift(Long id) {
		log.warn("Eliminando shift id: {}", id);

		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));

		shiftRepository.delete(shift);
	}

	// ===================== HELPERS =====================

	private List<Shift> findByRange(LocalDate from, LocalDate to) {
		if (from != null && to != null) return shiftRepository.findByShiftDateBetween(from, to);
		if (from != null)               return shiftRepository.findByShiftDateGreaterThanEqual(from);
		if (to != null)                 return shiftRepository.findByShiftDateLessThanEqual(to);
		return shiftRepository.findAll(Sort.by(Sort.Direction.DESC, "shiftDate"));
	}

	private Page<Shift> findPageByRange(LocalDate from, LocalDate to, Pageable pageable) {
		if (from != null && to != null) return shiftRepository.findByShiftDateBetween(from, to, pageable);
		if (from != null)               return shiftRepository.findByShiftDateGreaterThanEqual(from, pageable);
		if (to != null)                 return shiftRepository.findByShiftDateLessThanEqual(to, pageable);
		return shiftRepository.findAll(pageable);
	}

	private Long requireId(Long id) {
		if (id == null) throw new IllegalArgumentException("id no puede ser null");
		return id;
	}

	private void validateRange(LocalDate from, LocalDate to) {
		if (from != null && to != null && from.isAfter(to)) {
			throw new IllegalArgumentException("from no puede ser mayor que to");
		}
	}

	private ShiftResponse toResponse(Shift shift) {
		return new ShiftResponse(
				shift.getId(),
				shift.getShiftDate(),
				shift.getIncome(),
				shift.getGas(),
				shift.getOtherExpenses(),
				shift.getNetEarnings()
		);
	}
}