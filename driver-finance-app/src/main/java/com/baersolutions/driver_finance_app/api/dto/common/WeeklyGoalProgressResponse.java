package com.baersolutions.driver_finance_app.api.dto.common;

import java.math.BigDecimal;
import java.time.LocalDate;

public record WeeklyGoalProgressResponse(
    BigDecimal amount,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal current,
    BigDecimal remaining,
    BigDecimal percentage
) {}
