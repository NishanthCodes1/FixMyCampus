package com.fixmycampus.backend.service;

import com.fixmycampus.backend.entity.Issue;
import com.fixmycampus.backend.exception.ResourceNotFoundException;
import com.fixmycampus.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;

    @Autowired
    public IssueServiceImpl(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    @Override
    public Issue createIssue(Issue issue) {
        // Enforce clean defaults if null
        if (issue.getPriority() == null || issue.getPriority().trim().isEmpty()) {
            issue.setPriority("LOW");
        }
        if (issue.getStatus() == null || issue.getStatus().trim().isEmpty()) {
            issue.setStatus("PENDING");
        }
        return issueRepository.save(issue);
    }

    @Override
    public List<Issue> getAllIssues(String category, String status, String priority, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return issueRepository.searchByKeyword(search.trim());
        }
        if (category != null && !category.trim().isEmpty()) {
            return issueRepository.findByCategoryIgnoreCase(category.trim());
        }
        if (status != null && !status.trim().isEmpty()) {
            return issueRepository.findByStatusIgnoreCase(status.trim());
        }
        if (priority != null && !priority.trim().isEmpty()) {
            return issueRepository.findByPriorityIgnoreCase(priority.trim());
        }
        return issueRepository.findAll();
    }

    @Override
    public Issue getIssueById(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + id));
    }

    @Override
    public Issue updateIssue(Long id, Issue issueDetails) {
        Issue existingIssue = getIssueById(id);

        existingIssue.setTitle(issueDetails.getTitle());
        existingIssue.setDescription(issueDetails.getDescription());
        existingIssue.setLocation(issueDetails.getLocation());
        existingIssue.setCategory(issueDetails.getCategory());
        
        if (issueDetails.getReportedBy() != null) {
            existingIssue.setReportedBy(issueDetails.getReportedBy());
        }
        if (issueDetails.getPriority() != null) {
            existingIssue.setPriority(issueDetails.getPriority());
        }
        if (issueDetails.getStatus() != null) {
            existingIssue.setStatus(issueDetails.getStatus());
        }

        return issueRepository.save(existingIssue);
    }

    @Override
    public Issue updateIssueStatus(Long id, String status) {
        Issue existingIssue = getIssueById(id);
        existingIssue.setStatus(status.toUpperCase());
        return issueRepository.save(existingIssue);
    }

    @Override
    public Issue updateIssuePriority(Long id, String priority) {
        Issue existingIssue = getIssueById(id);
        existingIssue.setPriority(priority.toUpperCase());
        return issueRepository.save(existingIssue);
    }

    @Override
    public void deleteIssue(Long id) {
        Issue existingIssue = getIssueById(id);
        issueRepository.delete(existingIssue);
    }
}
