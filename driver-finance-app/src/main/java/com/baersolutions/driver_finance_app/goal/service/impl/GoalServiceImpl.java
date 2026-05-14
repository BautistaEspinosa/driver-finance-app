
package com.baersolutions.driver_finance_app.goal.service.impl;

import com.baersolutions.driver_finance_app.common.exception.DuplicateGoalException;
import com.baersolutions.driver_finance_app.common.time.TimeProvider;
import com.baersolutions.driver_finance_app.goal.dto.GoalProgressResponse;
import com.baersolutions.driver_finance_app.goal.entity.Goal;
import com.baersolutions.driver_finance_app.goal.repository.GoalRepository;
import com.baersolutions.driver_finance_app.goal.service.GoalService;
import com.baersolutions.driver_finance_app.shift.entity.Shift;
import com.baersolutions.driver_finance_app.shift.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

  private final GoalRepository goalRepository;
  private final ShiftRepository shiftRepository;
  private final TimeProvider timeProvider;

  @Override
  public Goal createGoal(BigDecimal amount, LocalDate end) {

    LocalDate today = timeProvider.today();

    if (today.isAfter(end)) {
      throw new IllegalArgumentException("La fecha final no puede ser menor al día actual");
    }

    List<Goal> overlapping = goalRepository
        .findByStartDateLessThanEqualAndEndDateGreaterThanEqual(end, today);

    if (!overlapping.isEmpty()) {
      throw new DuplicateGoalException("Ya existe una meta en ese rango de fechas");
    }

    Goal goal = new Goal();
    goal.setTargetAmount(amount);
    goal.setStartDate(today);
    goal.setEndDate(end);

    return goalRepository.save(goal);
  }

  @Override
  public GoalProgressResponse getCurrentGoalProgress() {

    LocalDate today = timeProvider.today();

    Goal goal = goalRepository
        .findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today)
        .stream()
        .findFirst()
        .orElse(null);

    if (goal == null) {
      return null;
    }

    List<Shift> shifts = shiftRepository.findByShiftDateBetween(
        goal.getStartDate(),
        goal.getEndDate()
    );

    BigDecimal current = shifts.stream()
        .map(Shift::getNetEarnings)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal remaining = goal.getTargetAmount().subtract(current);

    long daysPassed = ChronoUnit.DAYS.between(goal.getStartDate(), today) + 1;
    long daysLeft = ChronoUnit.DAYS.between(today, goal.getEndDate());

    if (daysLeft < 0) {
      daysLeft = 0;
    }

    BigDecimal requiredPerDay = BigDecimal.ZERO;

    if (daysLeft > 0 && remaining.compareTo(BigDecimal.ZERO) > 0) {
      requiredPerDay = remaining.divide(
          BigDecimal.valueOf(daysLeft),
          2,
          RoundingMode.HALF_UP
      );
    }

    BigDecimal avgPerDay = BigDecimal.ZERO;

    if (daysPassed > 0) {
      avgPerDay = current.divide(
          BigDecimal.valueOf(daysPassed),
          2,
          RoundingMode.HALF_UP
      );
    }

    String status;

    if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
      status = "COMPLETED";
    } else if (avgPerDay.compareTo(requiredPerDay) >= 0) {
      status = "ON_TRACK";
    } else {
      status = "BEHIND";
    }

    return new GoalProgressResponse(
        goal.getTargetAmount(),
        goal.getStartDate(),
        goal.getEndDate(),
        current,
        remaining,
        daysLeft,
        requiredPerDay,
        avgPerDay,
        status
    );
  }
}