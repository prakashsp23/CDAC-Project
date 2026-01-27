package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_catalog")
@AttributeOverride(name="id",column = @Column(name="catalog_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// @ToString(exclude = {"services"})
public class ServiceCatalog extends BaseEntity{

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long catalogId;

    private String serviceName;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String fullDetails;

    private Double basePrice;

    // Bidirectional: ServiceCatalog has many Services
    // @OneToMany(mappedBy = "catalog")
    // private List<Services> services = new ArrayList<>();
}
