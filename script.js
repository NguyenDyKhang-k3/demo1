// Global variables
let drinkingRecords = JSON.parse(localStorage.getItem('drinkingRecords')) || [];
let confirmationAttempts = 0;

// DOM elements
const form = document.getElementById('drinkingForm');
const drinkingList = document.getElementById('drinkingList');
const confirmationModal = document.getElementById('confirmationModal');
const detailModal = document.getElementById('detailModal');
const stayHomeBtn = document.getElementById('stayHomeBtn');
const confirmBtn = document.getElementById('confirmBtn');
const heartAnimation = document.getElementById('heartAnimation');
const notification = document.getElementById('notification');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderDrinkingList();
    addEventListeners();
    showWelcomeAnimation();
});

// Add event listeners
function addEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    stayHomeBtn.addEventListener('click', handleStayHome);
    confirmBtn.addEventListener('click', handleConfirm);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === confirmationModal) {
            closeConfirmationModal();
        }
        if (event.target === detailModal) {
            closeDetailModal();
        }
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const drinkingData = {
        id: Date.now(),
        drinkingWith: formData.get('drinkingWith'),
        guesser: formData.get('guesser'),
        relationship: formData.get('relationship'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        reason: formData.get('reason'),
        drinkType: formData.get('drinkType'),
        amount: formData.get('amount'),
        commitment: formData.get('commitment'),
        createdAt: new Date().toLocaleString('vi-VN')
    };
    
    // Show confirmation modal
    showConfirmationModal(drinkingData);
}

// Show confirmation modal
function showConfirmationModal(drinkingData) {
    confirmationModal.style.display = 'block';
    confirmationAttempts = 0;
    
    // Store the data temporarily
    confirmationModal.drinkingData = drinkingData;
    
    // Reset button states
    stayHomeBtn.className = 'btn-stay-home';
    confirmBtn.className = 'btn-confirm';
    
    // Add floating hearts effect
    createFloatingHearts();
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
    confirmationAttempts = 0;
}

// Handle stay home button
function handleStayHome() {
    closeConfirmationModal();
    showHeartAnimation();
    showNotification('💕 Em yêu là số 1! Cảm ơn anh đã chọn ở nhà với em! 💕', 'success');
}

// Handle confirm button
function handleConfirm() {
    confirmationAttempts++;
    
    if (confirmationAttempts <= 3) {
        // Update button states based on attempt
        updateButtonStates();
        
        if (confirmationAttempts === 3) {
            // Show cruel message and broken heart
            setTimeout(() => {
                showCruelMessage();
            }, 500);
        }
    } else {
        // After 3 attempts, actually save the data
        saveDrinkingRecord(confirmationModal.drinkingData);
        closeConfirmationModal();
        showNotification('😢 Đã lưu lịch nhậu... Người yêu sẽ buồn lắm đấy! 😢', 'warning');
    }
}

// Update button states based on confirmation attempts
function updateButtonStates() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.className = `modal-content attempt-${confirmationAttempts}`;
    
    if (confirmationAttempts === 1) {
        showNotification('💔 Lần 1: Anh thật sự muốn đi nhậu à? 💔', 'warning');
    } else if (confirmationAttempts === 2) {
        showNotification('💔 Lần 2: Em sẽ rất buồn nếu anh đi... 💔', 'warning');
    } else if (confirmationAttempts === 3) {
        showNotification('💔 Lần 3: Anh thật tàn ác! 💔', 'error');
    }
}

// Show cruel message
function showCruelMessage() {
    const modalBody = document.querySelector('.modal-body');
    const cruelDiv = document.createElement('div');
    cruelDiv.innerHTML = `
        <div class="cruel-text">TÀN ÁC!</div>
        <div class="broken-heart">💔</div>
        <p>Trái tim em đã tan vỡ...</p>
    `;
    modalBody.appendChild(cruelDiv);
    
    // Remove the cruel message after 3 seconds
    setTimeout(() => {
        cruelDiv.remove();
    }, 3000);
}

// Show heart animation
function showHeartAnimation() {
    heartAnimation.style.display = 'block';
    
    setTimeout(() => {
        heartAnimation.style.display = 'none';
    }, 3000);
}

