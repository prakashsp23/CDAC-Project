package com.backend.dtos.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuickStatsDto {
    private Long activeMechanics;
    private Long pendingRequests;
    private Double avgRating;
}
