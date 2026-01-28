package com.backend.dtos.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UnassignedRequestDto {

    private String id;
    private String customerName;
    private String serviceType;
    private String status;
    private String timeAgo;
}
