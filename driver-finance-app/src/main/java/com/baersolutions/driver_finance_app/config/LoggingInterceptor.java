package com.baersolutions.driver_finance_app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoggingInterceptor implements HandlerInterceptor {

  private static final Logger log = LoggerFactory.getLogger(LoggingInterceptor.class);
  private static final String START_TIME = "startTime";

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

    long startTime = System.currentTimeMillis();
    request.setAttribute(START_TIME, startTime);

    // 🔹 log opcional de entrada (nivel debug para no ensuciar)
    log.debug("Incoming request: {} {}", request.getMethod(), request.getRequestURI());

    return true;
  }

  @Override
  public void afterCompletion(
      HttpServletRequest request,
      HttpServletResponse response,
      Object handler,
      Exception ex
  ) {

    long startTime = (long) request.getAttribute(START_TIME);
    long duration = System.currentTimeMillis() - startTime;

    String method = request.getMethod();
    String uri = request.getRequestURI();
    int status = response.getStatus();

    // 🔥 Log principal (esto es lo importante)
    log.info("{} {} → {} ({} ms)", method, uri, status, duration);

    // 🔴 Si hubo error real
    if (ex != null) {
      log.error("Error en request {} {}: {}", method, uri, ex.getMessage(), ex);
    }

    // 🟡 Si fue lento (performance warning)
    if (duration > 1000) {
      log.warn("Request lenta detectada: {} {} tomó {} ms", method, uri, duration);
    }
  }
}