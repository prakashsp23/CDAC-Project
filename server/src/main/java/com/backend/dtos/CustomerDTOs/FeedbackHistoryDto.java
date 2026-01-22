package com.backend.dtos.CustomerDTOs;

import java.time.LocalDate;

import lombok.Data;

@Data
public class FeedbackHistoryDto {
    private String serviceName;
    private Integer rating;
    private String comments;
    private LocalDate date;
    private String adminNote;
}
