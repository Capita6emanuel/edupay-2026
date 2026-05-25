/* ====================================
   EDUPAY 2026 - PAYMENT MANAGEMENT
   ==================================== */

const paymentManager = {
    payments: [],
    filters: {
        search: '',
        status: 'all',
        dateRange: 'all'
    }
};

// Initialize payments page
document.addEventListener('DOMContentLoaded', function() {
    validateSession();
    initializePaymentsPage();
});

function initializePaymentsPage() {
    loadPayments();
    initializePaymentFilters();
    initializePaymentModal();
}

// Load payments
function loadPayments() {
    paymentManager.payments = [
        { id: 1, student: 'João Silva', amount: 150, date: '2026-05-20', status: 'completo', method: 'transferência', receipt: '001' },
        { id: 2, student: 'Maria Santos', amount: 150, date: '2026-05-22', status: 'completo', method: 'cartão', receipt: '002' },
        { id: 3, student: 'Pedro Costa', amount: 150, date: '2026-05-23', status: 'pendente', method: 'referência', receipt: '003' },
        { id: 4, student: 'Ana Oliveira', amount: 150, date: '2026-04-24', status: 'atraso', method: 'transferência', receipt: '004' },
        { id: 5, student: 'Carlos Pereira', amount: 150, date: '2026-05-25', status: 'completo', method: 'cartão', receipt: '005' }
    ];
    renderPayments();
}

// Render payments
function renderPayments() {
    const filteredPayments = filterPayments();
    const tbody = document.querySelector('#payments-table tbody');
    
    if (!tbody) return;

    tbody.innerHTML = filteredPayments.map(payment => `
        <tr>
            <td><strong>${payment.student}</strong></td>
            <td>${utils.formatCurrency(payment.amount)}</td>
            <td>${utils.formatDate(payment.date)}</td>
            <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
            <td>${payment.method}</td>
            <td>
                <button class="btn-sm btn-view" onclick="viewPaymentReceipt('${payment.receipt}')"><i class="fas fa-file-pdf"></i></button>
                <button class="btn-sm btn-edit" onclick="openPaymentModal(${payment.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-sm btn-send" onclick="sendReceipt('${payment.receipt}')"><i class="fas fa-envelope"></i></button>
            </td>
        </tr>
    `).join('');
}

// Filter payments
function filterPayments() {
    let filtered = paymentManager.payments;

    // Search filter
    if (paymentManager.filters.search) {
        const query = paymentManager.filters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.student.toLowerCase().includes(query) || 
            p.receipt.toLowerCase().includes(query)
        );
    }

    // Status filter
    if (paymentManager.filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === paymentManager.filters.status);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Initialize payment filters
function initializePaymentFilters() {
    const searchInput = document.getElementById('payment-search');
    const statusFilter = document.getElementById('payment-status-filter');
    const generateBtn = document.getElementById('generate-payment-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            paymentManager.filters.search = e.target.value;
            renderPayments();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            paymentManager.filters.status = e.target.value;
            renderPayments();
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', generatePaymentReference);
    }
}

// Payment modal
function initializePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const closeBtn = document.querySelector('.close-payment-modal');
    const saveBtn = document.getElementById('save-payment-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', savePayment);
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) closePaymentModal();
        });
    }
}

function openPaymentModal(id) {
    const payment = paymentManager.payments.find(p => p.id === id);
    if (!payment) return;

    const modal = document.getElementById('payment-modal');
    if (modal) {
        document.getElementById('payment-id').value = payment.id;
        document.getElementById('payment-student').value = payment.student;
        document.getElementById('payment-amount').value = payment.amount;
        document.getElementById('payment-method').value = payment.method;
        document.getElementById('payment-status').value = payment.status;
        modal.style.display = 'block';
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.style.display = 'none';
}

function savePayment() {
    const id = parseInt(document.getElementById('payment-id').value);
    const status = document.getElementById('payment-status').value;
    const method = document.getElementById('payment-method').value;

    const payment = paymentManager.payments.find(p => p.id === id);
    if (payment) {
        payment.status = status;
        payment.method = method;
        renderPayments();
        closePaymentModal();
        showNotification('Pagamento atualizado com sucesso!', 'success');
    }
}

// Payment actions
function generatePaymentReference() {
    const reference = generateMBWayReference();
    showNotification(`Referência gerada: ${reference}`, 'success');
}

function generateMBWayReference() {
    const entity = '10614';
    const reference = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const amount = '150';
    return `${entity} ${reference} ${amount}`;
}

function viewPaymentReceipt(receipt) {
    showNotification(`Visualizando recibo: ${receipt}`, 'info');
}

function sendReceipt(receipt) {
    showNotification(`Recibo ${receipt} enviado por email!`, 'success');
}

function exportPaymentsReport() {
    let csv = 'Aluno,Valor,Data,Status,Método\n';
    paymentManager.payments.forEach(payment => {
        csv += `${payment.student},${payment.amount},${payment.date},${payment.status},${payment.method}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pagamentos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}
