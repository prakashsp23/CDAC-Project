package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.aop.annotation.Admin;
import com.backend.dtos.ServiceCatalogDTO.CreateServiceCatalogDto;
import com.backend.dtos.ServiceCatalogDTO.ServiceCatalogDto;
import com.backend.dtos.ServiceCatalogDTO.UpdateServiceCatalogDto;
import com.backend.service.ServiceCatalogService.ServiceCatalogService;
import com.backend.util.ResponseBuilder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/service-catalog")
@RequiredArgsConstructor
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    public ResponseEntity<?> getAllServiceCatalogs() {
        List<ServiceCatalogDto> catalogs = serviceCatalogService.getAllServiceCatalogs();
        return ResponseBuilder.success("Service catalogs retrieved successfully", catalogs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceCatalogById(@PathVariable Long id) {
        ServiceCatalogDto catalog = serviceCatalogService.getServiceCatalogById(id);
        return ResponseBuilder.success("Service catalog retrieved successfully", catalog);
    }

    @Admin
    @PostMapping
    public ResponseEntity<?> createServiceCatalog(@RequestBody CreateServiceCatalogDto createDto) {
        ServiceCatalogDto createdCatalog = serviceCatalogService.createServiceCatalog(createDto);
        return ResponseBuilder.success("Service catalog created successfully", createdCatalog);
    }

    @Admin
    @PutMapping("/{id}")
    public ResponseEntity<?> updateServiceCatalog(@PathVariable Long id, @RequestBody UpdateServiceCatalogDto updateDto) {
        ServiceCatalogDto updatedCatalog = serviceCatalogService.updateServiceCatalog(id, updateDto);
        return ResponseBuilder.success("Service catalog updated successfully", updatedCatalog);
    }

    @Admin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteServiceCatalog(@PathVariable Long id) {
        serviceCatalogService.deleteServiceCatalog(id);
        return ResponseBuilder.success("Service catalog deleted successfully", null);
    }
}
