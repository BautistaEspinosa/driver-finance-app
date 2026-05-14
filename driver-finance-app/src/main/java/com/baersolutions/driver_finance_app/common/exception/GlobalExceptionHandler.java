package com.baersolutions.driver_finance_app.common.exception;

import com.baersolutions.driver_finance_app.common.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
		log.warn("Error de validación: {}", ex.getMessage());
		return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(this::formatFieldError)
				.collect(Collectors.joining("; "));

		log.warn("Error DTO validation: {}", message);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiResponse.fail(message));
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
		log.warn("Recurso no encontrado: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiResponse.fail(ex.getMessage()));
	}

	// NUEVO: DuplicateGoalException → 409 Conflict (antes era 500 por caer en handleGeneric).
	@ExceptionHandler(DuplicateGoalException.class)
	public ResponseEntity<ApiResponse<Void>> handleDuplicateGoal(DuplicateGoalException ex) {
		log.warn("Meta duplicada: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(ApiResponse.fail(ex.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
		log.error("Error inesperado", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiResponse.fail("Error interno"));
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ApiResponse<Void>> handleMissingParams(
			MissingServletRequestParameterException ex
	) {
		return ResponseEntity.badRequest()
				.body(ApiResponse.fail("Falta parámetro: " + ex.getParameterName()));
	}
	private String formatFieldError(FieldError error) {
		return error.getField() + ": " + error.getDefaultMessage();
	}
}