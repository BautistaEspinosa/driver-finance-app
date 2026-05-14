package com.baersolutions.driver_finance_app.goal.repository;

import com.baersolutions.driver_finance_app.goal.entity.Goal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Long> {

  List<Goal> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
      LocalDate date1,
      LocalDate date2
  );
}