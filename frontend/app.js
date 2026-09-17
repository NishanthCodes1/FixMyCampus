// FixMyCampus Frontend Application Engine
const API_BASE_URL = 'http://localhost:8080/api/issues';

let currentRole = 'student'; // 'student' or 'admin'
let allIssues = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadIssues();
});

// Role Switcher (Student / Admin)
function switchRole(role) {
    currentRole = role;

    const btnStudent = document.getElementById('btn-student-view');
    const btnAdmin = document.getElementById('btn-admin-view');
    const secStudent = document.getElementById('student-section');
    const secAdmin = document.getElementById('admin-section');

    if (role === 'student') {
        btnStudent.classList.add('active');
        btnAdmin.classList.remove('active');
        secStudent.classList.remove('hidden');
        secAdmin.classList.add('hidden');
    } else {
        btnAdmin.classList.add('active');
        btnStudent.classList.remove('active');
        secAdmin.classList.remove('hidden');
        secStudent.classList.add('hidden');
    }

    renderUI();
}

// Fetch all issues from Spring Boot Backend REST API
async function loadIssues() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allIssues = await response.json();
        renderUI();
    } catch (error) {
        console.warn("Backend API not reachable. Make sure Spring Boot server is running on http://localhost:8080", error);
        // Fallback UI indication
        allIssues = [];
        renderUI();
    }
}

// Filter and Search Handler
function getFilteredIssues() {
    const isStudent = currentRole === 'student';
    const searchVal = (document.getElementById(isStudent ? 'student-search' : 'admin-search')?.value || '').toLowerCase().trim();
    const categoryVal = document.getElementById(isStudent ? 'student-category-filter' : 'admin-category-filter')?.value || '';
    const statusVal = isStudent ? (document.getElementById('student-status-filter')?.value || '') : '';

    return allIssues.filter(issue => {
        const matchesCategory = categoryVal === '' || issue.category === categoryVal;
        const matchesStatus = statusVal === '' || issue.status === statusVal;
        const matchesSearch = searchVal === '' ||
            issue.title?.toLowerCase().includes(searchVal) ||
            issue.description?.toLowerCase().includes(searchVal) ||
            issue.location?.toLowerCase().includes(searchVal) ||
            issue.reportedBy?.toLowerCase().includes(searchVal);

        return matchesCategory && matchesStatus && matchesSearch;
    });
}

function handleSearch() {
    renderUI();
}

function applyFilters() {
    renderUI();
}

// Render UI based on role and current dataset
function renderUI() {
    const filtered = getFilteredIssues();

    // Update Counts & Stats
    const countEl = document.getElementById('issue-count');
    if (countEl) countEl.innerText = filtered.length;

    // Admin Stats
    const pendingCount = allIssues.filter(i => i.status === 'PENDING').length;
    const progressCount = allIssues.filter(i => i.status === 'IN_PROGRESS').length;
    const resolvedCount = allIssues.filter(i => i.status === 'RESOLVED').length;

    if (document.getElementById('count-pending')) document.getElementById('count-pending').innerText = pendingCount;
    if (document.getElementById('count-progress')) document.getElementById('count-progress').innerText = progressCount;
    if (document.getElementById('count-resolved')) document.getElementById('count-resolved').innerText = resolvedCount;

    if (currentRole === 'student') {
        renderStudentCards(filtered);
    } else {
        renderAdminTable(filtered);
    }
}

