package com.employee.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeReportDTO {
    private Long id;
    private String name;
    private String department;
    private Double salary;
    private LocalDate joiningDate;
}
