package com.backend.service.DashboardService;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.dtos.Dashboard.DashboardResponseDto;
import com.backend.dtos.Dashboard.QuickStatsDto;
import com.backend.dtos.Dashboard.SummaryDto;
import com.backend.dtos.Dashboard.UnassignedRequestDto;
import com.backend.entity.Role;
import com.backend.entity.ServiceStatus;
import com.backend.entity.Services;
import com.backend.repository.ServiceRepository;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public DashboardResponseDto getDashboardData() {

        // ===== Summary =====
        SummaryDto summary = new SummaryDto(
                userRepository.count(),
                serviceRepository.count(),
                serviceRepository.countByStatus(ServiceStatus.ONGOING),
                serviceRepository.countByStatus(ServiceStatus.COMPLETED)
        );

        // ===== Quick Stats =====
        QuickStatsDto quickStats = new QuickStatsDto(
                userRepository.countByRole(Role.MECHANIC),
                serviceRepository.countByStatus(ServiceStatus.PENDING),
                4.7 // placeholder, link with feedback later
        );

        // ===== Unassigned Requests =====
        List<UnassignedRequestDto> unassigned = serviceRepository
                .findUnassignedServices()
                .stream()
                .limit(5)
                .map(this::mapToDto)
                .collect(Collectors.toList());

        DashboardResponseDto response = new DashboardResponseDto();
        response.setSummary(summary);
        response.setQuickStats(quickStats);
        response.setUnassignedRequests(unassigned);

        return response;
    }

    private UnassignedRequestDto mapToDto(Services s) {

        String timeAgo = getTimeAgo(s.getCreatedOn().atStartOfDay());

        return new UnassignedRequestDto(
                "REQ-" + String.format("%03d", s.getId()),
                s.getUser().getName(),
                s.getCatalog().getServiceName(),
                "New",
                timeAgo
        );
    }

    private String getTimeAgo(LocalDateTime created) {
        long minutes = Duration.between(created, LocalDateTime.now()).toMinutes();
        if (minutes < 60) return minutes + "m ago";
        return (minutes / 60) + "h ago";
    }
}
