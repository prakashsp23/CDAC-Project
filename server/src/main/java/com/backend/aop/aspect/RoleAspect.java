package com.backend.aop.aspect;

import com.backend.aop.annotation.Admin;
import com.backend.aop.annotation.Customer;
import com.backend.aop.annotation.Mechanic;
import com.backend.aop.annotation.RequireAnyRole;
import com.backend.entity.Role;
import com.backend.util.AuthUtil;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RoleAspect {

   

    @Before("@annotation(requireAnyRole)")
    public void checkAnyRole(RequireAnyRole requireAnyRole) {

        Role currentRole = AuthUtil.getAuthenticatedUserRole();

        if (currentRole == null) {
            throw new SecurityException("Unauthorized");
        }

        for (Role role : requireAnyRole.value()) {
            if (role == currentRole) {
                return; // ✅ allowed
            }
        }

        throw new SecurityException("Access denied");
    }

    /**
     * Intercepts @Admin annotation
     * Only ADMIN role can proceed
     */
    @Before("@annotation(admin)")
    public void checkAdmin(Admin admin) {
        Role currentRole = AuthUtil.getAuthenticatedUserRole();

        if (currentRole == null) {
            throw new SecurityException("Unauthorized access");
        }

        if (currentRole != Role.ADMIN) {
            throw new SecurityException(
                    "Access denied. Required role: ADMIN");
        }
    }

    /**
     * Intercepts @Customer annotation
     * Only CUSTOMER role can proceed
     */
    @Before("@annotation(customer)")
    public void checkCustomer(Customer customer) {
        Role currentRole = AuthUtil.getAuthenticatedUserRole();

        if (currentRole == null) {
            throw new SecurityException("Unauthorized access");
        }

        if (currentRole != Role.CUSTOMER) {
            throw new SecurityException(
                    "Access denied. Required role: CUSTOMER");
        }
    }

    /**
     * Intercepts @Mechanic annotation
     * Only MECHANIC role can proceed
     */
    @Before("@annotation(mechanic)")
    public void checkMechanic(Mechanic mechanic) {
        Role currentRole = AuthUtil.getAuthenticatedUserRole();

        if (currentRole == null) {
            throw new SecurityException("Unauthorized access");
        }

        if (currentRole != Role.MECHANIC) {
            throw new SecurityException(
                    "Access denied. Required role: MECHANIC");
        }
    }
}
