package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
@AttributeOverride(name = "id", column = @Column(name = "service_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// @ToString(exclude = {"serviceParts", "feedbacks", "mechanicNotes"})
public class Services extends BaseEntity {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long serviceId;

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

    // @CreationTimestamp
    // private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private Double partsTotal;
    private Double totalAmount;

    private Boolean cancelledByAdmin;
    private String cancellationReason;
    private LocalDateTime cancelledAt;

    private LocalDate completionDate;

    private String customerNotes;

    // Bidirectional: Service has many ServiceParts
    // @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // private List<ServicePart> serviceParts = new ArrayList<>();

    // // Bidirectional: Service has many Feedbacks
    // @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    // private List<Feedback> feedbacks = new ArrayList<>();

    // Bidirectional: Service has many MechanicNotes
    // @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // private List<MechanicNote> mechanicNotes = new ArrayList<>();

    @OneToOne(mappedBy = "service", cascade = CascadeType.ALL)
    private Payment payment;
    
    @Column(name = "rescheduled_date")
    private LocalDate rescheduledDate;
    
}
