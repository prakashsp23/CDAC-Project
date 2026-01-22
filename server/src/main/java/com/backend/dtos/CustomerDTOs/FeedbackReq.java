package com.backend.dtos.CustomerDTOs;

import lombok.Data;

@Data
public class FeedbackReq {

    private Long serviceId;
    private Integer rating;
    private String comments;
}
