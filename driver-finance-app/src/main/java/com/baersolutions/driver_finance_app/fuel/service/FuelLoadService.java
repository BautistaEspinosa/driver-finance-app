package com.baersolutions.driver_finance_app.fuel.service;

import com.baersolutions.driver_finance_app.fuel.dto.CreateFuelLoadRequest;
import com.baersolutions.driver_finance_app.fuel.dto.FuelLoadResponse;

import java.time.LocalDate;
import java.util.List;

public interface FuelLoadService {

  FuelLoadResponse registerFuelLoad(CreateFuelLoadRequest request);

  List<FuelLoadResponse> getFuelLoads(LocalDate from, LocalDate to);

  FuelLoadResponse getFuelLoadById(Long id);

  void deleteFuelLoad(Long id);
}