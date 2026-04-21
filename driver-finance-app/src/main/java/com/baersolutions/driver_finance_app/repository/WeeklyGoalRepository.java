package com.baersolutions.driver_finance_app.repository;

import com.baersolutions.driver_finance_app.domain.entity.WeeklyGoal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklyGoalRepository extends JpaRepository<WeeklyGoal, Long> {

  List<WeeklyGoal> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
      LocalDate date1,
      LocalDate date2
  );

  List<WeeklyGoal> findAllByOrderByStartDateDesc();
}