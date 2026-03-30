package com.employee.management.service;

import com.employee.management.dto.EmployeeReportDTO;
import com.employee.management.entity.Employee;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.EmployeeSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final EmployeeRepository employeeRepository;

    private EmployeeReportDTO mapToDTO(Employee employee) {
        return new EmployeeReportDTO(
            employee.getId(),
            employee.getName(),
            employee.getDepartment(),
            employee.getSalary(),
            employee.getJoiningDate()
        );
    }

    public Page<EmployeeReportDTO> getFilteredEmployees(String department, Double minSalary, Double maxSalary, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<Employee> spec = EmployeeSpecification.filterEmployees(department, minSalary, maxSalary, startDate, endDate);
        return employeeRepository.findAll(spec, pageable).map(this::mapToDTO);
    }

    public List<EmployeeReportDTO> getAllFilteredEmployees(String department, Double minSalary, Double maxSalary, LocalDate startDate, LocalDate endDate) {
        Specification<Employee> spec = EmployeeSpecification.filterEmployees(department, minSalary, maxSalary, startDate, endDate);
        return employeeRepository.findAll(spec).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public byte[] generatePdfReport(String department, Double minSalary, Double maxSalary, LocalDate startDate, LocalDate endDate) {
        List<EmployeeReportDTO> employees = getAllFilteredEmployees(department, minSalary, maxSalary, startDate, endDate);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);
            Paragraph title = new Paragraph("Employee Analytics Report", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100f);
            table.setWidths(new float[]{1.0f, 3.0f, 3.0f, 2.0f, 2.0f});
            table.setSpacingBefore(10);

            String[] headers = {"ID", "Name", "Department", "Salary", "Joining Date"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell();
                cell.setBackgroundColor(new java.awt.Color(230, 230, 230));
                cell.setPadding(5);
                cell.setPhrase(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                table.addCell(cell);
            }

            for (EmployeeReportDTO emp : employees) {
                table.addCell(String.valueOf(emp.getId()));
                table.addCell(emp.getName());
                table.addCell(emp.getDepartment());
                table.addCell("$" + emp.getSalary());
                table.addCell(emp.getJoiningDate() != null ? emp.getJoiningDate().toString() : "N/A");
            }
            
            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public byte[] generateCsvReport(String department, Double minSalary, Double maxSalary, LocalDate startDate, LocalDate endDate) {
        List<EmployeeReportDTO> employees = getAllFilteredEmployees(department, minSalary, maxSalary, startDate, endDate);
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Name,Department,Salary,Joining Date\n");
        for (EmployeeReportDTO emp : employees) {
            sb.append(emp.getId()).append(",")
              .append("\"").append(emp.getName() != null ? emp.getName().replace("\"", "\"\"") : "").append("\",")
              .append("\"").append(emp.getDepartment() != null ? emp.getDepartment().replace("\"", "\"\"") : "").append("\",")
              .append(emp.getSalary()).append(",")
              .append(emp.getJoiningDate() != null ? emp.getJoiningDate().toString() : "")
              .append("\n");
        }
        return sb.toString().getBytes();
    }
}
