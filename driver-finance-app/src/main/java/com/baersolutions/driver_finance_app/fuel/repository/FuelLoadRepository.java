package com.baersolutions.driver_finance_app.fuel.repository;

import com.baersolutions.driver_finance_app.fuel.entity.FuelLoad;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FuelLoadRepository extends JpaRepository<FuelLoad, Long> {

  List<FuelLoad> findByLoadDateBetween(LocalDate from, LocalDate to);

  List<FuelLoad> findByLoadDateGreaterThanEqual(LocalDate from);

  List<FuelLoad> findByLoadDateLessThanEqual(LocalDate to);

  List<FuelLoad> findAllByOrderByLoadDateDesc();

  List<FuelLoad> findAll(Sort sort);
}