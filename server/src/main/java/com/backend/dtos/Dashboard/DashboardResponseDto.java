package com.backend.dtos.Dashboard;

import java.util.List;

import lombok.Data;

@Data
public class DashboardResponseDto {

    private SummaryDto summary;
    private QuickStatsDto quickStats;
    private List<UnassignedRequestDto> unassignedRequests;
}