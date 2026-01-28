package com.backend.aop.aspect;

import com.backend.aop.annotation.RequireAnyRole;
import com.backend.aop.annotation.RequireRole;
import com.backend.entity.Role;
import com.backend.util.AuthUtil;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RoleAspect {

    @Before("@annotation(requireRole)")
    public void checkRole(RequireRole requireRole) {

        Role currentRole = AuthUtil.getAuthenticatedUserRole();

        if (currentRole == null) {
            throw new SecurityException("Unauthorized access");
        }

        if (currentRole != requireRole.value()) {
            throw new SecurityException(
                "Access denied. Required role: " + requireRole.value()
            );
        }
    }
    
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
}
