package com.baersolutions.driver_finance_app.goal.service;

import com.baersolutions.driver_finance_app.goal.dto.GoalProgressResponse;
import com.baersolutions.driver_finance_app.goal.entity.Goal;
import java.math.BigDecimal;
import java.time.LocalDate;

public interface GoalService {

  Goal createGoal(BigDecimal amount, LocalDate end);

  GoalProgressResponse getCurrentGoalProgress();
}