package com.baersolutions.driver_finance_app.api.dto.shift;

import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PatchShiftRequest(
		LocalDate shiftDate,
		@PositiveOrZero BigDecimal income,
		@PositiveOrZero BigDecimal gas,
		@PositiveOrZero BigDecimal otherExpenses
) {
}

