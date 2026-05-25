/* ====================================
   EDUPAY 2026 - DASHBOARD
   ==================================== */

// Dashboard state
const dashboard = {
    students: [],
    payments: [],
    finances: {},
    isLoading: false,
    currentMonth: new Date()
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    validateSession();
    initializeDashboard();
});

function initializeDashboard() {
    console.log('Dashboard initialized');
    loadDashboardData();
    initializeSidebar();
    initializeDashboardEvents();
    updateUserProfile();
}

// Load dashboard data
function loadDashboardData() {
    dashboard.isLoading = true;
    
    // Simulate API calls
    setTimeout(() => {
        loadStudentsData();
        loadPaymentsData();
        loadFinancialData();
        dashboard.isLoading = false;
        renderDashboard();
    }, 500);
}

// Load students
function loadStudentsData() {
    dashboard.students = [
        { id: 1, name: 'João Silva', email: 'joao@exemplo.pt', status: 'ativo', balance: -150 },
        { id: 2, name: 'Maria Santos', email: 'maria@exemplo.pt', status: 'ativo', balance: 0 },
        { id: 3, name: 'Pedro Costa', email: 'pedro@exemplo.pt', status: 'ativo', balance: -300 },
        { id: 4, name: 'Ana Oliveira', email: 'ana@exemplo.pt', status: 'inativo', balance: -500 },
        { id: 5, name: 'Carlos Pereira', email: 'carlos@exemplo.pt', status: 'ativo', balance: 0 }
    ];
}

// Load payments
function loadPaymentsData() {
    dashboard.payments = [
        { id: 1, student: 'João Silva', amount: 150, date: new Date(2026, 4, 20), status: 'completo' },
        { id: 2, student: 'Maria Santos', amount: 150, date: new Date(2026, 4, 22), status: 'completo' },
        { id: 3, student: 'Pedro Costa', amount: 150, date: new Date(2026, 4, 23), status: 'pendente' },
        { id: 4, student: 'Ana Oliveira', amount: 150, date: new Date(2026, 4, 24), status: 'atraso' },
        { id: 5, student: 'Carlos Pereira', amount: 150, date: new Date(2026, 4, 25), status: 'completo' }
    ];
}

// Load financial data
function loadFinancialData() {
    dashboard.finances = {
        totalRevenue: 45000,
        totalExpenses: 12500,
        totalStudents: 1247,
        activePayments: 856,
        pendingPayments: 250,
        overduePayments: 141,
        monthlyRevenue: [
            { month: 'Jan', revenue: 35000 },
            { month: 'Fev', revenue: 38000 },
            { month: 'Mar', revenue: 42000 },
            { month: 'Abr', revenue: 44000 },
            { month: 'Mai', revenue: 45000 }
        ]
    };
}

// Render dashboard
function renderDashboard() {
    renderMetrics();
    renderStudentsTable();
    renderPaymentsTable();
    renderChart();
}

// Render metrics
function renderMetrics() {
    const metricsContainer = document.getElementById('metrics-container');
    if (!metricsContainer) return;

    const metrics = [
        { title: 'Receita Total', value: utils.formatCurrency(dashboard.finances.totalRevenue), icon: 'fa-wallet', color: 'primary' },
        { title: 'Despesas', value: utils.formatCurrency(dashboard.finances.totalExpenses), icon: 'fa-chart-line', color: 'danger' },
        { title: 'Alunos Ativos', value: dashboard.finances.totalStudents, icon: 'fa-users', color: 'success' },
        { title: 'Pagamentos Pendentes', value: dashboard.finances.pendingPayments, icon: 'fa-clock', color: 'warning' }
    ];

    metricsContainer.innerHTML = metrics.map(metric => `
        <div class="metric-card metric-${metric.color}">
            <div class="metric-icon"><i class="fas ${metric.icon}"></i></div>
            <div class="metric-content">
                <div class="metric-title">${metric.title}</div>
                <div class="metric-value">${metric.value}</div>
            </div>
        </div>
    `).join('');
}

