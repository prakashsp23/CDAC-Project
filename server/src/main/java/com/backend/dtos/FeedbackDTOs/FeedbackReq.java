package com.backend.dtos.FeedbackDTOs;

import lombok.Data;

@Data
public class FeedbackReq {

    private Long serviceId;
    private Integer rating;
    private String comments;
}
