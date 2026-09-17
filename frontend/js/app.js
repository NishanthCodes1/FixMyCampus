/**
 * FixMyCampus - Campus Issue Reporting & Management System
 * Frontend Application Logic (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Config
    const API_BASE_URL = 'http://localhost:8080/api/issues';

    // Application State
    let allIssues = [];
    let filteredIssues = [];
    let currentDeleteId = null;
    let currentView = 'cards'; // 'cards' or 'table'

    // DOM Elements - Dashboard Stats
    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statInProgress = document.getElementById('stat-in-progress');
    const statResolved = document.getElementById('stat-resolved');
    const issuesCountBadge = document.getElementById('issues-count-badge');
    const apiStatusText = document.getElementById('api-status-text');

    // DOM Elements - Toolbar & Containers
    const inputSearch = document.getElementById('input-search');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const filterCategory = document.getElementById('filter-category');
    const filterStatus = document.getElementById('filter-status');
    const filterPriority = document.getElementById('filter-priority');
    const btnRefresh = document.getElementById('btn-refresh');
    const btnOpenCreateModal = document.getElementById('btn-open-create-modal');
    const btnEmptyReport = document.getElementById('btn-empty-report');

    const issuesCardsContainer = document.getElementById('issues-cards-container');
    const issuesTableContainer = document.getElementById('issues-table-container');
    const issuesTableBody = document.getElementById('issues-table-body');
    const emptyState = document.getElementById('empty-state');
    const loadingSpinner = document.getElementById('loading-spinner');

    const btnViewCards = document.getElementById('btn-view-cards');
    const btnViewTable = document.getElementById('btn-view-table');

    // DOM Elements - Modals & Forms
    const createModal = document.getElementById('create-modal');
    const createForm = document.getElementById('create-issue-form');
    
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-issue-form');
    const editIssueIdLabel = document.getElementById('edit-issue-id-label');

    const deleteModal = document.getElementById('delete-modal');
    const deleteIssueTitle = document.getElementById('delete-issue-title');
    const deleteIssueId = document.getElementById('delete-issue-id');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');

    const toastContainer = document.getElementById('toast-container');

    // Initial Load
    init();

    function init() {
        bindEvents();
        fetchIssues();
    }

    function bindEvents() {
        // Refresh & Create
        btnRefresh.addEventListener('click', () => {
            const icon = btnRefresh.querySelector('i');
            icon.classList.add('spin-icon');
            fetchIssues().finally(() => {
                setTimeout(() => icon.classList.remove('spin-icon'), 600);
            });
        });

        btnOpenCreateModal.addEventListener('click', () => openModal(createModal));
        btnEmptyReport.addEventListener('click', () => openModal(createModal));

        // Views toggle
        btnViewCards.addEventListener('click', () => setView('cards'));
        btnViewTable.addEventListener('click', () => setView('table'));

        // Search & Filters
        inputSearch.addEventListener('input', () => {
            btnClearSearch.style.display = inputSearch.value.trim() ? 'block' : 'none';
            applyFilters();
        });

        btnClearSearch.addEventListener('click', () => {
            inputSearch.value = '';
            btnClearSearch.style.display = 'none';
            applyFilters();
        });

        filterCategory.addEventListener('change', applyFilters);
        filterStatus.addEventListener('change', applyFilters);
        filterPriority.addEventListener('change', applyFilters);

        // Forms Submit
        createForm.addEventListener('submit', handleCreateIssue);
        editForm.addEventListener('submit', handleUpdateIssue);
        btnConfirmDelete.addEventListener('click', handleConfirmDelete);

        // Close Modal buttons
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        // Close on Backdrop click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    }

    // ==========================================
    // API CRUD OPERATIONS
    // ==========================================

    // GET /api/issues
    async function fetchIssues() {
        showLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            allIssues = await response.json();
            updateDashboardStats(allIssues);
            applyFilters();
            setApiStatus(true);
        } catch (error) {
            console.error('Error fetching issues:', error);
            showToast('Failed to connect to backend server at ' + API_BASE_URL, 'error');
            setApiStatus(false);
            showEmptyState(true);
        } finally {
            showLoading(false);
        }
    }

    // POST /api/issues
    async function handleCreateIssue(e) {
        e.preventDefault();
        if (!validateForm(createForm, 'create')) return;

        const payload = {
            title: document.getElementById('create-title').value.trim(),
            description: document.getElementById('create-description').value.trim(),
            location: document.getElementById('create-location').value.trim(),
            category: document.getElementById('create-category').value,
            priority: document.getElementById('create-priority').value,
            status: document.getElementById('create-status').value,
            reportedBy: document.getElementById('create-reportedBy').value.trim()
        };

        const btnSubmit = document.getElementById('btn-submit-create');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner spin-icon"></i> Reporting...`;

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to create issue');
            }

            const createdIssue = await response.json();
            showToast(`Issue #${createdIssue.id} reported successfully!`, 'success');
            closeAllModals();
            createForm.reset();
            document.getElementById('create-status').value = 'PENDING';
            fetchIssues();
        } catch (error) {
            console.error('Error creating issue:', error);
            showToast(error.message || 'Failed to create issue', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Report Issue`;
        }
    }

    // PUT /api/issues/{id}
    async function handleUpdateIssue(e) {
        e.preventDefault();
        if (!validateForm(editForm, 'edit')) return;

        const id = document.getElementById('edit-id').value;
        const payload = {
            title: document.getElementById('edit-title').value.trim(),
            description: document.getElementById('edit-description').value.trim(),
            location: document.getElementById('edit-location').value.trim(),
            category: document.getElementById('edit-category').value,
            priority: document.getElementById('edit-priority').value,
            status: document.getElementById('edit-status').value,
            reportedBy: document.getElementById('edit-reportedBy').value.trim()
        };

        const btnSubmit = document.getElementById('btn-submit-edit');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner spin-icon"></i> Saving...`;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to update issue');
            }

            const updated = await response.json();
            showToast(`Issue #${updated.id} updated successfully!`, 'success');
            closeAllModals();
            fetchIssues();
        } catch (error) {
            console.error('Error updating issue:', error);
            showToast(error.message || 'Failed to update issue', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Changes`;
        }
    }

    // DELETE /api/issues/{id}
    async function handleConfirmDelete() {
        if (!currentDeleteId) return;

        btnConfirmDelete.disabled = true;
        btnConfirmDelete.innerHTML = `<i class="fa-solid fa-spinner spin-icon"></i> Deleting...`;

        try {
            const response = await fetch(`${API_BASE_URL}/${currentDeleteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete issue');
            }

            showToast(`Issue #${currentDeleteId} deleted successfully`, 'success');
            closeAllModals();
            fetchIssues();
        } catch (error) {
            console.error('Error deleting issue:', error);
            showToast(error.message || 'Failed to delete issue', 'error');
        } finally {
            btnConfirmDelete.disabled = false;
            btnConfirmDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Issue`;
            currentDeleteId = null;
        }
    }

    // ==========================================
    // UI DASHBOARD & RENDER LOGIC
    // ==========================================

    function updateDashboardStats(issues) {
        const total = issues.length;
        const pending = issues.filter(i => (i.status || '').toUpperCase() === 'PENDING').length;
        const inProgress = issues.filter(i => (i.status || '').toUpperCase() === 'IN_PROGRESS').length;
        const resolved = issues.filter(i => (i.status || '').toUpperCase() === 'RESOLVED').length;

        animateCounter(statTotal, total);
        animateCounter(statPending, pending);
        animateCounter(statInProgress, inProgress);
        animateCounter(statResolved, resolved);
    }

    function animateCounter(element, targetValue) {
        element.textContent = targetValue;
    }

    function applyFilters() {
        const query = inputSearch.value.trim().toLowerCase();
        const cat = filterCategory.value;
        const stat = filterStatus.value;
        const prio = filterPriority.value;

        filteredIssues = allIssues.filter(issue => {
            const matchQuery = !query || 
                (issue.title && issue.title.toLowerCase().includes(query)) ||
                (issue.description && issue.description.toLowerCase().includes(query)) ||
                (issue.location && issue.location.toLowerCase().includes(query)) ||
                (issue.reportedBy && issue.reportedBy.toLowerCase().includes(query));

            const matchCat = !cat || issue.category === cat;
            const matchStat = !stat || (issue.status || '').toUpperCase() === stat.toUpperCase();
            const matchPrio = !prio || (issue.priority || '').toUpperCase() === prio.toUpperCase();

            return matchQuery && matchCat && matchStat && matchPrio;
        });

        issuesCountBadge.textContent = `${filteredIssues.length} ${filteredIssues.length === 1 ? 'issue' : 'issues'}`;

        if (filteredIssues.length === 0) {
            showEmptyState(true);
        } else {
            showEmptyState(false);
            renderIssues(filteredIssues);
        }
    }

    function renderIssues(issues) {
        // Render Cards Grid
        issuesCardsContainer.innerHTML = issues.map(issue => `
            <div class="issue-card">
                <div>
                    <div class="card-top">
                        <span class="issue-id">#${issue.id}</span>
                        <div class="badges-group">
                            <span class="badge badge-priority-${issue.priority || 'LOW'}">${issue.priority || 'LOW'}</span>
                            <span class="badge badge-status-${issue.status || 'PENDING'}">${formatStatusLabel(issue.status)}</span>
                        </div>
                    </div>
                    <h4 class="issue-title">${escapeHtml(issue.title)}</h4>
                    <p class="issue-desc">${escapeHtml(issue.description)}</p>
                </div>
                <div>
                    <div class="issue-meta">
                        <div class="meta-item">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${escapeHtml(issue.location)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-folder"></i>
                            <span>${escapeHtml(issue.category)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-user"></i>
                            <span>${escapeHtml(issue.reportedBy)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-calendar-day"></i>
                            <span>${formatDate(issue.createdAt)}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn edit-btn" onclick="app.openEditModal(${issue.id})">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="app.openDeleteModal(${issue.id}, '${escapeHtml(issue.title).replace(/'/g, "\\'")}')">
                            <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Render Table Body
        issuesTableBody.innerHTML = issues.map(issue => `
            <tr>
                <td><strong>#${issue.id}</strong></td>
                <td>
                    <span class="table-title">${escapeHtml(issue.title)}</span>
                    <span class="table-desc">${escapeHtml(issue.description)}</span>
                </td>
                <td><i class="fa-solid fa-location-dot text-muted"></i> ${escapeHtml(issue.location)}</td>
                <td><span class="badge" style="background:#f1f5f9; color:#475569;">${escapeHtml(issue.category)}</span></td>
                <td><span class="badge badge-priority-${issue.priority || 'LOW'}">${issue.priority || 'LOW'}</span></td>
                <td><span class="badge badge-status-${issue.status || 'PENDING'}">${formatStatusLabel(issue.status)}</span></td>
                <td>${escapeHtml(issue.reportedBy)}</td>
                <td>${formatDate(issue.createdAt)}</td>
                <td>
                    <div style="display:flex; gap:0.4rem;">
                        <button class="action-btn edit-btn" onclick="app.openEditModal(${issue.id})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="app.openDeleteModal(${issue.id}, '${escapeHtml(issue.title).replace(/'/g, "\\'")}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ==========================================
    // MODAL OPEN & FILL HELPERS
    // ==========================================

    function openEditModal(id) {
        const issue = allIssues.find(i => i.id === id);
        if (!issue) return;

        document.getElementById('edit-id').value = issue.id;
        editIssueIdLabel.textContent = `#${issue.id}`;
        document.getElementById('edit-title').value = issue.title || '';
        document.getElementById('edit-location').value = issue.location || '';
        document.getElementById('edit-category').value = issue.category || 'INFRASTRUCTURE';
        document.getElementById('edit-priority').value = issue.priority || 'LOW';
        document.getElementById('edit-status').value = issue.status || 'PENDING';
        document.getElementById('edit-reportedBy').value = issue.reportedBy || '';
        document.getElementById('edit-description').value = issue.description || '';

        clearValidationErrors(editForm);
        openModal(editModal);
    }

    function openDeleteModal(id, title) {
        currentDeleteId = id;
        deleteIssueId.textContent = `#${id}`;
        deleteIssueTitle.textContent = title || `Issue #${id}`;
        openModal(deleteModal);
    }

    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }

    function setView(view) {
        currentView = view;
        if (view === 'cards') {
            btnViewCards.classList.add('active');
            btnViewTable.classList.remove('active');
            issuesCardsContainer.style.display = 'grid';
            issuesTableContainer.style.display = 'none';
        } else {
            btnViewTable.classList.add('active');
            btnViewCards.classList.remove('active');
            issuesCardsContainer.style.display = 'none';
            issuesTableContainer.style.display = 'block';
        }
    }

    function showLoading(show) {
        loadingSpinner.style.display = show ? 'block' : 'none';
        if (show) {
            issuesCardsContainer.style.display = 'none';
            issuesTableContainer.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            setView(currentView);
        }
    }

    function showEmptyState(show) {
        emptyState.style.display = show ? 'block' : 'none';
        if (show) {
            issuesCardsContainer.style.display = 'none';
            issuesTableContainer.style.display = 'none';
        }
    }

    function setApiStatus(online) {
        apiStatusText.textContent = online ? 'Connected (http://localhost:8080)' : 'Disconnected (Offline)';
        const dot = document.querySelector('.status-dot');
        if (online) {
            dot.classList.add('online');
        } else {
            dot.classList.remove('online');
        }
    }

    // Validation
    function validateForm(form, prefix) {
        clearValidationErrors(form);
        let isValid = true;

        const title = form.querySelector(`#${prefix}-title`);
        const location = form.querySelector(`#${prefix}-location`);
        const category = form.querySelector(`#${prefix}-category`);
        const reportedBy = form.querySelector(`#${prefix}-reportedBy`);
        const description = form.querySelector(`#${prefix}-description`);

        if (!title.value.trim()) {
            showFieldError(prefix, 'title', 'Title is required');
            isValid = false;
        } else if (title.value.trim().length < 3) {
            showFieldError(prefix, 'title', 'Title must be at least 3 characters');
            isValid = false;
        }

        if (!location.value.trim()) {
            showFieldError(prefix, 'location', 'Location is required');
            isValid = false;
        }

        if (!category.value) {
            showFieldError(prefix, 'category', 'Category is required');
            isValid = false;
        }

        if (!reportedBy.value.trim()) {
            showFieldError(prefix, 'reportedBy', 'Reported By is required');
            isValid = false;
        }

        if (!description.value.trim()) {
            showFieldError(prefix, 'description', 'Description is required');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(prefix, field, msg) {
        const errorSpan = document.getElementById(`error-${prefix}-${field}`);
        const input = document.getElementById(`${prefix}-${field}`);
        if (errorSpan) errorSpan.textContent = msg;
        if (input && input.parentElement) input.parentElement.classList.add('has-error');
    }

    function clearValidationErrors(form) {
        form.querySelectorAll('.field-error').forEach(span => span.textContent = '');
        form.querySelectorAll('.has-error').forEach(div => div.classList.remove('has-error'));
    }

    // Utilities
    function formatStatusLabel(status) {
        if (!status) return 'PENDING';
        return status.replace('_', ' ');
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'Just now';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon"></i>
            <span>${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Expose global methods for inline button onclick handlers
    window.app = {
        openEditModal,
        openDeleteModal
    };
});