// Render students table
function renderStudentsTable() {
    const tbody = document.querySelector('#students-table tbody');
    if (!tbody) return;

    tbody.innerHTML = dashboard.students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td><span class="status-badge status-${student.status}">${student.status}</span></td>
            <td>${utils.formatCurrency(student.balance)}</td>
            <td>
                <button class="btn-sm btn-edit" onclick="editStudent(${student.id})">Editar</button>
                <button class="btn-sm btn-delete" onclick="deleteStudent(${student.id})">Deletar</button>
            </td>
        </tr>
    `).join('');
}

// Render payments table
function renderPaymentsTable() {
    const tbody = document.querySelector('#payments-table tbody');
    if (!tbody) return;

    tbody.innerHTML = dashboard.payments.map(payment => `
        <tr>
            <td>${payment.student}</td>
            <td>${utils.formatCurrency(payment.amount)}</td>
            <td>${utils.formatDate(payment.date)}</td>
            <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
            <td>
                <button class="btn-sm btn-view" onclick="viewPayment(${payment.id})">Ver</button>
            </td>
        </tr>
    `).join('');
}

// Render chart (placeholder)
function renderChart() {
    const chartContainer = document.getElementById('revenue-chart');
    if (!chartContainer) return;

    const data = dashboard.finances.monthlyRevenue;
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    
    chartContainer.innerHTML = `
        <div class="chart-container">
            ${data.map(item => `
                <div class="chart-bar">
                    <div class="bar" style="height: ${(item.revenue / maxRevenue) * 100}%"></div>
                    <div class="label">${item.month}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Update user profile
function updateUserProfile() {
    const user = getCurrentUser();
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarEl = document.getElementById('user-avatar');

    if (userNameEl) userNameEl.textContent = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userAvatarEl) userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
}

// Sidebar initialization
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Dashboard events
function initializeDashboardEvents() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(function(e) {
            const query = e.target.value.toLowerCase();
            filterStudents(query);
        }, 300));
    }

    // Date range picker
    const dateRange = document.getElementById('date-range');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            loadDashboardData();
        });
    }
}

// Filter students
function filterStudents(query) {
    const filtered = dashboard.students.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
    );
    
    const tbody = document.querySelector('#students-table tbody');
    if (tbody) {
        tbody.innerHTML = filtered.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td><span class="status-badge status-${student.status}">${student.status}</span></td>
                <td>${utils.formatCurrency(student.balance)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editStudent(${student.id})">Editar</button>
                    <button class="btn-sm btn-delete" onclick="deleteStudent(${student.id})">Deletar</button>
                </td>
            </tr>
        `).join('');
    }
}

// Student actions
function editStudent(id) {
    const student = dashboard.students.find(s => s.id === id);
    console.log('Edit student:', student);
    showNotification(`Editando aluno: ${student.name}`, 'info');
}

function deleteStudent(id) {
    if (confirm('Tem certeza que deseja eliminar este aluno?')) {
        dashboard.students = dashboard.students.filter(s => s.id !== id);
        renderStudentsTable();
        showNotification('Aluno eliminado com sucesso!', 'success');
    }
}

// Payment actions
function viewPayment(id) {
    const payment = dashboard.payments.find(p => p.id === id);
    console.log('View payment:', payment);
    showNotification(`Visualizando pagamento: ${payment.student}`, 'info');
}

// Export data
function exportData(format = 'csv') {
    if (format === 'csv') {
        exportToCSV();
    } else if (format === 'pdf') {
        exportToPDF();
    }
}

function exportToCSV() {
    let csv = 'Nome,Email,Status,Saldo\n';
    dashboard.students.forEach(student => {
        csv += `${student.name},${student.email},${student.status},${student.balance}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alunos.csv';
    a.click();
}

function exportToPDF() {
    showNotification('Exportação em PDF em desenvolvimento', 'info');
}

// Logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        logoutUser();
    }
}
