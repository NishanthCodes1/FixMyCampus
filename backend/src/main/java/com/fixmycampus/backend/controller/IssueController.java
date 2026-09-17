package com.fixmycampus.backend.controller;

import com.fixmycampus.backend.entity.Issue;
import com.fixmycampus.backend.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    @Autowired
    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // 1. POST: Create a new issue (Student action)
    @PostMapping
    public ResponseEntity<Issue> createIssue(@Valid @RequestBody Issue issue) {
        Issue createdIssue = issueService.createIssue(issue);
        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
    }

    // 2. GET: Read all issues (with optional search/category/status/priority query parameters)
    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search) {
        List<Issue> issues = issueService.getAllIssues(category, status, priority, search);
        return ResponseEntity.ok(issues);
    }

    // 3. GET: Read single issue by ID
    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long id) {
        Issue issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    // 4. PUT: Full Update an issue
    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long id, @Valid @RequestBody Issue issueDetails) {
        Issue updatedIssue = issueService.updateIssue(id, issueDetails);
        return ResponseEntity.ok(updatedIssue);
    }

    // 5. PATCH: Update complaint status (Admin action)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Issue> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Status field is required");
        }
        Issue updatedIssue = issueService.updateIssueStatus(id, newStatus);
        return ResponseEntity.ok(updatedIssue);
    }

    // 6. PATCH: Update complaint priority (Admin action)
    @PatchMapping("/{id}/priority")
    public ResponseEntity<Issue> updatePriority(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newPriority = payload.get("priority");
        if (newPriority == null || newPriority.trim().isEmpty()) {
            throw new IllegalArgumentException("Priority field is required");
        }
        Issue updatedIssue = issueService.updateIssuePriority(id, newPriority);
        return ResponseEntity.ok(updatedIssue);
    }

    // 7. DELETE: Delete an issue
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Issue with ID " + id + " has been successfully deleted.");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
