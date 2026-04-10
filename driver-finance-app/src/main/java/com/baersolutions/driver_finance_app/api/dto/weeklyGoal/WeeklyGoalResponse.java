package com.baersolutions.driver_finance_app.api.dto.weeklyGoal;
import java.math.BigDecimal;
import java.time.LocalDate;

public record WeeklyGoalResponse(
    Long id,
    BigDecimal amount,
    LocalDate startDate,
    LocalDate endDate) {

}
