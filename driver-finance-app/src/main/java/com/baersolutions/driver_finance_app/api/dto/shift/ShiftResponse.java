package com.baersolutions.driver_finance_app.api.dto.shift;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ShiftResponse(
		Long id,
		LocalDate shiftDate,
		BigDecimal income,
		BigDecimal gas,
		BigDecimal otherExpenses,
		BigDecimal netEarnings
) {
}

