package com.baersolutions.driver_finance_app.api.dto.weeklyGoal;

import java.math.BigDecimal;

public record CreateWeeklyGoalRequest(
    BigDecimal amount
) {

}
