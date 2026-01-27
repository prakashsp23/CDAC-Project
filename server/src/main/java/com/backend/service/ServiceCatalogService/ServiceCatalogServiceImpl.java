package com.backend.service.ServiceCatalogService;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.ServiceCatalogDTO.CreateServiceCatalogDto;
import com.backend.dtos.ServiceCatalogDTO.ServiceCatalogDto;
import com.backend.dtos.ServiceCatalogDTO.UpdateServiceCatalogDto;
import com.backend.entity.ServiceCatalog;
import com.backend.repository.Customer.ScRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    private final ScRepository serviceCatalogRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ServiceCatalogDto> getAllServiceCatalogs() {
        List<ServiceCatalog> catalogs = serviceCatalogRepository.findAll();
        return catalogs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceCatalogDto getServiceCatalogById(Long id) {
        ServiceCatalog catalog = serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service catalog not found with id: " + id));
        return convertToDto(catalog);
    }

    @Override
    public ServiceCatalogDto createServiceCatalog(CreateServiceCatalogDto createDto) {
        ServiceCatalog catalog = modelMapper.map(createDto, ServiceCatalog.class);
        ServiceCatalog savedCatalog = serviceCatalogRepository.save(catalog);
        return convertToDto(savedCatalog);
    }

    @Override
    public ServiceCatalogDto updateServiceCatalog(Long id, UpdateServiceCatalogDto updateDto) {
        ServiceCatalog catalog = serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service catalog not found with id: " + id));

        // Update only non-null fields
        if (updateDto.getServiceName() != null && !updateDto.getServiceName().trim().isEmpty()) {
            catalog.setServiceName(updateDto.getServiceName());
        }
        if (updateDto.getDescription() != null && !updateDto.getDescription().trim().isEmpty()) {
            catalog.setDescription(updateDto.getDescription());
        }
        if (updateDto.getFullDetails() != null) {
            catalog.setFullDetails(updateDto.getFullDetails());
        }
        if (updateDto.getBasePrice() != null) {
            catalog.setBasePrice(updateDto.getBasePrice());
        }

        ServiceCatalog updatedCatalog = serviceCatalogRepository.save(catalog);
        return convertToDto(updatedCatalog);
    }

    @Override
    public void deleteServiceCatalog(Long id) {
        ServiceCatalog catalog = serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service catalog not found with id: " + id));
        serviceCatalogRepository.delete(catalog);
    }

    private ServiceCatalogDto convertToDto(ServiceCatalog catalog) {
        return modelMapper.map(catalog, ServiceCatalogDto.class);
    }
}
