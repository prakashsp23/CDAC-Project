package com.backend.dtos.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SummaryDto {
    private Long totalUsers;
    private Long totalBookings;
    private Long ongoingServices;
    private Long completedServices;
}
