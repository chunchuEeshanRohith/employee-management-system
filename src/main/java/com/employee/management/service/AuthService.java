package com.employee.management.service;

import com.employee.management.dto.AuthResponse;
import com.employee.management.dto.LoginRequest;
import com.employee.management.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
