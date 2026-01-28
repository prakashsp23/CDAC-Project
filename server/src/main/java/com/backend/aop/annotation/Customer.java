package com.backend.aop.annotation;

import com.backend.entity.Role;
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@RequireRole(Role.CUSTOMER)
public @interface Customer {
}