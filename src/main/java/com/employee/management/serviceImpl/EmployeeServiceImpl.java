package com.employee.management.serviceImpl;

import com.employee.management.dto.EmployeeDTO;
import com.employee.management.entity.Employee;
import com.employee.management.exception.ResourceNotFoundException;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }
        Employee employee = mapToEntity(dto);
        Employee savedEmployee = employeeRepository.save(employee);
        return mapToDTO(savedEmployee);
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToDTO(employee);
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Only check email if it changed
        if (!employee.getEmail().equals(dto.getEmail()) && employeeRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        employee.setName(dto.getName());
        employee.setDepartment(dto.getDepartment());
        employee.setSalary(dto.getSalary());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setJoiningDate(dto.getJoiningDate());

        Employee updatedEmployee = employeeRepository.save(employee);
        return mapToDTO(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    @Override
    public List<EmployeeDTO> searchEmployees(String keyword) {
        return employeeRepository.searchEmployees(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods to map Entity and DTO
    private EmployeeDTO mapToDTO(Employee employee) {
        return EmployeeDTO.builder()
                .id(employee.getId())
                .name(employee.getName())
                .department(employee.getDepartment())
                .salary(employee.getSalary())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .joiningDate(employee.getJoiningDate())
                .build();
    }

    private Employee mapToEntity(EmployeeDTO dto) {
        return Employee.builder()
                .name(dto.getName())
                .department(dto.getDepartment())
                .salary(dto.getSalary())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .joiningDate(dto.getJoiningDate())
                .build();
    }
}
