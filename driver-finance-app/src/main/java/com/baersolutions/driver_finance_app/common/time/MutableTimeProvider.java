package com.baersolutions.driver_finance_app.common.time;

import java.time.LocalDate;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class MutableTimeProvider implements TimeProvider{
  private LocalDate fixedDate;

  @Override
  public LocalDate today() {
    return fixedDate != null
        ? fixedDate
        : LocalDate.now();
  }

  public void setFixedDate(LocalDate fixedDate) {
    this.fixedDate = fixedDate;
  }

  public void reset() {
    this.fixedDate = null;
  }

  public boolean isTestMode() {
    return fixedDate != null;
  }
}
