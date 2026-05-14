package com.baersolutions.driver_finance_app.shift.service;

import com.baersolutions.driver_finance_app.common.dto.PageResponse;
import com.baersolutions.driver_finance_app.shift.dto.PatchShiftRequest;
import com.baersolutions.driver_finance_app.shift.dto.CreateShiftRequest;
import com.baersolutions.driver_finance_app.shift.dto.ShiftResponse;
import com.baersolutions.driver_finance_app.shift.dto.ShiftSummaryResponse;
import com.baersolutions.driver_finance_app.shift.dto.UpdateShiftRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ShiftService {

	ShiftResponse registerShift(CreateShiftRequest request);

	List<ShiftResponse> getShiftHistory(LocalDate from, LocalDate to);

	PageResponse<ShiftResponse> getShiftHistory(LocalDate from, LocalDate to, Pageable pageable);

	ShiftSummaryResponse getShiftSummary(LocalDate from, LocalDate to);

	ShiftResponse getShiftById(Long id);

	ShiftResponse updateShift(Long id, UpdateShiftRequest request);

	ShiftResponse patchShift(Long id, PatchShiftRequest request);

	void deleteShift(Long id);
}

