package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServicePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long servicePartId;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    private Integer quantity;
    private Double priceAtTime;
}
