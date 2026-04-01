package com.baersolutions.driver_finance_app.api.controller;

import com.baersolutions.driver_finance_app.api.dto.common.ApiResponse;
import com.baersolutions.driver_finance_app.api.dto.common.PageResponse;
import com.baersolutions.driver_finance_app.api.dto.shift.CreateShiftRequest;
import com.baersolutions.driver_finance_app.api.dto.shift.PatchShiftRequest;
import com.baersolutions.driver_finance_app.api.dto.shift.ShiftResponse;
import com.baersolutions.driver_finance_app.api.dto.shift.ShiftSummaryResponse;
import com.baersolutions.driver_finance_app.api.dto.shift.UpdateShiftRequest;
import com.baersolutions.driver_finance_app.service.ShiftService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

	private final ShiftService shiftService;

	public ShiftController(ShiftService shiftService) {
		this.shiftService = shiftService;
	}
	@PostMapping
	public ResponseEntity<ApiResponse<ShiftResponse>> registerShift(@RequestBody @Valid CreateShiftRequest request) {
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
			@RequestBody @Valid UpdateShiftRequest request
	) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.updateShift(id, request)));
	}

	@PatchMapping("/{id}")
	public ResponseEntity<ApiResponse<ShiftResponse>> patch(
			@PathVariable Long id,
			@RequestBody @Valid PatchShiftRequest request
	) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.patchShift(id, request)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
		shiftService.deleteShift(id);
		return ResponseEntity.ok(ApiResponse.ok(null));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<ShiftResponse>>> getHistory(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
	) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftHistory(from, to)));
	}

	@GetMapping("/page")
	public ResponseEntity<ApiResponse<PageResponse<ShiftResponse>>> getHistoryPage(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
			@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
			@RequestParam(defaultValue = "shiftDate,desc") String sort
	) {
		Pageable pageable = PageRequest.of(page, size, parseSort(sort));
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftHistory(from, to, pageable)));
	}

	@GetMapping("/summary")
	public ResponseEntity<ApiResponse<ShiftSummaryResponse>> getSummary(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
	) {
		return ResponseEntity.ok(ApiResponse.ok(shiftService.getShiftSummary(from, to)));
	}

	private Sort parseSort(String sort) {
		if (sort == null || sort.isBlank()) {
			return Sort.by(Sort.Direction.DESC, "shiftDate");
		}
		String[] parts = sort.split(",");
		String property = parts[0].trim();
		Sort.Direction direction = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1].trim()))
				? Sort.Direction.ASC
				: Sort.Direction.DESC;
		return Sort.by(direction, property);
	}
}

