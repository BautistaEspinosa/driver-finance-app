package com.baersolutions.driver_finance_app.service.impl;

import com.baersolutions.driver_finance_app.api.dto.common.WeeklyGoalProgressResponse;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.CreateWeeklyGoalRequest;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.WeeklyGoalResponse;
import com.baersolutions.driver_finance_app.api.exception.ResourceNotFoundException;
import com.baersolutions.driver_finance_app.domain.entity.Shift;
import com.baersolutions.driver_finance_app.domain.entity.WeeklyGoal;
import com.baersolutions.driver_finance_app.repository.ShiftRepository;
import com.baersolutions.driver_finance_app.repository.WeeklyGoalRepository;
import com.baersolutions.driver_finance_app.service.WeeklyGoalService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WeeklyGoalServiceImpl implements WeeklyGoalService {

  private final WeeklyGoalRepository weeklyGoalRepository;
  private final ShiftRepository shiftRepository;


  @Override
  public WeeklyGoalProgressResponse getCurrentGoalProgress() {

    LocalDate today = LocalDate.now();

    Optional<WeeklyGoal> goalOpt =
        weeklyGoalRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

    if (goalOpt.isEmpty()) {
      throw new ResourceNotFoundException("No hay meta activa");
    }

    WeeklyGoal goal = goalOpt.get();

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
    if(request == null){
      throw new IllegalArgumentException("Request no puede venir nulo");
    }
    if (request.amount() == null || request.amount().signum() <= 0) {
      throw new IllegalArgumentException("amount debe ser mayor a 0");
    }
    LocalDate today = LocalDate.now();

    WeeklyGoal weeklyGoal = new WeeklyGoal();
    weeklyGoal.setAmount(request.amount());
    weeklyGoal.setStartDate(today);
    weeklyGoal.setEndDate(today.plusDays(6));

    WeeklyGoal saved = weeklyGoalRepository.save(weeklyGoal);
    return toResponse(saved);
  }

private WeeklyGoalResponse toResponse(WeeklyGoal weeklyGoal){
    return new WeeklyGoalResponse(
        weeklyGoal.getId(),
        weeklyGoal.getAmount(),
        weeklyGoal.getStartDate(),
        weeklyGoal.getEndDate()
    );
}
}
