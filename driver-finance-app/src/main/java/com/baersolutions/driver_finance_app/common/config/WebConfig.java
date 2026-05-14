package com.baersolutions.driver_finance_app.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private final LoggingInterceptor loggingInterceptor;

  public WebConfig(LoggingInterceptor loggingInterceptor) {
    this.loggingInterceptor = loggingInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {

    registry.addInterceptor(loggingInterceptor)
        .addPathPatterns("/api/**"); // solo tus endpoints
  }
}