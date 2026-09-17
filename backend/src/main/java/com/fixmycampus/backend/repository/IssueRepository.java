package com.fixmycampus.backend.repository;

import com.fixmycampus.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    // Find issues by category
    List<Issue> findByCategoryIgnoreCase(String category);

    // Find issues by status
    List<Issue> findByStatusIgnoreCase(String status);

    // Find issues by priority
    List<Issue> findByPriorityIgnoreCase(String priority);

    // Search issues by keyword matching title or description or location
    @Query("SELECT i FROM Issue i WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Issue> searchByKeyword(@Param("keyword") String keyword);
}
