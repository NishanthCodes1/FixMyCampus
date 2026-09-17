# FixMyCampus — Campus Issue Reporting and Management System

A modern, full-stack campus issue reporting and management system designed to streamline campus infrastructure maintenance and student grievance redressal.

---

## 1. Project Title

**FixMyCampus — Campus Issue Reporting and Management System**

---

## 2. Project Overview

**FixMyCampus** is a Campus Issue Reporting and Management System built using **HTML, CSS, JavaScript, Java Spring Boot, Spring Data JPA, MySQL and REST API**.

It enables students and staff to report infrastructure, electrical, plumbing, IT/Wi-Fi, and cleanliness issues across campus facilities. Administrators can monitor, prioritize, track, and resolve reported issues through an interactive, responsive dashboard.

---

## 3. Problem Statement

In traditional educational institutions, campus maintenance complaints are often submitted through manual register entries or informal verbal requests. This leads to several operational inefficiencies:

- **Lack of Tracking:** Students cannot track the real-time status of their reported complaints.
- **Delayed Resolution:** Maintenance departments lack centralized visibility and priority sorting.
- **No Data Analytics:** Management cannot analyze recurring campus infrastructure failures or measure response times.

---

## 4. Objectives

- **Centralize Reporting:** Provide a single online platform for reporting all campus maintenance issues.
- **Real-Time Visibility:** Offer transparent, status-driven tracking (`PENDING`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`).
- **Priority Management:** Classify issues by urgency (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Dynamic Analytics:** Display live dashboard metrics for overall campus issue statistics.

---

## 5. Key Features

- **Report Campus Issue:** Form with validation for title, description, location, category, priority, status, and reportedBy.
- **View Issues:** Interactive Grid Card View and responsive Table View.
- **Full & Partial Update:** Complete issue update using `PUT` as well as single-field status/priority updates using `PATCH`.
- **Delete Issue:** Safe deletion workflow with confirmation alerts.
- **Real-Time Search:** Search by title, description, location, or reportedBy.
- **Category Filtering:** Filter issues by domain such as `INFRASTRUCTURE`, `ELECTRICAL`, `PLUMBING`, `IT`, `FURNITURE`, `CLEANLINESS`, and `OTHER`.
- **Status Filtering:** Filter by `PENDING`, `IN_PROGRESS`, `RESOLVED`, or `REJECTED`.
- **Priority Filtering:** Filter by `LOW`, `MEDIUM`, `HIGH`, or `URGENT`.
- **Dashboard Statistics:** Dynamically calculated summary cards for Total, Pending, In Progress, and Resolved issues.

---

## 6. Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend Framework:** Java 17+, Spring Boot 3.2.5, Spring MVC
- **Data Access:** Spring Data JPA, Hibernate ORM
- **Database:** MySQL 8.0+ / MariaDB
- **Database Name:** `fixmycampus_db`
- **Build Tool:** Apache Maven using Maven Wrapper
- **API Architecture:** RESTful API using JSON
- **Testing & Tooling:** cURL, PowerShell REST testing, Postman

---

## 7. System Architecture

```text
[ Frontend - HTML5 / CSS3 / Vanilla JavaScript ]
                         |
                         | HTTP / REST API
                         | fetch()
                         v
[ Spring Boot REST Controllers - /api/issues ]
                         |
                         v
[ Spring Data JPA Service Layer & Repository ]
                         |
                         | JDBC / HikariCP
                         v
[ MySQL Database - fixmycampus_db ]
