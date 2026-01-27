package com.backend.dtos.AdminDTOs;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AdminFeedbackDTO {

    private Long feedbackId;

    private Long serviceId;
    private String serviceType;

    private String customerName;
    private String mechanicName;

    private Integer rating;
    private String comment;
    private LocalDate date;
}
  