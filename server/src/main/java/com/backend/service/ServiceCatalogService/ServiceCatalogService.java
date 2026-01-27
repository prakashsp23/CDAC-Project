package com.backend.service.ServiceCatalogService;

import java.util.List;

import com.backend.dtos.ServiceCatalogDTO.CreateServiceCatalogDto;
import com.backend.dtos.ServiceCatalogDTO.ServiceCatalogDto;
import com.backend.dtos.ServiceCatalogDTO.UpdateServiceCatalogDto;

public interface ServiceCatalogService {

    public List<ServiceCatalogDto> getAllServiceCatalogs();

    public ServiceCatalogDto getServiceCatalogById(Long id);

    public ServiceCatalogDto createServiceCatalog(CreateServiceCatalogDto createDto);

    public ServiceCatalogDto updateServiceCatalog(Long id, UpdateServiceCatalogDto updateDto);

    public void deleteServiceCatalog(Long id);

}
