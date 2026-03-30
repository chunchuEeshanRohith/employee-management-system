package com.employee.management.service;

import com.employee.management.dto.EmployeeDTO;
import java.util.List;

public interface EmployeeService {
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);

    EmployeeDTO getEmployeeById(Long id);

    List<EmployeeDTO> getAllEmployees();

    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);

    void deleteEmployee(Long id);

    List<EmployeeDTO> searchEmployees(String keyword);
}
