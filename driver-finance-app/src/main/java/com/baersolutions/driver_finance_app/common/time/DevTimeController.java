package com.baersolutions.driver_finance_app.common.time;

import com.baersolutions.driver_finance_app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/dev/time")
@RequiredArgsConstructor
public class DevTimeController {

  private final MutableTimeProvider timeProvider;

  @PutMapping
  public ApiResponse<Map<String, Object>> setDate(
      @RequestParam
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate date
  ) {

    timeProvider.setFixedDate(date);

    return ApiResponse.ok(Map.of(
        "testMode", true,
        "currentDate", date
    ));
  }

  @DeleteMapping
  public ApiResponse<Map<String, Object>> reset() {

    timeProvider.reset();

    return ApiResponse.ok(Map.of(
        "testMode", false,
        "currentDate", LocalDate.now()
    ));
  }

  @GetMapping
  public ApiResponse<Map<String, Object>> current() {

    return ApiResponse.ok(Map.of(
        "testMode", timeProvider.isTestMode(),
        "currentDate", timeProvider.today()
    ));
  }
}