// Save drinking record
function saveDrinkingRecord(data) {
    drinkingRecords.push(data);
    localStorage.setItem('drinkingRecords', JSON.stringify(drinkingRecords));
    renderDrinkingList();
    form.reset();
}

// Render drinking list
function renderDrinkingList() {
    if (drinkingRecords.length === 0) {
        drinkingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <p>Chưa có lịch nhậu nào được đăng ký</p>
            </div>
        `;
        return;
    }
    
    drinkingList.innerHTML = drinkingRecords.map(record => `
        <div class="drinking-item" onclick="showDetail(${record.id})">
            <h3>🍻 ${record.drinkingWith}</h3>
            <p><strong>Người đưa đoán:</strong> ${record.guesser}</p>
            <p><strong>Thời gian:</strong> ${record.startTime} - ${record.endTime}</p>
            <p><strong>Loại đồ uống:</strong> ${record.drinkType}</p>
            <p><strong>Ngày tạo:</strong> ${record.createdAt}</p>
        </div>
    `).join('');
}

// Show detail modal
function showDetail(id) {
    const record = drinkingRecords.find(r => r.id === id);
    if (!record) return;
    
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-item">
            <h4>🍻 Thông tin chi tiết</h4>
            <p><strong>Nhậu với ai:</strong> ${record.drinkingWith}</p>
            <p><strong>Người đưa đoán:</strong> ${record.guesser}</p>
            <p><strong>Quan hệ:</strong> ${record.relationship}</p>
            <p><strong>Giờ đi:</strong> ${record.startTime}</p>
            <p><strong>Giờ về:</strong> ${record.endTime}</p>
            <p><strong>Lý do nhậu:</strong> ${record.reason}</p>
            <p><strong>Loại đồ uống:</strong> ${record.drinkType}</p>
            <p><strong>Số lượng:</strong> ${record.amount}</p>
            <p><strong>Cam kết:</strong> ${record.commitment}</p>
            <p><strong>Ngày tạo:</strong> ${record.createdAt}</p>
        </div>
    `;
    
    detailModal.style.display = 'block';
}

// Close detail modal
function closeDetailModal() {
    detailModal.style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// Create floating hearts effect
function createFloatingHearts() {
    const modal = document.querySelector('.modal-content');
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💕';
            heart.style.position = 'absolute';
            heart.style.fontSize = '1.5rem';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.animation = 'float 3s ease-in-out infinite';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1001';
            
            modal.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 200);
    }
}

// Show welcome animation
function showWelcomeAnimation() {
    // Create welcome message
    const welcomeDiv = document.createElement('div');
    welcomeDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #e91e63, #ff6b9d);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            z-index: 2000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: slideInDown 0.8s ease;
        ">
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; margin-bottom: 15px;">
                💕 Chào mừng đến với trang web đặc biệt 💕
            </h2>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">
                Dành cho Võ Thị Ngọc Muội
            </p>
            <p style="font-size: 1rem; opacity: 0.9;">
                Hãy điền form để đăng ký lịch nhậu nhé! 😊
            </p>
        </div>
    `;
    
    document.body.appendChild(welcomeDiv);
    
    // Remove welcome message after 3 seconds
    setTimeout(() => {
        welcomeDiv.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            welcomeDiv.remove();
        }, 500);
    }, 3000);
}

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    // Create floating hearts on mouse move
    if (Math.random() < 0.02) {
        createFloatingHeart(e.clientX, e.clientY);
    }
});

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '1rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'float 2s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeConfirmationModal();
        closeDetailModal();
    }
    
    // Enter to submit form (if not in modal)
    if (e.key === 'Enter' && !confirmationModal.style.display === 'block') {
        if (e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Add some romantic background effects
function createRomanticEffects() {
    // Create floating particles
    setInterval(() => {
        if (Math.random() < 0.3) {
            createFloatingParticle();
        }
    }, 2000);
}

function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.innerHTML = ['💕', '💖', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
    particle.style.position = 'fixed';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = '100vh';
    particle.style.fontSize = '1.5rem';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.animation = 'floatUp 4s linear forwards';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 4000);
}

// Add CSS for floatUp animation
const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatUpStyle);

// Start romantic effects
createRomanticEffects();
