package com.baersolutions.driver_finance_app.shift.dto;

import java.math.BigDecimal;

public record ShiftSummaryResponse(
		BigDecimal totalIncome,
		BigDecimal totalGas,
		BigDecimal totalOtherExpenses,
		BigDecimal netEarnings
) {
}

