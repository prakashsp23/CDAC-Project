package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_parts")
@AttributeOverride(name="id",column = @Column(name="service_part_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServicePart extends BaseEntity{

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long servicePartId;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    private Integer quantity;
    private Double priceAtTime;
}
