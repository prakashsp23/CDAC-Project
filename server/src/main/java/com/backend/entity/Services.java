package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    @ManyToOne
    @JoinColumn(name = "catalog_id")
    private ServiceCatalog catalog;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "mechanic_id")
    private User mechanic;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    private Double partsTotal;
    private Double totalAmount;

    private Boolean cancelledByAdmin;
    private String cancellationReason;
    private LocalDateTime cancelledAt;

    private LocalDate completionDate;

    private String customerNotes;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
}
