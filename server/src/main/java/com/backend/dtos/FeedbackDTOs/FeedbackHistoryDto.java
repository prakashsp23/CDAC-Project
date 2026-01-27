package com.backend.dtos.FeedbackDTOs;

import java.time.LocalDate;

import lombok.Data;

@Data
public class FeedbackHistoryDto {
    private String serviceName;
    private Integer rating;
    private String comments;
    private LocalDate createdOn;
    private String adminNote;
}
