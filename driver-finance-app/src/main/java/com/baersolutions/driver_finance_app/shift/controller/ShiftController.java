package com.baersolutions.driver_finance_app.shift.controller;

import com.baersolutions.driver_finance_app.common.dto.ApiResponse;
import com.baersolutions.driver_finance_app.common.dto.PageResponse;
import com.baersolutions.driver_finance_app.shift.dto.CreateShiftRequest;
import com.baersolutions.driver_finance_app.shift.dto.PatchShiftRequest;
import com.baersolutions.driver_finance_app.shift.dto.ShiftResponse;
import com.baersolutions.driver_finance_app.shift.dto.ShiftSummaryResponse;
import com.baersolutions.driver_finance_app.shift.dto.UpdateShiftRequest;
import com.baersolutions.driver_finance_app.shift.service.ShiftService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {


	private static final Set<String> SORTABLE_FIELDS = Set.of(
			"shiftDate", "income", "gas", "otherExpenses"
	);

	private final ShiftService shiftService;

	public ShiftController(ShiftService shiftService) {
		this.shiftService = shiftService;
	}

	@PostMapping
	public ResponseEntity<ApiResponse<ShiftResponse>> registerShift(
			@RequestBody @Valid CreateShiftRequest request) {
		ShiftResponse shift = shiftService.registerShift(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(shift));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ShiftResponse>> getById(@PathVariable Long id) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftById(id)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<ShiftResponse>> update(
			@PathVariable Long id,
			@RequestBody @Valid UpdateShiftRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.updateShift(id, request)));
	}

	@PatchMapping("/{id}")
	public ResponseEntity<ApiResponse<ShiftResponse>> patch(
			@PathVariable Long id,
			@RequestBody @Valid PatchShiftRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.patchShift(id, request)));
	}

	// MEJORA: DELETE devuelve 204 No Content — semánticamente más correcto
	// que 200 OK con body null para operaciones de borrado.
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		shiftService.deleteShift(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<ShiftResponse>>> getHistory(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftHistory(from, to)));
	}

	@GetMapping("/page")
	public ResponseEntity<ApiResponse<PageResponse<ShiftResponse>>> getHistoryPage(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
			@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
			@RequestParam(defaultValue = "shiftDate,desc") String sort) {
		Pageable pageable = PageRequest.of(page, size, parseSort(sort));
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftHistory(from, to, pageable)));
	}

	@GetMapping("/summary")
	public ResponseEntity<ApiResponse<ShiftSummaryResponse>> getSummary(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftSummary(from, to)));
	}

	// MEJORA: parseSort ahora valida contra una whitelist antes de construir el Sort.
	// Sin esto, cualquier string del request llega directo a JPA.
	private Sort parseSort(String sort) {
		if (sort == null || sort.isBlank()) {
			return Sort.by(Sort.Direction.DESC, "shiftDate");
		}
		String[] parts = sort.split(",");
		String property = parts[0].trim();

		if (!SORTABLE_FIELDS.contains(property)) {
			// campo inválido → fallback seguro al default
			property = "shiftDate";
		}

		Sort.Direction direction = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1].trim()))
				? Sort.Direction.ASC
				: Sort.Direction.DESC;

		return Sort.by(direction, property);
	}
}