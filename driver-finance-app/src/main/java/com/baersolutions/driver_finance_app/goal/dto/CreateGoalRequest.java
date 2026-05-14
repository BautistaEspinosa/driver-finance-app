package com.baersolutions.driver_finance_app.goal.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateGoalRequest(

    @NotNull(message = "El monto es requerido")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    BigDecimal amount,


    @NotNull(message = "La fecha de fin es requerida")
    LocalDate endDate
) {}