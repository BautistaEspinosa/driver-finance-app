package com.baersolutions.driver_finance_app.shift.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateShiftRequest(
		@NotNull LocalDate shiftDate,
		@NotNull @PositiveOrZero BigDecimal income,
		@NotNull @PositiveOrZero BigDecimal gas,
		@NotNull @PositiveOrZero BigDecimal otherExpenses
) {
}

