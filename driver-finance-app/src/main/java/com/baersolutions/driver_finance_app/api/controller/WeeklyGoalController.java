package com.baersolutions.driver_finance_app.api.controller;

import com.baersolutions.driver_finance_app.api.dto.common.ApiResponse;
import com.baersolutions.driver_finance_app.api.dto.common.WeeklyGoalProgressResponse;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.WeeklyGoalResponse;
import com.baersolutions.driver_finance_app.api.dto.weeklyGoal.CreateWeeklyGoalRequest;
import com.baersolutions.driver_finance_app.service.WeeklyGoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weekly-goals")
public class WeeklyGoalController {

  private final WeeklyGoalService weeklyGoalService;

  public WeeklyGoalController(WeeklyGoalService weeklyGoalService){
    this.weeklyGoalService = weeklyGoalService;
  }

  @PostMapping
  public ResponseEntity<ApiResponse<WeeklyGoalResponse>> create(
      @RequestBody @Valid CreateWeeklyGoalRequest request
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(weeklyGoalService.createWeeklyGoal(request)));
  }

  @GetMapping("/current")
  public ResponseEntity<ApiResponse<WeeklyGoalProgressResponse>> getCurrent() {
    return ResponseEntity.ok(ApiResponse.ok(weeklyGoalService.getCurrentGoalProgress()));
  }


}
