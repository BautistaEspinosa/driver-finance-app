package com.baersolutions.driver_finance_app.fuel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FuelLoadResponse(
    Long id,
    LocalDate loadDate,
    BigDecimal liters,
    BigDecimal totalCost,
    Integer odometer,
    BigDecimal pricePerLiter
) {
}