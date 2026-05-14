package com.baersolutions.driver_finance_app.common.exception;

// NUEVA: excepción semántica para meta duplicada.
// El GlobalExceptionHandler la mapea a 409 Conflict en lugar de 500.
public class DuplicateGoalException extends RuntimeException {

  public DuplicateGoalException(String message) {
    super(message);
  }
}