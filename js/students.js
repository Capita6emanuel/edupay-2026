/* ====================================
   EDUPAY 2026 - STUDENT MANAGEMENT
   ==================================== */

const studentManager = {
    students: [],
    filters: {
        search: '',
        status: 'all',
        sortBy: 'name'
    }
};

// Initialize student page
document.addEventListener('DOMContentLoaded', function() {
    validateSession();
    initializeStudentPage();
});

function initializeStudentPage() {
    loadStudents();
    initializeFilters();
    initializeModal();
}

// Load students
function loadStudents() {
    // Simulate API call
    studentManager.students = [
        { id: 1, name: 'João Silva', email: 'joao@exemplo.pt', phone: '912345678', status: 'ativo', enrollmentDate: '2024-01-15', monthlyFee: 150, balance: -150 },
        { id: 2, name: 'Maria Santos', email: 'maria@exemplo.pt', phone: '923456789', status: 'ativo', enrollmentDate: '2024-02-20', monthlyFee: 150, balance: 0 },
        { id: 3, name: 'Pedro Costa', email: 'pedro@exemplo.pt', phone: '934567890', status: 'ativo', enrollmentDate: '2024-01-10', monthlyFee: 150, balance: -300 },
        { id: 4, name: 'Ana Oliveira', email: 'ana@exemplo.pt', phone: '945678901', status: 'inativo', enrollmentDate: '2023-09-05', monthlyFee: 150, balance: -500 },
        { id: 5, name: 'Carlos Pereira', email: 'carlos@exemplo.pt', phone: '956789012', status: 'ativo', enrollmentDate: '2024-03-01', monthlyFee: 150, balance: 0 }
    ];
    renderStudents();
}

// Render students
function renderStudents() {
    const filteredStudents = filterStudents();
    const tbody = document.querySelector('#students-table tbody');
    
    if (!tbody) return;

    tbody.innerHTML = filteredStudents.map(student => `
        <tr>
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td><span class="status-badge status-${student.status}">${student.status}</span></td>
            <td>${utils.formatCurrency(student.monthlyFee)}</td>
            <td class="balance ${student.balance < 0 ? 'negative' : 'positive'}">${utils.formatCurrency(student.balance)}</td>
            <td>
                <button class="btn-sm btn-edit" onclick="openEditModal(${student.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-sm btn-view" onclick="viewStudentDetails(${student.id})"><i class="fas fa-eye"></i></button>
                <button class="btn-sm btn-delete" onclick="confirmDeleteStudent(${student.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Filter students
function filterStudents() {
    let filtered = studentManager.students;

    // Search filter
    if (studentManager.filters.search) {
        const query = studentManager.filters.search.toLowerCase();
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.email.toLowerCase().includes(query)
        );
    }

    // Status filter
    if (studentManager.filters.status !== 'all') {
        filtered = filtered.filter(s => s.status === studentManager.filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
        switch(studentManager.filters.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'balance':
                return a.balance - b.balance;
            case 'date':
                return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
            default:
                return 0;
        }
    });

    return filtered;
}

// Initialize filters
function initializeFilters() {
    const searchInput = document.getElementById('student-search');
    const statusFilter = document.getElementById('status-filter');
    const sortBy = document.getElementById('sort-by');
    const addBtn = document.getElementById('add-student-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            studentManager.filters.search = e.target.value;
            renderStudents();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            studentManager.filters.status = e.target.value;
            renderStudents();
        });
    }

    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            studentManager.filters.sortBy = e.target.value;
            renderStudents();
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => openAddModal());
    }
}

// Modal management
function initializeModal() {
    const modal = document.getElementById('student-modal');
    const closeBtn = document.querySelector('.close-modal');
    const saveBtn = document.getElementById('save-student-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveStudent);
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

function openAddModal() {
    const modal = document.getElementById('student-modal');
    const form = document.getElementById('student-form');
    
    if (form) form.reset();
    if (modal) {
        modal.style.display = 'block';
        document.querySelector('.modal-title').textContent = 'Adicionar Novo Aluno';
    }
}

function openEditModal(id) {
    const student = studentManager.students.find(s => s.id === id);
    if (!student) return;

    const modal = document.getElementById('student-modal');
    const form = document.getElementById('student-form');

    if (form) {
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-email').value = student.email;
        document.getElementById('student-phone').value = student.phone;
        document.getElementById('student-status').value = student.status;
        document.getElementById('student-fee').value = student.monthlyFee;
    }

    if (modal) {
        modal.style.display = 'block';
        document.querySelector('.modal-title').textContent = 'Editar Aluno';
    }
}

function closeModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.style.display = 'none';
}

function saveStudent() {
    const id = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-email').value;
    const phone = document.getElementById('student-phone').value;
    const status = document.getElementById('student-status').value;
    const fee = parseFloat(document.getElementById('student-fee').value);

    if (!name || !email || !phone) {
        showNotification('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    if (id) {
        // Edit existing
        const student = studentManager.students.find(s => s.id === parseInt(id));
        if (student) {
            student.name = name;
            student.email = email;
            student.phone = phone;
            student.status = status;
            student.monthlyFee = fee;
        }
        showNotification('Aluno atualizado com sucesso!', 'success');
    } else {
        // Add new
        const newId = Math.max(...studentManager.students.map(s => s.id)) + 1;
        studentManager.students.push({
            id: newId,
            name,
            email,
            phone,
            status,
            monthlyFee: fee,
            enrollmentDate: new Date().toISOString().split('T')[0],
            balance: 0
        });
        showNotification('Aluno adicionado com sucesso!', 'success');
    }

    closeModal();
    renderStudents();
}

function viewStudentDetails(id) {
    const student = studentManager.students.find(s => s.id === id);
    if (!student) return;

    const details = `
        <strong>${student.name}</strong><br>
        Email: ${student.email}<br>
        Telefone: ${student.phone}<br>
        Status: ${student.status}<br>
        Data de Inscrição: ${utils.formatDate(student.enrollmentDate)}<br>
        Mensalidade: ${utils.formatCurrency(student.monthlyFee)}<br>
        Saldo: ${utils.formatCurrency(student.balance)}
    `;
    
    showNotification(details, 'info');
}

function confirmDeleteStudent(id) {
    if (confirm('Tem certeza que deseja eliminar este aluno?')) {
        studentManager.students = studentManager.students.filter(s => s.id !== id);
        renderStudents();
        showNotification('Aluno eliminado com sucesso!', 'success');
    }
}