// Render Student Complaint Cards
function renderStudentCards(issues) {
    const container = document.getElementById('issues-container');
    if (!container) return;

    if (issues.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #94a3b8; background: #1e293b; border-radius: 16px;">
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No issues found</p>
                <p style="font-size: 0.9rem;">Click on <strong>+ Report New Issue</strong> to submit a complaint, or clear search filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = issues.map(issue => `
        <div class="issue-card">
            <div>
                <div class="card-top">
                    <span class="category-tag">${escapeHtml(issue.category)}</span>
                    <span class="badge badge-${issue.status.toLowerCase()}">${getStatusLabel(issue.status)}</span>
                </div>
                <h4 class="card-title">${escapeHtml(issue.title)}</h4>
                <p class="card-desc">${escapeHtml(issue.description)}</p>
            </div>

            <div>
                <div class="meta-row">
                    <span>📍 ${escapeHtml(issue.location)}</span>
                    <span>⚡ Priority: <strong>${escapeHtml(issue.priority)}</strong></span>
                </div>

                <div class="card-actions">
                    <button class="btn btn-secondary" onclick="viewIssueDetails(${issue.id})">Details</button>
                    <button class="btn btn-secondary" onclick="openModal('edit', ${issue.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteIssue(${issue.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Admin Table
function renderAdminTable(issues) {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    if (issues.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #94a3b8; padding: 2rem;">No complaint issues found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = issues.map(issue => `
        <tr>
            <td>#${issue.id}</td>
            <td>
                <strong>${escapeHtml(issue.title)}</strong>
                <div style="font-size: 0.8rem; color: #94a3b8; max-width: 250px;" class="card-desc">${escapeHtml(issue.description)}</div>
            </td>
            <td>${escapeHtml(issue.location)}</td>
            <td><span class="category-tag">${escapeHtml(issue.category)}</span></td>
            <td>${escapeHtml(issue.reportedBy)}</td>
            <td>
                <select onchange="changePriority(${issue.id}, this.value)" style="padding: 0.4rem; font-size: 0.8rem;">
                    <option value="LOW" ${issue.priority === 'LOW' ? 'selected' : ''}>Low</option>
                    <option value="MEDIUM" ${issue.priority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
                    <option value="HIGH" ${issue.priority === 'HIGH' ? 'selected' : ''}>High</option>
                    <option value="URGENT" ${issue.priority === 'URGENT' ? 'selected' : ''}>Urgent</option>
                </select>
            </td>
            <td>
                <span class="badge badge-${issue.status.toLowerCase()}">${getStatusLabel(issue.status)}</span>
            </td>
            <td>
                <select onchange="changeStatus(${issue.id}, this.value)" style="padding: 0.4rem; font-size: 0.85rem;">
                    <option value="PENDING" ${issue.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                    <option value="IN_PROGRESS" ${issue.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
                    <option value="RESOLVED" ${issue.status === 'RESOLVED' ? 'selected' : ''}>Resolved</option>
                    <option value="REJECTED" ${issue.status === 'REJECTED' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
        </tr>
    `).join('');
}

// Helper: Status label text formatting
function getStatusLabel(status) {
    switch (status) {
        case 'PENDING': return '⏳ Pending';
        case 'IN_PROGRESS': return '⚙️ In Progress';
        case 'RESOLVED': return '✅ Resolved';
        case 'REJECTED': return '❌ Rejected';
        default: return status;
    }
}

// Modal Handlers (Create / Edit)
function openModal(mode, issueId = null) {
    const modal = document.getElementById('issue-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');

    document.getElementById('issue-form').reset();

    if (mode === 'edit' && issueId) {
        const issue = allIssues.find(i => i.id === issueId);
        if (issue) {
            document.getElementById('issue-id').value = issue.id;
            document.getElementById('form-title').value = issue.title;
            document.getElementById('form-category').value = issue.category;
            document.getElementById('form-location').value = issue.location;
            document.getElementById('form-reportedBy').value = issue.reportedBy;
            document.getElementById('form-priority').value = issue.priority;
            document.getElementById('form-description').value = issue.description;

            modalTitle.innerText = "Edit Complaint Issue";
            submitBtn.innerText = "Save Changes";
        }
    } else {
        document.getElementById('issue-id').value = "";
        modalTitle.innerText = "Report New Issue";
        submitBtn.innerText = "Submit Complaint";
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('issue-modal').classList.add('hidden');
}

// Handle Form Submission (Create or Update)
async function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('issue-id').value;
    const payload = {
        title: document.getElementById('form-title').value.trim(),
        category: document.getElementById('form-category').value,
        location: document.getElementById('form-location').value.trim(),
        reportedBy: document.getElementById('form-reportedBy').value.trim(),
        priority: document.getElementById('form-priority').value,
        description: document.getElementById('form-description').value.trim()
    };

    try {
        let url = API_BASE_URL;
        let method = 'POST';

        if (id) {
            url = `${API_BASE_URL}/${id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to save complaint');

        closeModal();
        await loadIssues();
    } catch (err) {
        alert("Error saving issue: " + err.message + "\nEnsure Spring Boot backend is running.");
    }
}

// View Issue Details Modal
function viewIssueDetails(issueId) {
    const issue = allIssues.find(i => i.id === issueId);
    if (!issue) return;

    const modal = document.getElementById('view-modal');
    const content = document.getElementById('view-modal-content');

    content.innerHTML = `
        <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${escapeHtml(issue.title)}</h3>
        <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 1rem;">
            Reported by <strong>${escapeHtml(issue.reportedBy)}</strong> on ${issue.createdAt ? new Date(issue.createdAt).toLocaleString() : 'Recently'}
        </p>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <span class="category-tag">${escapeHtml(issue.category)}</span>
            <span class="badge badge-${issue.status.toLowerCase()}">${getStatusLabel(issue.status)}</span>
        </div>

        <div style="background: #0f172a; padding: 1rem; border-radius: 12px; border: 1px solid #334155; margin-bottom: 1rem;">
            <strong style="color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 0.25rem;">DESCRIPTION</strong>
            <p style="line-height: 1.6;">${escapeHtml(issue.description)}</p>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #94a3b8;">
            <span>📍 Location: <strong>${escapeHtml(issue.location)}</strong></span>
            <span>⚡ Priority: <strong>${escapeHtml(issue.priority)}</strong></span>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeViewModal() {
    document.getElementById('view-modal').classList.add('hidden');
}

// Admin: Update Status
async function changeStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error("Failed to update status");
        await loadIssues();
    } catch (err) {
        alert("Error updating status: " + err.message);
    }
}

// Admin: Update Priority
async function changePriority(id, newPriority) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/priority`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority: newPriority })
        });
        if (!response.ok) throw new Error("Failed to update priority");
        await loadIssues();
    } catch (err) {
        alert("Error updating priority: " + err.message);
    }
}

// Delete Issue
async function deleteIssue(id) {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete issue");
        await loadIssues();
    } catch (err) {
        alert("Error deleting issue: " + err.message);
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
