package com.baersolutions.driver_finance_app.goal.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalProgressResponse(
    BigDecimal targetAmount,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal current,
    BigDecimal remaining,
    long daysLeft,
    BigDecimal requiredPerDay,
    BigDecimal avgPerDay,
    String status
) {}
