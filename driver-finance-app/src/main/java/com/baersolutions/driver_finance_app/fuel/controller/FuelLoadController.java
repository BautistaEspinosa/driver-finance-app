package com.baersolutions.driver_finance_app.fuel.controller;

import com.baersolutions.driver_finance_app.common.dto.ApiResponse;
import com.baersolutions.driver_finance_app.fuel.dto.CreateFuelLoadRequest;
import com.baersolutions.driver_finance_app.fuel.dto.FuelLoadResponse;
import com.baersolutions.driver_finance_app.fuel.service.FuelLoadService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/fuel-loads")
public class FuelLoadController {

  private final FuelLoadService fuelLoadService;

  public FuelLoadController(FuelLoadService fuelLoadService) {
    this.fuelLoadService = fuelLoadService;
  }

  @PostMapping
  public ResponseEntity<ApiResponse<FuelLoadResponse>> registerFuelLoad(
      @RequestBody @Valid CreateFuelLoadRequest request
  ) {
    FuelLoadResponse response = fuelLoadService.registerFuelLoad(request);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(ApiResponse.ok(response));
  }

  @GetMapping
  public ResponseEntity<ApiResponse<List<FuelLoadResponse>>> getFuelLoads(
      @RequestParam(required = false)
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate from,

      @RequestParam(required = false)
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate to
  ) {
    return ResponseEntity.ok(
        ApiResponse.ok(fuelLoadService.getFuelLoads(from, to))
    );
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<FuelLoadResponse>> getFuelLoadById(
      @PathVariable Long id
  ) {
    return ResponseEntity.ok(
        ApiResponse.ok(fuelLoadService.getFuelLoadById(id))
    );
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteFuelLoad(@PathVariable Long id) {
    fuelLoadService.deleteFuelLoad(id);

    return ResponseEntity.noContent().build();
  }
}