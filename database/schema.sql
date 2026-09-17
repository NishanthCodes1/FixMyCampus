-- ============================================================================
-- FixMyCampus - Database Schema Submission
-- Campus Issue Reporting & Management System
-- Compatible with MySQL 8.0+ / MariaDB & Spring Boot JPA Entity Mapping
-- ============================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS fixmycampus_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE fixmycampus_db;

-- 2. Create Table: issues
-- Recreates the exact table structure required by com.fixmycampus.backend.entity.Issue
CREATE TABLE IF NOT EXISTS issues (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    title       VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location    VARCHAR(255) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    priority    VARCHAR(50) NOT NULL DEFAULT 'LOW',
    status      VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    reported_by VARCHAR(255) NOT NULL,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) DEFAULT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
