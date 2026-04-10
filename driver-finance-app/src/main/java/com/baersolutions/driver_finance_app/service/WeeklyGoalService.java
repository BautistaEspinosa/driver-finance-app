package com.baersolutions.driver_finance_app.service;

import com.baersolutions.driver_finance_app.api.dto.common.WeeklyGoalProgressResponse;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.CreateWeeklyGoalRequest;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.WeeklyGoalResponse;

public interface WeeklyGoalService {
   WeeklyGoalProgressResponse getCurrentGoalProgress();
  WeeklyGoalResponse createWeeklyGoal(CreateWeeklyGoalRequest request);
}
