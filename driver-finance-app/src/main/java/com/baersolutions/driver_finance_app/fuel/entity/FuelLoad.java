package com.baersolutions.driver_finance_app.fuel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="fuel_loads")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class FuelLoad {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  @Column(name = "load_date", nullable = false)
  private LocalDate loadDate;

  @Column(nullable = false, precision = 19, scale = 2)
  private BigDecimal liters;

  @Column(name = "total_cost", nullable = false, precision = 19, scale = 2)
  private BigDecimal totalCost;

  @Column(nullable = false)
  private Integer odometer;

  public BigDecimal getPricePerLiter() {
    if (liters == null || liters.compareTo(BigDecimal.ZERO) == 0) {
      return BigDecimal.ZERO;
    }

    return totalCost.divide(liters, 2, RoundingMode.HALF_UP);
  }
}
