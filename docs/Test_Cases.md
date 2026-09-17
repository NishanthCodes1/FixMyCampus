# FixMyCampus — Test Case Documentation

**Project Name**: FixMyCampus  
**System**: Campus Issue Reporting & Management System  
**Environment**: Spring Boot Backend (`http://localhost:8080`) + MySQL Database (`fixmycampus_db`) + Vanilla JS Frontend (`http://localhost:5500`)  

---

## 1. Test Case Execution Matrix

All test cases listed below have been empirically executed and verified against the running application and database.

| Test Case ID | Test Scenario | Method | Endpoint | Input / Payload | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Get all issues | `GET` | `/api/issues` | None | Returns JSON array of issues with HTTP `200 OK` | `200 OK` `[]` or list of issues | **PASSED** |
| **TC02** | Create a valid issue | `POST` | `/api/issues` | `{ "title": "Classroom fan not working", "description": "The ceiling fan is not working properly.", "location": "Block A, Room 204", "category": "INFRASTRUCTURE", "priority": "HIGH", "status": "PENDING", "reportedBy": "student@example.com" }` | Issue created with auto-generated ID & timestamps, HTTP `201 CREATED` | `201 CREATED` `{"id": 1, "title": "Classroom fan not working", ...}` | **PASSED** |
| **TC03** | Get issue by ID | `GET` | `/api/issues/1` | ID: `1` | Returns single issue JSON object with HTTP `200 OK` | `200 OK` `{"id": 1, ...}` | **PASSED** |
| **TC04** | Update an existing issue | `PUT` | `/api/issues/1` | ID: `1`, `{ "title": "Classroom ceiling fan speed regulator broken", "description": "The ceiling fan speed regulator is completely broken...", "location": "Block A, Room 204", "category": "INFRASTRUCTURE", "priority": "URGENT", "status": "IN_PROGRESS", "reportedBy": "student@example.com" }` | Issue updated successfully with updated timestamp, HTTP `200 OK` | `200 OK` `{"id": 1, "status": "IN_PROGRESS", ...}` | **PASSED** |
| **TC05** | Delete an existing issue | `DELETE` | `/api/issues/1` | ID: `1` | Issue deleted from database, HTTP `200 OK` with confirmation message | `200 OK` `{"success": true, "message": "Issue with ID 1 has been successfully deleted."}` | **PASSED** |
| **TC06** | Get a non-existent issue ID | `GET` | `/api/issues/999` | ID: `999` | Returns JSON error response with HTTP `404 NOT FOUND` | `404 NOT FOUND` `{"error": "Not Found", "message": "Issue not found with ID: 999"}` | **PASSED** |
| **TC07** | Validation when title is missing | `POST` | `/api/issues` | `{ "description": "Missing title field test", "location": "Block B", "category": "INFRASTRUCTURE", "reportedBy": "student@example.com" }` | Returns validation error JSON with HTTP `400 BAD REQUEST` | `400 BAD REQUEST` `{"validationErrors": {"title": "Title is required"}}` | **PASSED** |
| **TC08** | Search & Filter functionality | Frontend JS | Dashboard UI | Search query string / category / status dropdown filters | Filters displayed issues dynamically on client-side | Dashboard grid & statistics filter correctly in real-time | **PASSED** |

---

## 2. CRUD Operation Mapping

The application maps fundamental database CRUD operations directly to standard RESTful HTTP methods:

```
+------------------+------------------+-----------------------------+
| CRUD Operation   | HTTP Method      | Endpoint                    |
+------------------+------------------+-----------------------------+
| CREATE           | POST             | /api/issues                 |
| READ (All)       | GET              | /api/issues                 |
| READ (Single)    | GET              | /api/issues/{id}            |
| UPDATE           | PUT              | /api/issues/{id}            |
| DELETE           | DELETE           | /api/issues/{id}            |
+------------------+------------------+-----------------------------+
```

---

## 3. Verified Request Validation Example

Jakarta Bean Validation (`@Valid` / `@NotBlank`) is configured on the backend `Issue` entity to enforce data integrity.

### Test Scenario: POST Request Missing Required `title` Field

#### Request Sent:
```http
POST /api/issues HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "description": "Missing title field test",
  "location": "Block B, Room 102",
  "category": "INFRASTRUCTURE",
  "reportedBy": "student@example.com"
}
```

#### Actual Server Response (`400 BAD REQUEST`):
```json
{
  "timestamp": "2026-09-17T15:54:36.983392",
  "status": 400,
  "error": "Validation Failed",
  "validationErrors": {
    "title": "Title is required"
  }
}
```

---

## 4. Test Summary

- **Total Test Cases**: 8
- **Passed**: 8
- **Failed**: 0
- **Pass Rate**: 100%
