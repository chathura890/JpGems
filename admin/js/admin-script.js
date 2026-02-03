// Admin Panel JavaScript

// Global variables
let currentSection = 'dashboard';
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadDashboardStats();
    loadAllData();
    setupEventListeners();
});

// Check admin authentication
function checkAdminAuth() {
    const adminUser = localStorage.getItem('jpgems_admin');
    if (!adminUser) {
        // Redirect to admin login
        // window.location.href = '../admin-login.html';
        console.log('Admin not logged in');
    } else {
        currentUser = JSON.parse(adminUser);
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Update page title
    const pageTitle = document.querySelector('.page-title');
    pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

    currentSection = sectionName;

    // Load section data
    loadSectionData(sectionName);
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch('../php/admin/dashboard-stats.php');
        const data = await response.json();

        if (data.success) {
            document.getElementById('total-gemstones').textContent = data.stats.total_gemstones || 0;
            document.getElementById('total-orders').textContent = data.stats.total_orders || 0;
            document.getElementById('total-users').textContent = data.stats.total_users || 0;
            document.getElementById('total-revenue').textContent = '$' + (data.stats.total_revenue || 0).toFixed(2);

            // Load recent orders
            loadRecentOrders(data.recent_orders || []);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load recent orders
function loadRecentOrders(orders) {
    const tbody = document.getElementById('recent-orders-body');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.order_number}</td>
            <td>${order.customer_name || 'Guest'}</td>
            <td>$${parseFloat(order.total_amount).toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Load all data
function loadAllData() {
    loadGemstones();
    loadCategories();
    loadOrders();
    loadUsers();
    loadMessages();
    loadFeedback();
    populateCategorySelects();
}

// Load section data
function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'gemstones':
            loadGemstones();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'feedback':
            loadFeedback();
            break;
    }
}

// Load gemstones
async function loadGemstones() {
    try {
        const response = await fetch('../php/admin/gemstones.php?action=list');
        const data = await response.json();

        const tbody = document.getElementById('gemstones-table-body');
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No gemstones found</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(gem => `
            <tr>
                <td>${gem.id}</td>
                <td><img src="${gem.image_url}" alt="${gem.name}" class="product-img"></td>
                <td>${gem.name}</td>
                <td>${gem.category}</td>
                <td>$${parseFloat(gem.price).toFixed(2)}</td>
                <td>${gem.stock_quantity || 0}</td>
                <td><span class="status-badge ${gem.is_active ? 'status-active' : 'status-inactive'}">${gem.is_active ? 'Active' : 'Inactive'}</span></td>
                <td class="action-btns">
                    <button class="btn btn-info" onclick="editGemstone(${gem.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="deleteGemstone(${gem.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading gemstones:', error);
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch('../php/admin/categories.php?action=list');
        const data = await response.json();

        const tbody = document.getElementById('categories-table-body');
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No categories found</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(cat => `
            <tr>
                <td>${cat.id}</td>
                <td>${cat.name}</td>
                <td>${cat.slug}</td>
                <td>${cat.description || '-'}</td>
                <td><span class="status-badge ${cat.is_active ? 'status-active' : 'status-inactive'}">${cat.is_active ? 'Active' : 'Inactive'}</span></td>
                <td class="action-btns">
                    <button class="btn btn-info" onclick="editCategory(${cat.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="deleteCategory(${cat.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('../php/admin/orders.php?action=list');
        const data = await response.json();

        const tbody = document.getElementById('orders-table-body');
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(order => `
            <tr>
                <td>#${order.order_number}</td>
                <td>${order.customer_name || 'Guest'}</td>
                <td>${order.item_count || 0} items</td>
                <td>$${parseFloat(order.total_amount).toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td class="action-btns">
                    <button class="btn btn-info" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-success" onclick="updateOrderStatus(${order.id})"><i class="fas fa-check"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('../php/admin/users.php?action=list');
        const data = await response.json();

        const tbody = document.getElementById('users-table-body');
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge ${user.is_active ? 'status-active' : 'status-inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                <td class="action-btns">
                    <button class="btn btn-info" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn ${user.is_active ? 'btn-danger' : 'btn-success'}" onclick="toggleUserStatus(${user.id}, ${user.is_active})">
                        <i class="fas fa-${user.is_active ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load messages
async function loadMessages() {
    try {
        const response = await fetch('../php/admin/messages.php?action=list');
        const data = await response.json();

        const tbody = document.getElementById('messages-table-body');
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No messages found</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(msg => `
            <tr>
                <td>${msg.id}</td>
                <td>${msg.name}</td>
                <td>${msg.email}</td>
                <td>${msg.subject}</td>
                <td>${msg.message.substring(0, 50)}...</td>
                <td>${new Date(msg.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge status-${msg.status}">${msg.status}</span></td>
                <td class="action-btns">
                    <button class="btn btn-info" onclick="viewMessage(${msg.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger" onclick="deleteMessage(${msg.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Load feedback
async function loadFeedback() {
    try {
        const response = await fetch('../php/admin/feedback.php?action=list');
        const data = await response.json();

        const tbody = document.getElementById('feedback-table-body');
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No feedback found</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(fb => `
            <tr>
                <td>${fb.id}</td>
                <td>${fb.name}</td>
                <td>${fb.email}</td>
                <td>${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</td>
                <td>${fb.message.substring(0, 50)}...</td>
                <td>${new Date(fb.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge status-${fb.status}">${fb.status}</span></td>
                <td class="action-btns">
                    <button class="btn btn-success" onclick="approveFeedback(${fb.id})"><i class="fas fa-check"></i></button>
                    <button class="btn btn-danger" onclick="deleteFeedback(${fb.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

// Populate category selects
async function populateCategorySelects() {
    try {
        const response = await fetch('../php/admin/categories.php?action=list');
        const data = await response.json();

        if (data.success) {
            const selects = ['gemstone-category', 'gemstone-category-filter'];
            selects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    const options = data.data.map(cat => 
                        `<option value="${cat.slug}">${cat.name}</option>`
                    ).join('');
                    select.innerHTML += options;
                }
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Modal functions
function openGemstoneModal(id = null) {
    const modal = document.getElementById('gemstoneModal');
    const title = document.getElementById('gemstone-modal-title');
    
    if (id) {
        title.textContent = 'Edit Gemstone';
        loadGemstoneData(id);
    } else {
        title.textContent = 'Add New Gemstone';
        document.getElementById('gemstone-form').reset();
    }
    
    modal.classList.add('active');
}

function openCategoryModal(id = null) {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('category-modal-title');
    
    if (id) {
        title.textContent = 'Edit Category';
        loadCategoryData(id);
    } else {
        title.textContent = 'Add New Category';
        document.getElementById('category-form').reset();
    }
    
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Load gemstone data for editing
async function loadGemstoneData(id) {
    try {
        const response = await fetch(`../php/admin/gemstones.php?action=get&id=${id}`);
        const data = await response.json();

        if (data.success) {
            const gem = data.data;
            document.getElementById('gemstone-id').value = gem.id;
            document.getElementById('gemstone-name').value = gem.name;
            document.getElementById('gemstone-category').value = gem.category;
            document.getElementById('gemstone-price').value = gem.price;
            document.getElementById('gemstone-sale-price').value = gem.sale_price || '';
            document.getElementById('gemstone-stock').value = gem.stock_quantity || 0;
            document.getElementById('gemstone-weight').value = gem.weight || '';
            document.getElementById('gemstone-image').value = gem.image_url;
            document.getElementById('gemstone-description').value = gem.description;
            document.getElementById('gemstone-origin').value = gem.origin || '';
            document.getElementById('gemstone-clarity').value = gem.clarity || '';
            document.getElementById('gemstone-featured').checked = gem.is_featured;
            document.getElementById('gemstone-new').checked = gem.is_new;
        }
    } catch (error) {
        console.error('Error loading gemstone:', error);
    }
}

// Edit gemstone
function editGemstone(id) {
    openGemstoneModal(id);
}

// Delete gemstone
async function deleteGemstone(id) {
    if (!confirm('Are you sure you want to delete this gemstone?')) return;

    try {
        const response = await fetch('../php/admin/gemstones.php?action=delete&id=' + id);
        const data = await response.json();

        if (data.success) {
            alert('Gemstone deleted successfully');
            loadGemstones();
        } else {
            alert('Failed to delete gemstone: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting gemstone:', error);
        alert('Error deleting gemstone');
    }
}

// Edit category
function editCategory(id) {
    openCategoryModal(id);
}

// Delete category
async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        const response = await fetch('../php/admin/categories.php?action=delete&id=' + id);
        const data = await response.json();

        if (data.success) {
            alert('Category deleted successfully');
            loadCategories();
        } else {
            alert('Failed to delete category: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Gemstone form submit
    const gemstoneForm = document.getElementById('gemstone-form');
    if (gemstoneForm) {
        gemstoneForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                id: document.getElementById('gemstone-id').value,
                name: document.getElementById('gemstone-name').value,
                category: document.getElementById('gemstone-category').value,
                price: document.getElementById('gemstone-price').value,
                sale_price: document.getElementById('gemstone-sale-price').value,
                stock_quantity: document.getElementById('gemstone-stock').value,
                weight: document.getElementById('gemstone-weight').value,
                image_url: document.getElementById('gemstone-image').value,
                description: document.getElementById('gemstone-description').value,
                origin: document.getElementById('gemstone-origin').value,
                clarity: document.getElementById('gemstone-clarity').value,
                is_featured: document.getElementById('gemstone-featured').checked ? 1 : 0,
                is_new: document.getElementById('gemstone-new').checked ? 1 : 0
            };

            try {
                const action = formData.id ? 'update' : 'create';
                const response = await fetch(`../php/admin/gemstones.php?action=${action}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('Gemstone saved successfully');
                    closeModal('gemstoneModal');
                    loadGemstones();
                } else {
                    alert('Failed to save gemstone: ' + data.message);
                }
            } catch (error) {
                console.error('Error saving gemstone:', error);
                alert('Error saving gemstone');
            }
        });
    }

    // Category form submit
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                id: document.getElementById('category-id').value,
                name: document.getElementById('category-name').value,
                slug: document.getElementById('category-slug').value,
                description: document.getElementById('category-description').value
            };

            try {
                const action = formData.id ? 'update' : 'create';
                const response = await fetch(`../php/admin/categories.php?action=${action}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('Category saved successfully');
                    closeModal('categoryModal');
                    loadCategories();
                    populateCategorySelects();
                } else {
                    alert('Failed to save category: ' + data.message);
                }
            } catch (error) {
                console.error('Error saving category:', error);
                alert('Error saving category');
            }
        });
    }

    // Auto-generate slug from category name
    const categoryName = document.getElementById('category-name');
    const categorySlug = document.getElementById('category-slug');
    if (categoryName && categorySlug) {
        categoryName.addEventListener('input', function() {
            const slug = this.value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            categorySlug.value = slug;
        });
    }

    // Search functionality
    setupSearch('gemstone-search', loadGemstones);
    setupSearch('order-search', loadOrders);
    setupSearch('user-search', loadUsers);

    // Filter functionality
    setupFilter('gemstone-category-filter', loadGemstones);
    setupFilter('order-status-filter', loadOrders);
}

// Setup search
function setupSearch(inputId, loadFunction) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function() {
            // Implement search logic
            loadFunction();
        });
    }
}

// Setup filter
function setupFilter(selectId, loadFunction) {
    const select = document.getElementById(selectId);
    if (select) {
        select.addEventListener('change', function() {
            // Implement filter logic
            loadFunction();
        });
    }
}

// Admin logout
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('jpgems_admin');
        window.location.href = '../index.html';
    }
}

// View functions
function viewOrder(id) {
    alert('View order details for ID: ' + id);
}

function viewUser(id) {
    alert('View user details for ID: ' + id);
}

function viewMessage(id) {
    alert('View message details for ID: ' + id);
}

// Update functions
function updateOrderStatus(id) {
    const newStatus = prompt('Enter new status (pending/confirmed/shipped/delivered/cancelled):');
    if (newStatus) {
        alert('Update order status to: ' + newStatus);
        // Implement update logic
    }
}

function toggleUserStatus(id, currentStatus) {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
        alert(`User ${action}d`);
        // Implement toggle logic
    }
}

function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        alert('Message deleted');
        // Implement delete logic
    }
}

function approveFeedback(id) {
    if (confirm('Approve this feedback?')) {
        alert('Feedback approved');
        // Implement approve logic
    }
}

function deleteFeedback(id) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        alert('Feedback deleted');
        // Implement delete logic
    }
}
