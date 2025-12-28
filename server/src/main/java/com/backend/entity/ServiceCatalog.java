package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long catalogId;

    private String serviceName;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String fullDetails;

    private Double basePrice;
}
