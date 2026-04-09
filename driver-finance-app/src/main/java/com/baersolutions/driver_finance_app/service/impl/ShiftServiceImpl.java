package com.baersolutions.driver_finance_app.service.impl;

import com.baersolutions.driver_finance_app.api.dto.common.PageResponse;
import com.baersolutions.driver_finance_app.api.dto.shift.CreateShiftRequest;
import com.baersolutions.driver_finance_app.api.dto.shift.PatchShiftRequest;
import com.baersolutions.driver_finance_app.api.dto.shift.ShiftResponse;
import com.baersolutions.driver_finance_app.api.dto.shift.ShiftSummaryResponse;
import com.baersolutions.driver_finance_app.api.dto.shift.UpdateShiftRequest;
import com.baersolutions.driver_finance_app.api.exception.ResourceNotFoundException;
import com.baersolutions.driver_finance_app.domain.entity.Shift;
import com.baersolutions.driver_finance_app.repository.ShiftRepository;
import com.baersolutions.driver_finance_app.service.ShiftService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class ShiftServiceImpl implements ShiftService {

	private final ShiftRepository shiftRepository;

	public ShiftServiceImpl(ShiftRepository shiftRepository) {
		this.shiftRepository = shiftRepository;
	}

	@Override
	public ShiftResponse registerShift(CreateShiftRequest request) {
		if (request == null) {
			throw new IllegalArgumentException("request no puede ser null");
		}

		validateMoneyNonNullAndNonNegative(request.income(), "income");
		validateMoneyNonNullAndNonNegative(request.gas(), "gas");
		validateMoneyNonNullAndNonNegative(request.otherExpenses(), "otherExpenses");

		Shift shift = new Shift();
		shift.setShiftDate(Objects.requireNonNull(request.shiftDate(), "shiftDate"));
		shift.setIncome(request.income());
		shift.setGas(request.gas());
		shift.setOtherExpenses(request.otherExpenses());

		System.out.println("🟢 Guardando shift con fecha: " + request.shiftDate());
		Shift saved = shiftRepository.save(shift);
		System.out.println("🟢 Shift guardado en BD: " + saved.getShiftDate());
		return toResponse(saved);
	}

	@Override
	public List<ShiftResponse> getShiftHistory(LocalDate from, LocalDate to) {
		validateRange(from, to);

		return findByRange(from, to)
				.stream()
				.sorted((a, b) -> b.getShiftDate().compareTo(a.getShiftDate()))
				.map(this::toResponse)
				.toList();
	}

	@Override
	public PageResponse<ShiftResponse> getShiftHistory(LocalDate from, LocalDate to, Pageable pageable) {
		validateRange(from, to);
		Pageable safePageable = Objects.requireNonNull(pageable, "pageable");

		Page<Shift> page = findPageByRange(from, to, safePageable);

		return new PageResponse<>(
				page.getContent().stream().map(this::toResponse).toList(),
				page.getNumber(),
				page.getSize(),
				page.getTotalElements(),
				page.getTotalPages(),
				page.hasNext(),
				page.hasPrevious()
		);
	}

	@Override
	public ShiftSummaryResponse getShiftSummary(LocalDate from, LocalDate to) {
		validateRange(from, to);

		List<Shift> shifts = findByRange(from, to);

		BigDecimal totalIncome = shifts.stream()
				.map(Shift::getIncome)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal totalGas = shifts.stream()
				.map(Shift::getGas)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal totalOtherExpenses = shifts.stream()
				.map(Shift::getOtherExpenses)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal netEarnings = totalIncome
				.subtract(totalGas)
				.subtract(totalOtherExpenses);

		return new ShiftSummaryResponse(totalIncome, totalGas, totalOtherExpenses, netEarnings);
	}

	@Override
	public ShiftResponse getShiftById(Long id) {
		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));
		return toResponse(shift);
	}

	@Override
	public ShiftResponse updateShift(Long id, UpdateShiftRequest request) {
		if (request == null) {
			throw new IllegalArgumentException("request no puede ser null");
		}

		validateMoneyNonNullAndNonNegative(request.income(), "income");
		validateMoneyNonNullAndNonNegative(request.gas(), "gas");
		validateMoneyNonNullAndNonNegative(request.otherExpenses(), "otherExpenses");

		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));

		shift.setShiftDate(Objects.requireNonNull(request.shiftDate(), "shiftDate"));
		shift.setIncome(request.income());
		shift.setGas(request.gas());
		shift.setOtherExpenses(request.otherExpenses());

		return toResponse(shiftRepository.save(shift));
	}

	@Override
	public ShiftResponse patchShift(Long id, PatchShiftRequest request) {
		if (request == null) {
			throw new IllegalArgumentException("request no puede ser null");
		}
		if (request.shiftDate() == null
				&& request.income() == null
				&& request.gas() == null
				&& request.otherExpenses() == null) {
			throw new IllegalArgumentException("Debe enviar al menos un campo para actualizar");
		}

		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));

		if (request.shiftDate() != null) {
			shift.setShiftDate(request.shiftDate());
		}
		if (request.income() != null) {
			validateMoneyNonNullAndNonNegative(request.income(), "income");
			shift.setIncome(request.income());
		}
		if (request.gas() != null) {
			validateMoneyNonNullAndNonNegative(request.gas(), "gas");
			shift.setGas(request.gas());
		}
		if (request.otherExpenses() != null) {
			validateMoneyNonNullAndNonNegative(request.otherExpenses(), "otherExpenses");
			shift.setOtherExpenses(request.otherExpenses());
		}

		return toResponse(shiftRepository.save(shift));
	}

	@Override
	public void deleteShift(Long id) {
		Shift shift = shiftRepository.findById(requireId(id))
				.orElseThrow(() -> new ResourceNotFoundException("Shift no encontrado: " + id));

		shiftRepository.delete(shift);
	}

	private List<Shift> findByRange(LocalDate from, LocalDate to) {
		if (from != null && to != null) {
			return shiftRepository.findByShiftDateBetween(from, to);
		}
		if (from != null) {
			return shiftRepository.findByShiftDateGreaterThanEqual(from);
		}
		if (to != null) {
			return shiftRepository.findByShiftDateLessThanEqual(to);
		}
		return shiftRepository.findAll(Sort.by(Sort.Direction.DESC, "shiftDate"));
	}

	private Page<Shift> findPageByRange(LocalDate from, LocalDate to, Pageable pageable) {
		if (from != null && to != null) {
			return shiftRepository.findByShiftDateBetween(from, to, pageable);
		}
		if (from != null) {
			return shiftRepository.findByShiftDateGreaterThanEqual(from, pageable);
		}
		if (to != null) {
			return shiftRepository.findByShiftDateLessThanEqual(to, pageable);
		}
		return shiftRepository.findAll(pageable);
	}

	private Long requireId(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("id no puede ser null");
		}
		return id;
	}

	private void validateRange(LocalDate from, LocalDate to) {
		if (from != null && to != null && from.isAfter(to)) {
			throw new IllegalArgumentException("from no puede ser mayor que to");
		}
	}

	private void validateMoneyNonNullAndNonNegative(BigDecimal value, String fieldName) {
		if (value == null) {
			throw new IllegalArgumentException(fieldName + " no puede ser null");
		}
		if (value.signum() < 0) {
			throw new IllegalArgumentException(fieldName + " no puede ser negativo");
		}
	}

	private ShiftResponse toResponse(Shift shift) {
		return new ShiftResponse(
				shift.getId(),
				shift.getShiftDate(),
				shift.getIncome(),
				shift.getGas(),
				shift.getOtherExpenses(),
				calculateNetEarnings(shift.getIncome(), shift.getGas(), shift.getOtherExpenses())
		);
	}

	private BigDecimal calculateNetEarnings(BigDecimal income, BigDecimal gas, BigDecimal otherExpenses) {
		BigDecimal safeIncome = income != null ? income : BigDecimal.ZERO;
		BigDecimal safeGas = gas != null ? gas : BigDecimal.ZERO;
		BigDecimal safeOtherExpenses = otherExpenses != null ? otherExpenses : BigDecimal.ZERO;
		return safeIncome.subtract(safeGas).subtract(safeOtherExpenses);
	}
}