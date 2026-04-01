package com.baersolutions.driver_finance_app.repository;

import com.baersolutions.driver_finance_app.domain.entity.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

	List<Shift> findByShiftDateBetween(LocalDate from, LocalDate to);

	List<Shift> findByShiftDateGreaterThanEqual(LocalDate from);

	List<Shift> findByShiftDateLessThanEqual(LocalDate to);

	Page<Shift> findByShiftDateBetween(LocalDate from, LocalDate to, Pageable pageable);

	Page<Shift> findByShiftDateGreaterThanEqual(LocalDate from, Pageable pageable);

	Page<Shift> findByShiftDateLessThanEqual(LocalDate to, Pageable pageable);
}

