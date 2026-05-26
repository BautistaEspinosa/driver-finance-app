package com.baersolutions.driver_finance_app.fuel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateFuelLoadRequest(

    @NotNull
    LocalDate loadDate,

    @NotNull
    @Positive
    BigDecimal liters,

    @NotNull
    @Positive
    BigDecimal totalCost,

    @NotNull
    @Positive
    Integer odometer
) {
}