package com.fixmycampus.backend.service;

import com.fixmycampus.backend.entity.Issue;

import java.util.List;

public interface IssueService {

    // Create a new issue
    Issue createIssue(Issue issue);

    // Get all issues with optional filtering & search
    List<Issue> getAllIssues(String category, String status, String priority, String search);

    // Get issue by ID
    Issue getIssueById(Long id);

    // Update issue full details
    Issue updateIssue(Long id, Issue issueDetails);

    // Update complaint status (Admin action)
    Issue updateIssueStatus(Long id, String status);

    // Set complaint priority (Admin action)
    Issue updateIssuePriority(Long id, String priority);

    // Delete issue
    void deleteIssue(Long id);
}
