package com.backend.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
	@Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private boolean success;
    private String message;
    private T data;
    private Object pagination;
    private Object errors;
}
