# FixMyCampus — REST API Documentation

**Project Name**: FixMyCampus  
**System**: Campus Issue Reporting & Management System  
**Base URL**: `http://localhost:8080`  
**Data Format**: JSON (`application/json`)  

---

## 1. Overview & Data Model

The API provides complete RESTful CRUD operations for campus issue management.

### Issue Entity Attributes

| Field Name | Type | Description | Required | Validation / Default |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `Long` | Unique issue identifier (Auto-generated) | Output | Primary Key |
| `title` | `String` | Short summary of the campus issue | Yes | 3 to 100 characters |
| `description` | `String` | Detailed explanation of the issue | Yes | Non-blank text |
| `location` | `String` | Physical campus location (e.g. Block A, Room 204) | Yes | Non-blank text |
| `category` | `String` | Issue domain (`INFRASTRUCTURE`, `ELECTRICAL`, `PLUMBING`, `IT`, `FURNITURE`, `CLEANLINESS`, `OTHER`) | Yes | Non-blank text |
| `priority` | `String` | Severity rating (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) | No | Default: `'LOW'` |
| `status` | `String` | Resolution state (`PENDING`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`) | No | Default: `'PENDING'` |
| `reportedBy` | `String` | Email or name of reporter | Yes | Non-blank text |
| `createdAt` | `LocalDateTime` | Auto-generated creation timestamp | Output | ISO-8601 Format |
| `updatedAt` | `LocalDateTime` | Auto-updated modification timestamp | Output | ISO-8601 Format |

---

## 2. CRUD Mapping

| Operation | HTTP Method | Endpoint URL | Description |
| :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/api/issues` | Submit a new campus issue |
| **READ (All)** | `GET` | `/api/issues` | Retrieve all issues (optional search/filters) |
| **READ (Single)**| `GET` | `/api/issues/{id}` | Retrieve details of a specific issue |
| **UPDATE** | `PUT` | `/api/issues/{id}` | Update existing issue details |
| **DELETE** | `DELETE` | `/api/issues/{id}` | Remove an issue record |

---

## 3. Endpoints Specification

### 3.1 Create Issue (POST)

Creates a new campus issue. Auto-generates `id`, `createdAt`, and `updatedAt` timestamps.

- **HTTP Method**: `POST`
- **Endpoint URL**: `http://localhost:8080/api/issues`
- **Request Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body (JSON)**:
  ```json
  {
    "title": "Classroom fan not working",
    "description": "The ceiling fan is not working properly.",
    "location": "Block A, Room 204",
    "category": "INFRASTRUCTURE",
    "priority": "HIGH",
    "status": "PENDING",
    "reportedBy": "student@example.com"
  }
  ```

#### Successful Response (`201 CREATED`)
```json
{
  "id": 1,
  "title": "Classroom fan not working",
  "description": "The ceiling fan is not working properly.",
  "location": "Block A, Room 204",
  "category": "INFRASTRUCTURE",
  "priority": "HIGH",
  "status": "PENDING",
  "reportedBy": "student@example.com",
  "createdAt": "2026-09-17T15:53:42.2091221",
  "updatedAt": "2026-09-17T15:53:42.2091221"
}
```

#### Error Response (`400 BAD REQUEST`) — Missing required field
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

### 3.2 Get All Issues (GET)

Retrieves all recorded campus issues. Supports optional query parameters for category, status, priority, and keyword search.

- **HTTP Method**: `GET`
- **Endpoint URL**: `http://localhost:8080/api/issues`
- **Optional Query Parameters**:
  - `category` (e.g. `INFRASTRUCTURE`)
  - `status` (e.g. `PENDING`)
  - `priority` (e.g. `HIGH`)
  - `search` (e.g. `fan`)
- **Request Headers**:
  ```http
  Accept: application/json
  ```

#### Successful Response (`200 OK`)
```json
[
  {
    "id": 1,
    "title": "Classroom fan not working",
    "description": "The ceiling fan is not working properly.",
    "location": "Block A, Room 204",
    "category": "INFRASTRUCTURE",
    "priority": "HIGH",
    "status": "PENDING",
    "reportedBy": "student@example.com",
    "createdAt": "2026-09-17T15:53:42.2091221",
    "updatedAt": "2026-09-17T15:53:42.2091221"
  }
]
```

---

### 3.3 Get Issue by ID (GET)

Retrieves a single campus issue by its unique ID.

- **HTTP Method**: `GET`
- **Endpoint URL**: `http://localhost:8080/api/issues/{id}`
- **Path Parameter**: `id` (Long) — e.g. `1`
- **Request Headers**:
  ```http
  Accept: application/json
  ```

#### Successful Response (`200 OK`)
```json
{
  "id": 1,
  "title": "Classroom fan not working",
  "description": "The ceiling fan is not working properly.",
  "location": "Block A, Room 204",
  "category": "INFRASTRUCTURE",
  "priority": "HIGH",
  "status": "PENDING",
  "reportedBy": "student@example.com",
  "createdAt": "2026-09-17T15:53:42.2091221",
  "updatedAt": "2026-09-17T15:53:42.2091221"
}
```

#### Error Response (`404 NOT FOUND`) — Issue ID does not exist
```json
{
  "timestamp": "2026-09-17T15:54:23.2308116",
  "status": 404,
  "error": "Not Found",
  "message": "Issue not found with ID: 999"
}
```

---

### 3.4 Update Issue (PUT)

Updates all fields of an existing campus issue and automatically updates the `updatedAt` timestamp.

- **HTTP Method**: `PUT`
- **Endpoint URL**: `http://localhost:8080/api/issues/{id}`
- **Path Parameter**: `id` (Long) — e.g. `1`
- **Request Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Request Body (JSON)**:
  ```json
  {
    "title": "Classroom ceiling fan speed regulator broken",
    "description": "The ceiling fan speed regulator is completely broken and making loud noise.",
    "location": "Block A, Room 204",
    "category": "INFRASTRUCTURE",
    "priority": "URGENT",
    "status": "IN_PROGRESS",
    "reportedBy": "student@example.com"
  }
  ```

#### Successful Response (`200 OK`)
```json
{
  "id": 1,
  "title": "Classroom ceiling fan speed regulator broken",
  "description": "The ceiling fan speed regulator is completely broken and making loud noise.",
  "location": "Block A, Room 204",
  "category": "INFRASTRUCTURE",
  "priority": "URGENT",
  "status": "IN_PROGRESS",
  "reportedBy": "student@example.com",
  "createdAt": "2026-09-17T15:53:42.209122",
  "updatedAt": "2026-09-17T15:54:04.8789329"
}
```

#### Error Response (`404 NOT FOUND`)
```json
{
  "timestamp": "2026-09-17T15:54:23.2308116",
  "status": 404,
  "error": "Not Found",
  "message": "Issue not found with ID: 999"
}
```

---

### 3.5 Delete Issue (DELETE)

Deletes an issue record from the database by ID.

- **HTTP Method**: `DELETE`
- **Endpoint URL**: `http://localhost:8080/api/issues/{id}`
- **Path Parameter**: `id` (Long) — e.g. `1`

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Issue with ID 1 has been successfully deleted."
}
```

#### Error Response (`404 NOT FOUND`)
```json
{
  "timestamp": "2026-09-17T15:54:23.2308116",
  "status": 404,
  "error": "Not Found",
  "message": "Issue not found with ID: 999"
}
```
