package com.baersolutions.driver_finance_app.common.time;

import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class SystemTimeProvider implements TimeProvider{

  @Override
  public LocalDate today(){
    return LocalDate.now();
  }
}
