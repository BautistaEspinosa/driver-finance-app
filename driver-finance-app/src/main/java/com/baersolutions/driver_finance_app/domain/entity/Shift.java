package com.baersolutions.driver_finance_app.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;	
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "shifts")
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Shift {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Column(name = "shift_date", nullable = false)
	private LocalDate shiftDate;

	@Column(nullable = false, precision = 19, scale = 2)
	private BigDecimal income;

	@Column(nullable = false, precision = 19, scale = 2)
	private BigDecimal gas;

	@Column(name = "other_expenses", nullable = false, precision = 19, scale = 2)
	private BigDecimal otherExpenses;
}
