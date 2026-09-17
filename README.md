<<<<<<< HEAD
# FixMyCampus
it is used to learn about CRUD working
=======
# FixMyCampus — Campus Issue Reporting and Management System

A modern, full-stack campus issue reporting and management system designed to streamline campus infrastructure maintenance and student grievance redressal.

---

## 1. Project Title

**FixMyCampus — Campus Issue Reporting and Management System**

---

## 2. Project Overview

**FixMyCampus** is a Campus Issue Reporting and Management System built using **HTML, CSS, JavaScript, Java Spring Boot, Spring Data JPA, MySQL and REST API**. It enables students and staff to report infrastructure, electrical, plumbing, IT/Wi-Fi, and cleanliness issues across campus facilities. Administrators can monitor, prioritize, track, and resolve reported issues in real time through an interactive, responsive dashboard.

---

## 3. Problem Statement

In traditional educational institutions, campus maintenance complaints are often submitted through manual register entries or informal verbal requests. This leads to several operational inefficiencies:
- **Lack of Tracking**: Students cannot track the real-time status of their reported complaints.
- **Delayed Resolution**: Maintenance departments lack centralized visibility and priority sorting.
- **No Data Analytics**: Management cannot analyze recurring campus infrastructure failures or measure response times.

---

## 4. Objectives

- **Centralize Reporting**: Provide a single online platform for reporting all campus maintenance issues.
- **Real-Time Visibility**: Offer transparent, status-driven tracking (`PENDING`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`).
- **Priority Management**: Classify issues by urgency (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) to ensure critical repairs are addressed immediately.
- **Dynamic Analytics**: Display live dashboard metrics for overall campus health and issue statistics.

---

## 5. Key Features

- **Report Campus Issue**: Form with validation for `title`, `description`, `location`, `category`, `priority`, `status`, and `reportedBy`.
- **View Issues**: Interactive Grid Card View and responsive Table View.
- **Full & Partial Update**: Complete issue update (`PUT`) as well as single-field status/priority updates (`PATCH`).
- **Delete Issue**: Safe deletion workflow with modal confirmation alerts.
- **Real-Time Search**: Search filtering matching title, description, location, or reportedBy.
- **Category Filtering**: Filter complaints by domain (`INFRASTRUCTURE`, `ELECTRICAL`, `PLUMBING`, `IT`, `FURNITURE`, `CLEANLINESS`, `OTHER`).
- **Status & Priority Filtering**: Quickly filter by status (`PENDING`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`) or priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Dashboard Statistics**: Dynamically calculated real-time summary cards for Total, Pending, In Progress, and Resolved issues.

---

## 6. Technology Stack

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Backend Framework**: Java 17+, Spring Boot 3.2.5, Spring MVC
- **Data Access**: Spring Data JPA, Hibernate ORM
- **Database**: MySQL 8.0+ / MariaDB (`fixmycampus_db`)
- **Build Tool**: Apache Maven (via Maven Wrapper `mvnw`)
- **API Architecture**: RESTful Services (`application/json`)
- **Testing & Tooling**: cURL, PowerShell REST testing, Postman

---

## 7. System Architecture

```
[ Frontend (HTML5 / CSS3 / Vanilla JS) ]
                   │
                   ▼ (HTTP / REST API via fetch)
[ Spring Boot REST Controllers (/api/issues) ]
                   │
                   ▼
[ Spring Data JPA Service Layer & Repositories ]
                   │
                   ▼ (JDBC / HikariCP)
[ MySQL Database (fixmycampus_db) ]
```

---

## 8. Project Structure

```
FixMyCampus/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fixmycampus/backend/
│   │   │   │   ├── configuration/   # WebConfig (CORS settings)
│   │   │   │   ├── controller/      # IssueController (REST Endpoints)
│   │   │   │   ├── entity/          # Issue JPA Entity
│   │   │   │   ├── exception/       # GlobalExceptionHandler & Custom Exceptions
│   │   │   │   ├── repository/     # IssueRepository (Spring Data JPA)
│   │   │   │   ├── service/        # IssueService & IssueServiceImpl
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── database/
│   └── schema.sql
├── docs/
│   ├── API_Documentation.md
│   ├── ER_Diagram.png
│   ├── ER_Diagram.svg
│   └── Test_Cases.md
├── .gitignore
└── README.md
```

---

## 9. Database Setup

1. Open your MySQL client (e.g. MySQL Workbench, Command Line, or phpMyAdmin).
2. Execute the provided DDL script in `database/schema.sql`:

```sql
-- Execute schema.sql to create database and table
source D:/FixMyCampus/database/schema.sql;
```

