package com.baersolutions.driver_finance_app.goal.controller;

import com.baersolutions.driver_finance_app.common.dto.ApiResponse;
import com.baersolutions.driver_finance_app.goal.dto.CreateGoalRequest;
import com.baersolutions.driver_finance_app.goal.dto.GoalProgressResponse;
import com.baersolutions.driver_finance_app.goal.entity.Goal;
import com.baersolutions.driver_finance_app.goal.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

  private final GoalService goalService;

  @PostMapping
  public ResponseEntity<ApiResponse<Goal>> create(
      @Valid @RequestBody CreateGoalRequest request
  ) {

    Goal goal = goalService.createGoal(
        request.amount(),
        request.endDate()
    );

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(ApiResponse.ok(goal));
  }

  @GetMapping("/current")
  public ResponseEntity<ApiResponse<GoalProgressResponse>> getCurrent() {

    GoalProgressResponse response = goalService.getCurrentGoalProgress();

    return ResponseEntity.ok(ApiResponse.ok(response)); // puede ser null
  }
}