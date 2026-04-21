package com.baersolutions.driver_finance_app.service.impl;

import com.baersolutions.driver_finance_app.api.dto.common.WeeklyGoalProgressResponse;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.CreateWeeklyGoalRequest;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.WeeklyGoalResponse;
import com.baersolutions.driver_finance_app.domain.entity.Shift;
import com.baersolutions.driver_finance_app.domain.entity.WeeklyGoal;
import com.baersolutions.driver_finance_app.repository.ShiftRepository;
import com.baersolutions.driver_finance_app.repository.WeeklyGoalRepository;
import com.baersolutions.driver_finance_app.service.WeeklyGoalService;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyGoalServiceImpl implements WeeklyGoalService {

  private static final Logger log = LoggerFactory.getLogger(WeeklyGoalServiceImpl.class);

  private final WeeklyGoalRepository weeklyGoalRepository;
  private final ShiftRepository shiftRepository;

  @Override
  public WeeklyGoalProgressResponse getCurrentGoalProgress() {

    LocalDate today = LocalDate.now();

    log.debug("Buscando meta semanal activa para fecha: {}", today);

    List<WeeklyGoal> goals =
        weeklyGoalRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

    if (goals.isEmpty()) {
      log.info("No hay meta semanal activa");
      return WeeklyGoalProgressResponse.empty();
    }

    WeeklyGoal goal = goals.stream()
        .max(Comparator.comparing(WeeklyGoal::getStartDate))
        .orElseThrow(() -> {
          log.error("Error inesperado obteniendo meta activa");
          return new IllegalStateException("Error obteniendo meta activa");
        });

    log.debug("Meta encontrada: id={}, amount={}", goal.getId(), goal.getAmount());

    List<Shift> shifts = shiftRepository.findByShiftDateBetween(
        goal.getStartDate(),
        goal.getEndDate()
    );

    BigDecimal current = shifts.stream()
        .map(s -> s.getIncome()
            .subtract(s.getGas())
            .subtract(s.getOtherExpenses()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal remaining = goal.getAmount().subtract(current);

    BigDecimal percentage = BigDecimal.ZERO;

    if (goal.getAmount().compareTo(BigDecimal.ZERO) > 0) {
      percentage = current
          .divide(goal.getAmount(), 4, RoundingMode.HALF_UP)
          .multiply(BigDecimal.valueOf(100));
    }

    log.info("Progreso meta semanal: current={}, remaining={}, percentage={}",
        current, remaining, percentage);

    return new WeeklyGoalProgressResponse(
        goal.getAmount(),
        goal.getStartDate(),
        goal.getEndDate(),
        current,
        remaining,
        percentage
    );
  }

  @Override
  public WeeklyGoalResponse createWeeklyGoal(CreateWeeklyGoalRequest request) {

    if (request == null) {
      throw new IllegalArgumentException("Request no puede venir nulo");
    }

    if (request.amount() == null || request.amount().signum() <= 0) {
      throw new IllegalArgumentException("amount debe ser mayor a 0");
    }

    LocalDate today = LocalDate.now();

    log.info("Creando nueva meta semanal para fecha: {}", today);

    List<WeeklyGoal> existing =
        weeklyGoalRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

    if (!existing.isEmpty()) {
      WeeklyGoal existingGoal = existing.get(0);

      log.warn("Intento de crear meta duplicada. Ya existe una activa id={}", existingGoal.getId());

      throw new IllegalStateException(
          "Ya existe una meta activa para esta semana (del "
              + existingGoal.getStartDate() + " al "
              + existingGoal.getEndDate() + ")"
      );
    }

    WeeklyGoal weeklyGoal = new WeeklyGoal();
    weeklyGoal.setAmount(request.amount());
    weeklyGoal.setStartDate(today);
    weeklyGoal.setEndDate(today.plusDays(6));

    WeeklyGoal saved = weeklyGoalRepository.save(weeklyGoal);

    log.info("Meta semanal creada con id: {}", saved.getId());

    return toResponse(saved);
  }

  // ===================== MAPPER =====================

  private WeeklyGoalResponse toResponse(WeeklyGoal weeklyGoal) {
    return new WeeklyGoalResponse(
        weeklyGoal.getId(),
        weeklyGoal.getAmount(),
        weeklyGoal.getStartDate(),
        weeklyGoal.getEndDate()
    );
  }
}