*The script creates the `fixmycampus_db` database and the `issues` table with all column definitions (`id`, `title`, `description`, `location`, `category`, `priority`, `status`, `reported_by`, `created_at`, `updated_at`).*

---

## 10. Backend Setup and Execution

1. Open a command prompt or terminal.
2. Navigate to the backend directory:
   ```cmd
   cd D:\FixMyCampus\backend
   ```
3. Run the Spring Boot backend using the Maven wrapper:
   ```cmd
   mvnw.cmd spring-boot:run
   ```
4. The backend server will start at:  
   **`http://localhost:8080`**

*Note: Database credentials can be overridden via environment variables `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`.*

---

## 11. Frontend Setup and Execution

1. Open a command prompt or terminal.
2. Navigate to the frontend directory:
   ```cmd
   cd D:\FixMyCampus\frontend
   ```
3. Launch a lightweight HTTP static server:
   ```cmd
   python -m http.server 5500
   ```
4. Open your browser and navigate to:  
   **`http://localhost:5500`**

*(Alternatively, you can open `D:\FixMyCampus\frontend\index.html` directly in your browser).*

---

## 12. API Endpoints

| HTTP Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/issues` | Create a new campus issue | `201 CREATED` |
| `GET` | `/api/issues` | Retrieve all issues (supports `category`, `status`, `priority`, `search` query params) | `200 OK` |
| `GET` | `/api/issues/{id}` | Retrieve details of a single issue by ID | `200 OK` / `404 NOT FOUND` |
| `PUT` | `/api/issues/{id}` | Full update of existing issue details | `200 OK` / `404 NOT FOUND` |
| `PATCH` | `/api/issues/{id}/status` | Partial update for complaint status | `200 OK` / `404 NOT FOUND` |
| `PATCH` | `/api/issues/{id}/priority` | Partial update for complaint priority | `200 OK` / `404 NOT FOUND` |
| `DELETE` | `/api/issues/{id}` | Delete an issue by ID | `200 OK` / `404 NOT FOUND` |

---

## 13. CRUD Operations

- **CREATE**: `POST /api/issues` handles issue submission, validates required fields, and auto-generates `id`, `createdAt`, and `updatedAt`.
- **READ**: `GET /api/issues` and `GET /api/issues/{id}` fetch all or specific issue records from the MySQL database.
- **UPDATE**: `PUT /api/issues/{id}` performs a full update, while `PATCH /api/issues/{id}/status` and `PATCH /api/issues/{id}/priority` allow partial updates. All update operations refresh `updatedAt`.
- **DELETE**: `DELETE /api/issues/{id}` removes records permanently after user confirmation.

---

## 14. Validation

Jakarta Bean Validation (`@Valid` / `@NotBlank`) enforces server-side validation:
- **Missing Required Field Example**: Submitting a `POST` request without `title` returns:
  - **HTTP Status**: `400 BAD REQUEST`
  - **Response Body**:
    ```json
    {
      "status": 400,
      "error": "Validation Failed",
      "validationErrors": {
        "title": "Title is required"
      }
    }
    ```

---

## 15. Testing

Full test execution details, status codes, and test scenarios are documented in:  
📁 **[docs/Test_Cases.md](file:///D:/FixMyCampus/docs/Test_Cases.md)** *(8/8 Test Cases Passed - 100% Pass Rate)*

---

## 16. ER Diagram Reference

The database entity relationship structure is documented in:  
📁 **[docs/ER_Diagram.png](file:///D:/FixMyCampus/docs/ER_Diagram.png)**  
*(Vector SVG version also available at `docs/ER_Diagram.svg`)*

---

## 17. API Documentation Reference

Detailed REST API endpoints specification, payloads, and response headers are documented in:  
📁 **[docs/API_Documentation.md](file:///D:/FixMyCampus/docs/API_Documentation.md)**

---

## 18. Future Enhancements

- **User Authentication**: Implement Role-Based Access Control (RBAC) with Spring Security & JWT for Students vs Administrators.
- **Image Uploads**: Allow students to attach photo evidence of damaged infrastructure.
- **Email/SMS Notifications**: Send automated alerts when complaint status changes to `IN_PROGRESS` or `RESOLVED`.
- **Location Mapping**: Interactive campus map integration for precise issue location pin-pointing.

---

## 19. Conclusion

The **FixMyCampus** system effectively bridges the communication gap between students and campus facility management. By leveraging a robust Spring Boot REST backend, a MySQL database, and an intuitive JavaScript dashboard, it transforms traditional campus complaint handling into a modern, transparent, and data-driven workflow.
>>>>>>> d7aacba (Initial commit - FixMyCampus CRUD application)
