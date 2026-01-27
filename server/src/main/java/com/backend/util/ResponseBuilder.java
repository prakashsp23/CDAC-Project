package com.backend.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.backend.dtos.ApiResponse;

public class ResponseBuilder {

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();

        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data, Object pagination) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .pagination(pagination)
                .build();

        return ResponseEntity.ok(response);
    }

    public static ResponseEntity<ApiResponse<Object>> error(HttpStatus status, String message, Object errors) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(message)
                .errors(errors)
                .build();

        return ResponseEntity.status(status).body(response);
    }
}
