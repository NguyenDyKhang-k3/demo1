// Global variables
let allRecords = [];
let confirmationAttempts = 0;
let currentTab = 'drinking';
let currentAdminTab = 'stats';

// JSONBin configuration
const JSONBIN_API_KEY = '$2a$10$Ctif05.NZ8KUOWPehcgSQuBr96xl1TFjwuPsWRVpOdrxPTP6aCM7C'; // Thay thế bằng API key của bạn
const JSONBIN_BIN_ID = '68c54d47d0ea881f407c8378'; // Thay thế bằng Bin ID của bạn
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;
const JSONBIN_UPDATE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// DOM elements
const drinkingList = document.getElementById('drinkingList');
const confirmationModal = document.getElementById('confirmationModal');
const detailModal = document.getElementById('detailModal');
const gameModal = document.getElementById('gameModal');
const adminModal = document.getElementById('adminModal');
const stayHomeBtn = document.getElementById('stayHomeBtn');
const confirmBtn = document.getElementById('confirmBtn');
const heartAnimation = document.getElementById('heartAnimation');
const notification = document.getElementById('notification');

// Initialize the app
document.addEventListener('DOMContentLoaded', async function() {
    await initializeJSONBin();
    await loadDrinkingRecords();
    addEventListeners();
    showWelcomeAnimation();
});

// Add event listeners
function addEventListeners() {
    // Add form event listeners for all forms
    const forms = document.querySelectorAll('.permission-form');
    forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
    });
    
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
        if (event.target === gameModal) {
            closeGameModal();
        }
        if (event.target === adminModal) {
            closeAdminModal();
        }
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const formType = form.dataset.type;
    
    let recordData = {
        id: Date.now(),
        type: formType,
        createdAt: new Date().toLocaleString('vi-VN')
    };
    
    // Collect form data based on type
    if (formType === 'drinking') {
        recordData = {
            ...recordData,
        drinkingWith: formData.get('drinkingWith'),
        guesser: formData.get('guesser'),
        relationship: formData.get('relationship'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        reason: formData.get('reason'),
        drinkType: formData.get('drinkType'),
        amount: formData.get('amount'),
            commitment: formData.get('commitment')
        };
    } else if (formType === 'eating') {
        recordData = {
            ...recordData,
            eatingWith: formData.get('eatingWith'),
            eatingPlace: formData.get('eatingPlace'),
            eatingReason: formData.get('eatingReason'),
            eatingStartTime: formData.get('eatingStartTime'),
            eatingEndTime: formData.get('eatingEndTime'),
            eatingCommitment: formData.get('eatingCommitment')
        };
    } else if (formType === 'shopping') {
        recordData = {
            ...recordData,
            shoppingWith: formData.get('shoppingWith'),
            shoppingPlace: formData.get('shoppingPlace'),
            shoppingItems: formData.get('shoppingItems'),
            shoppingBudget: parseInt(formData.get('shoppingBudget')) || 0,
            shoppingStartTime: formData.get('shoppingStartTime'),
            shoppingEndTime: formData.get('shoppingEndTime')
        };
    } else if (formType === 'travel') {
        recordData = {
            ...recordData,
            travelDestination: formData.get('travelDestination'),
            travelWith: formData.get('travelWith'),
            travelStartDate: formData.get('travelStartDate'),
            travelEndDate: formData.get('travelEndDate'),
            travelReason: formData.get('travelReason'),
            travelAccommodation: formData.get('travelAccommodation')
        };
    } else if (formType === 'hanging') {
        recordData = {
            ...recordData,
            hangingWith: formData.get('hangingWith'),
            hangingActivity: formData.get('hangingActivity'),
            hangingPlace: formData.get('hangingPlace'),
            hangingStartTime: formData.get('hangingStartTime'),
            hangingEndTime: formData.get('hangingEndTime'),
            hangingCommitment: formData.get('hangingCommitment')
        };
    } else if (formType === 'work') {
        recordData = {
            ...recordData,
            workType: formData.get('workType'),
            workLocation: formData.get('workLocation'),
            workReason: formData.get('workReason'),
            workStartTime: formData.get('workStartTime'),
            workEndTime: formData.get('workEndTime'),
            workCommitment: formData.get('workCommitment')
        };
    } else if (formType === 'study') {
        recordData = {
            ...recordData,
            studyType: formData.get('studyType'),
            studySubject: formData.get('studySubject'),
            studyLocation: formData.get('studyLocation'),
            studyWith: formData.get('studyWith'),
            studyStartTime: formData.get('studyStartTime'),
            studyEndTime: formData.get('studyEndTime'),
            studyReason: formData.get('studyReason')
        };
    } else if (formType === 'sports') {
        recordData = {
            ...recordData,
            sportType: formData.get('sportType'),
            sportLocation: formData.get('sportLocation'),
            sportWith: formData.get('sportWith'),
            sportStartTime: formData.get('sportStartTime'),
            sportEndTime: formData.get('sportEndTime'),
            sportIntensity: formData.get('sportIntensity'),
            sportCommitment: formData.get('sportCommitment')
        };
    } else if (formType === 'health') {
        recordData = {
            ...recordData,
            healthType: formData.get('healthType'),
            healthLocation: formData.get('healthLocation'),
            healthDoctor: formData.get('healthDoctor'),
            healthSymptoms: formData.get('healthSymptoms'),
            healthStartTime: formData.get('healthStartTime'),
            healthEndTime: formData.get('healthEndTime'),
            healthUrgency: formData.get('healthUrgency')
        };
    } else if (formType === 'family') {
        recordData = {
            ...recordData,
            familyType: formData.get('familyType'),
            familyWith: formData.get('familyWith'),
            familyLocation: formData.get('familyLocation'),
            familyStartTime: formData.get('familyStartTime'),
            familyEndTime: formData.get('familyEndTime'),
            familyReason: formData.get('familyReason')
        };
    } else if (formType === 'other') {
        recordData = {
            ...recordData,
            otherType: formData.get('otherType'),
            otherWith: formData.get('otherWith'),
            otherLocation: formData.get('otherLocation'),
            otherStartTime: formData.get('otherStartTime'),
            otherEndTime: formData.get('otherEndTime'),
            otherDescription: formData.get('otherDescription')
        };
    }
    
    // Show confirmation modal
    showConfirmationModal(recordData);
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
    // Save the stay home decision
    const stayHomeData = {
        id: Date.now(),
        type: 'stay_home_decision',
        action: 'stay_home',
        originalData: confirmationModal.drinkingData,
        timestamp: new Date().toLocaleString('vi-VN')
    };
    
    // Save stay home decision to records
    allRecords.push(stayHomeData);
    saveAllRecords();
    
    closeConfirmationModal();
    showHeartAnimation();
    showNotification('💕 Em yêu là số 1! Cảm ơn em đã chọn ở nhà với anh! 💕', 'success');
}

// Handle confirm button
function handleConfirm() {
    confirmationAttempts++;
    
    // Always save the confirmation attempt
    const confirmationData = {
        id: Date.now(),
        type: 'confirmation_attempt',
        attempt: confirmationAttempts,
        action: 'confirm',
        originalData: confirmationModal.drinkingData,
        timestamp: new Date().toLocaleString('vi-VN')
    };
    
    // Save confirmation attempt to records
    allRecords.push(confirmationData);
    saveAllRecords();
    
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
        // After 3 attempts, actually save the original data
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
        showNotification('💔 Lần 1: Em thật sự muốn đi nhậu à? 💔', 'warning');
    } else if (confirmationAttempts === 2) {
        showNotification('💔 Lần 2: Anh sẽ rất buồn nếu em đi... 💔', 'warning');
    } else if (confirmationAttempts === 3) {
        showNotification('💔 Lần 3: Em thật tàn ác! 💔', 'error');
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

// Load all records from JSONBin
async function loadDrinkingRecords() {
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            // Ensure allRecords is always an array
            allRecords = Array.isArray(result.record) ? result.record : [];
            console.log('Loaded from JSONBin:', allRecords);
        } else {
            // Fallback to localStorage if JSONBin fails
            const localData = localStorage.getItem('allRecords');
            allRecords = localData ? JSON.parse(localData) : [];
            console.log('Loaded from localStorage:', allRecords);
        }
    } catch (error) {
        console.log('Error loading data, using localStorage:', error);
        const localData = localStorage.getItem('allRecords');
        allRecords = localData ? JSON.parse(localData) : [];
    }
    
    // Ensure allRecords is always an array before rendering
    if (!Array.isArray(allRecords)) {
        allRecords = [];
    }
    
    renderDrinkingList();
}

// Initialize JSONBin with empty array if needed
async function initializeJSONBin() {
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        if (!response.ok && response.status === 404) {
            // Bin doesn't exist, create it with empty array
            await fetch(JSONBIN_UPDATE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify([])
            });
            console.log('Created new JSONBin with empty array');
        }
    } catch (error) {
        console.log('Error initializing JSONBin:', error);
    }
}

// Save record to JSONBin
async function saveDrinkingRecord(data) {
    allRecords.push(data);
    
    try {
        const response = await fetch(JSONBIN_UPDATE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(allRecords)
        });
        
        if (response.ok) {
            console.log('Dữ liệu đã được lưu vào JSONBin');
            // Show success notification
            showNotification('✅ Đã lưu thành công! Dữ liệu đã được đồng bộ.', 'success');
        } else {
            throw new Error('Lỗi khi lưu vào JSONBin');
        }
    } catch (error) {
        console.log('Lưu vào localStorage làm backup');
        localStorage.setItem('allRecords', JSON.stringify(allRecords));
        showNotification('⚠️ Đã lưu vào bộ nhớ cục bộ. Kiểm tra kết nối mạng.', 'warning');
    }
    
    // Always update UI immediately
    renderDrinkingList();
    updateAdminStats();
    
    // Reset the current form
    const currentForm = document.querySelector(`.permission-form.active`);
    if (currentForm) {
        currentForm.reset();
    }
}

// Render drinking list
function renderDrinkingList() {
    // Ensure allRecords is an array
    if (!Array.isArray(allRecords)) {
        console.error('allRecords is not an array:', allRecords);
        allRecords = [];
    }
    
    if (allRecords.length === 0) {
        drinkingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <p>Chưa có đơn xin phép nào được đăng ký</p>
            </div>
        `;
        return;
    }
    
    drinkingList.innerHTML = allRecords.map(record => {
        const icons = {
            drinking: '🍻',
            eating: '🍽️',
            shopping: '🛍️',
            travel: '✈️',
            hanging: '🎮',
            work: '💼',
            study: '🎓',
            sports: '🏃‍♂️',
            health: '🏥',
            family: '👨‍👩‍👧‍👦',
            other: '📝',
            confirmation_attempt: '💔',
            stay_home_decision: '💕'
        };
        
        const icon = icons[record.type] || '📋';
        
        let title = 'Hoạt động';
        if (record.type === 'confirmation_attempt') {
            title = `Lần xác nhận thứ ${record.attempt}`;
        } else if (record.type === 'stay_home_decision') {
            title = 'Quyết định ở nhà';
        } else {
            title = record.type === 'drinking' ? record.drinkingWith : 
                   record.type === 'eating' ? record.eatingWith :
                   record.type === 'shopping' ? record.shoppingWith :
                   record.type === 'travel' ? record.travelDestination :
                   record.type === 'hanging' ? record.hangingWith :
                   record.type === 'work' ? record.workType :
                   record.type === 'study' ? record.studySubject :
                   record.type === 'sports' ? record.sportType :
                   record.type === 'health' ? record.healthType :
                   record.type === 'family' ? record.familyType :
                   record.type === 'other' ? record.otherType : 'Hoạt động';
        }
        
        return `
            <div class="drinking-item" onclick="showDetail(${record.id})">
                <h3>${icon} ${title}</h3>
                <p><strong>Loại:</strong> ${getTypeDisplayName(record.type)}</p>
                ${record.type === 'confirmation_attempt' || record.type === 'stay_home_decision' ? 
                    `<p><strong>Hành động:</strong> ${record.action === 'confirm' ? 'Xác nhận' : 'Ở nhà'}</p>` :
                    `<p><strong>Thời gian:</strong> ${record.startTime || record.travelStartDate || record.studyStartTime || record.sportStartTime || record.healthStartTime || record.familyStartTime || record.otherStartTime} - ${record.endTime || record.travelEndDate || record.studyEndTime || record.sportEndTime || record.healthEndTime || record.familyEndTime || record.otherEndTime}</p>`
                }
                <p><strong>Ngày tạo:</strong> ${record.createdAt || record.timestamp}</p>
            </div>
        `;
    }).join('');
}

// Get display name for record type
function getTypeDisplayName(type) {
    const names = {
        drinking: 'Đi nhậu',
        eating: 'Đi ăn',
        shopping: 'Mua sắm',
        travel: 'Du lịch',
        hanging: 'Đi chơi',
        work: 'Công việc',
        study: 'Học tập',
        sports: 'Thể thao',
        health: 'Sức khỏe',
        family: 'Gia đình',
        other: 'Khác',
        confirmation_attempt: 'Lần xác nhận',
        stay_home_decision: 'Quyết định ở nhà'
    };
    return names[type] || type;
}

// Tab switching functions
function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Update active form
    document.querySelectorAll('.permission-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tabName}Form`).classList.add('active');
    
    currentTab = tabName;
}

// Show detail modal
function showDetail(id) {
    const record = allRecords.find(r => r.id === id);
    if (!record) return;
    
    const detailContent = document.getElementById('detailContent');
    
    let detailHTML = `
        <div class="detail-item">
            <h4>📋 Thông tin chi tiết - ${getTypeDisplayName(record.type)}</h4>
    `;
    
    // Generate detail content based on record type
    if (record.type === 'drinking') {
        detailHTML += `
            <p><strong>Nhậu với ai:</strong> ${record.drinkingWith}</p>
            <p><strong>Người đưa đoán:</strong> ${record.guesser}</p>
            <p><strong>Quan hệ:</strong> ${record.relationship}</p>
            <p><strong>Giờ đi:</strong> ${record.startTime}</p>
            <p><strong>Giờ về:</strong> ${record.endTime}</p>
            <p><strong>Lý do nhậu:</strong> ${record.reason}</p>
            <p><strong>Loại đồ uống:</strong> ${record.drinkType}</p>
            <p><strong>Số lượng:</strong> ${record.amount}</p>
            <p><strong>Cam kết:</strong> ${record.commitment}</p>
        `;
    } else if (record.type === 'eating') {
        detailHTML += `
            <p><strong>Ăn với ai:</strong> ${record.eatingWith}</p>
            <p><strong>Địa điểm:</strong> ${record.eatingPlace}</p>
            <p><strong>Lý do:</strong> ${record.eatingReason}</p>
            <p><strong>Giờ đi:</strong> ${record.eatingStartTime}</p>
            <p><strong>Giờ về:</strong> ${record.eatingEndTime}</p>
            <p><strong>Cam kết:</strong> ${record.eatingCommitment}</p>
        `;
    } else if (record.type === 'shopping') {
        detailHTML += `
            <p><strong>Mua sắm với ai:</strong> ${record.shoppingWith}</p>
            <p><strong>Địa điểm:</strong> ${record.shoppingPlace}</p>
            <p><strong>Mục đích:</strong> ${record.shoppingItems}</p>
            <p><strong>Ngân sách:</strong> ${record.shoppingBudget ? record.shoppingBudget.toLocaleString() + ' VNĐ' : 'Không xác định'}</p>
            <p><strong>Giờ đi:</strong> ${record.shoppingStartTime}</p>
            <p><strong>Giờ về:</strong> ${record.shoppingEndTime}</p>
        `;
    } else if (record.type === 'travel') {
        detailHTML += `
            <p><strong>Địa điểm:</strong> ${record.travelDestination}</p>
            <p><strong>Đi với ai:</strong> ${record.travelWith}</p>
            <p><strong>Ngày đi:</strong> ${record.travelStartDate}</p>
            <p><strong>Ngày về:</strong> ${record.travelEndDate}</p>
            <p><strong>Lý do:</strong> ${record.travelReason}</p>
            <p><strong>Nơi ở:</strong> ${record.travelAccommodation || 'Chưa xác định'}</p>
        `;
    } else if (record.type === 'hanging') {
        detailHTML += `
            <p><strong>Chơi với ai:</strong> ${record.hangingWith}</p>
            <p><strong>Hoạt động:</strong> ${record.hangingActivity}</p>
            <p><strong>Địa điểm:</strong> ${record.hangingPlace}</p>
            <p><strong>Giờ đi:</strong> ${record.hangingStartTime}</p>
            <p><strong>Giờ về:</strong> ${record.hangingEndTime}</p>
            <p><strong>Cam kết:</strong> ${record.hangingCommitment}</p>
        `;
    } else if (record.type === 'work') {
        detailHTML += `
            <p><strong>Loại công việc:</strong> ${record.workType}</p>
            <p><strong>Địa điểm:</strong> ${record.workLocation}</p>
            <p><strong>Lý do:</strong> ${record.workReason}</p>
            <p><strong>Giờ bắt đầu:</strong> ${record.workStartTime}</p>
            <p><strong>Giờ kết thúc:</strong> ${record.workEndTime}</p>
            <p><strong>Cam kết:</strong> ${record.workCommitment}</p>
        `;
    } else if (record.type === 'study') {
        detailHTML += `
            <p><strong>Loại học tập:</strong> ${record.studyType}</p>
            <p><strong>Môn học:</strong> ${record.studySubject}</p>
            <p><strong>Địa điểm:</strong> ${record.studyLocation}</p>
            <p><strong>Học với ai:</strong> ${record.studyWith}</p>
            <p><strong>Giờ bắt đầu:</strong> ${record.studyStartTime}</p>
            <p><strong>Giờ kết thúc:</strong> ${record.studyEndTime}</p>
            <p><strong>Lý do:</strong> ${record.studyReason}</p>
        `;
    } else if (record.type === 'sports') {
        detailHTML += `
            <p><strong>Loại thể thao:</strong> ${record.sportType}</p>
            <p><strong>Địa điểm:</strong> ${record.sportLocation}</p>
            <p><strong>Chơi với ai:</strong> ${record.sportWith}</p>
            <p><strong>Giờ bắt đầu:</strong> ${record.sportStartTime}</p>
            <p><strong>Giờ kết thúc:</strong> ${record.sportEndTime}</p>
            <p><strong>Cường độ:</strong> ${record.sportIntensity}</p>
            <p><strong>Cam kết:</strong> ${record.sportCommitment}</p>
        `;
    } else if (record.type === 'health') {
        detailHTML += `
            <p><strong>Loại sức khỏe:</strong> ${record.healthType}</p>
            <p><strong>Địa điểm:</strong> ${record.healthLocation}</p>
            <p><strong>Bác sĩ:</strong> ${record.healthDoctor}</p>
            <p><strong>Triệu chứng:</strong> ${record.healthSymptoms}</p>
            <p><strong>Giờ bắt đầu:</strong> ${record.healthStartTime}</p>
            <p><strong>Giờ kết thúc:</strong> ${record.healthEndTime}</p>
            <p><strong>Mức độ khẩn cấp:</strong> ${record.healthUrgency}</p>
        `;
    } else if (record.type === 'family') {
        detailHTML += `
            <p><strong>Loại hoạt động gia đình:</strong> ${record.familyType}</p>
            <p><strong>Với ai:</strong> ${record.familyWith}</p>
            <p><strong>Địa điểm:</strong> ${record.familyLocation}</p>
            <p><strong>Giờ bắt đầu:</strong> ${record.familyStartTime}</p>
            <p><strong>Giờ kết thúc:</strong> ${record.familyEndTime}</p>
            <p><strong>Lý do:</strong> ${record.familyReason}</p>
        `;
    } else if (record.type === 'other') {
        detailHTML += `
            <p><strong>Loại hoạt động:</strong> ${record.otherType}</p>
            <p><strong>Với ai:</strong> ${record.otherWith}</p>
            <p><strong>Địa điểm:</strong> ${record.otherLocation}</p>
            <p><strong>Giờ bắt đầu:</strong> ${record.otherStartTime}</p>
            <p><strong>Giờ kết thúc:</strong> ${record.otherEndTime}</p>
            <p><strong>Mô tả:</strong> ${record.otherDescription}</p>
        `;
    } else if (record.type === 'confirmation_attempt') {
        detailHTML += `
            <p><strong>Lần xác nhận:</strong> ${record.attempt}</p>
            <p><strong>Hành động:</strong> Xác nhận đi nhậu</p>
            <p><strong>Dữ liệu gốc:</strong> ${record.originalData ? JSON.stringify(record.originalData, null, 2) : 'Không có'}</p>
        `;
    } else if (record.type === 'stay_home_decision') {
        detailHTML += `
            <p><strong>Hành động:</strong> Quyết định ở nhà</p>
            <p><strong>Dữ liệu gốc:</strong> ${record.originalData ? JSON.stringify(record.originalData, null, 2) : 'Không có'}</p>
        `;
    }
    
    detailHTML += `
            <p><strong>Ngày tạo:</strong> ${record.createdAt || record.timestamp}</p>
        </div>
    `;
    
    detailContent.innerHTML = detailHTML;
    
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

// Refresh data function
async function refreshData() {
    const refreshBtn = document.getElementById('refreshBtn');
    const icon = refreshBtn.querySelector('i');
    
    // Show loading animation
    icon.style.animation = 'spin 1s linear infinite';
    refreshBtn.disabled = true;
    
    try {
        await loadDrinkingRecords();
        showNotification('🔄 Dữ liệu đã được cập nhật!', 'success');
    } catch (error) {
        showNotification('❌ Lỗi khi tải dữ liệu', 'error');
    } finally {
        // Reset button
        icon.style.animation = '';
        refreshBtn.disabled = false;
    }
}

// Auto refresh every 30 seconds
setInterval(refreshData, 30000);

// Game functions
function openGame(gameType) {
    const gameModal = document.getElementById('gameModal');
    const gameTitle = document.getElementById('gameTitle');
    const gameContent = document.getElementById('gameContent');
    
    gameModal.style.display = 'block';
    
    switch(gameType) {
        case 'love-test':
            gameTitle.textContent = '💕 Test Tình Yêu 💕';
            gameContent.innerHTML = `
                <div class="love-test">
                    <h4>Kiểm tra mức độ yêu thương của bạn!</h4>
                    <div class="test-question">
                        <p>Bạn có yêu Võ Thị Ngọc Muội không?</p>
                        <div class="test-buttons">
                            <button onclick="loveTestResult(true)" class="love-yes">💖 Có, rất yêu!</button>
                            <button onclick="loveTestResult(false)" class="love-no">💔 Không</button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'memory-game':
            gameTitle.textContent = '🧠 Trò Chơi Trí Nhớ 🧠';
            gameContent.innerHTML = `
                <div class="memory-game">
                    <h4>Ghép đôi các hình ảnh!</h4>
                    <div class="memory-grid">
                        <div class="memory-card" onclick="flipCard(0)">?</div>
                        <div class="memory-card" onclick="flipCard(1)">?</div>
                        <div class="memory-card" onclick="flipCard(2)">?</div>
                        <div class="memory-card" onclick="flipCard(3)">?</div>
                    </div>
                    <p>Score: <span id="memoryScore">0</span></p>
                </div>
            `;
            break;
            
        case 'love-letter':
            gameTitle.textContent = '💌 Viết Thư Tình 💌';
            gameContent.innerHTML = `
                <div class="love-letter">
                    <h4>Thư tình ngẫu nhiên cho Võ Thị Ngọc Muội:</h4>
                    <div class="letter-content">
                        <p id="letterText">Đang tạo thư tình...</p>
                        <button onclick="generateLoveLetter()" class="generate-btn">Tạo thư mới</button>
                    </div>
                </div>
            `;
            generateLoveLetter();
            break;
            
        case 'fortune-teller':
            gameTitle.textContent = '🔮 Bói Tình Duyên 🔮';
            gameContent.innerHTML = `
                <div class="fortune-teller">
                    <h4>Xem vận may tình cảm của bạn!</h4>
                    <div class="fortune-content">
                        <div class="crystal-ball" onclick="tellFortune()">
                            <div class="ball">🔮</div>
                            <p>Nhấn vào để xem bói</p>
                        </div>
                        <div id="fortuneResult"></div>
                    </div>
                </div>
            `;
            break;
            
        case 'love-quiz':
            gameTitle.textContent = '🧩 Quiz Tình Yêu 🧩';
            gameContent.innerHTML = `
                <div class="love-quiz">
                    <h4>Kiểm tra hiểu biết về tình yêu!</h4>
                    <div id="quizContent">
                        <div class="quiz-question">
                            <p id="questionText">Câu hỏi 1: Tình yêu đích thực là gì?</p>
                            <div class="quiz-options">
                                <button onclick="answerQuiz(1)" class="quiz-option">A. Chỉ là cảm xúc nhất thời</button>
                                <button onclick="answerQuiz(2)" class="quiz-option">B. Sự hy sinh và quan tâm lẫn nhau</button>
                                <button onclick="answerQuiz(3)" class="quiz-option">C. Sự hấp dẫn về thể xác</button>
                                <button onclick="answerQuiz(4)" class="quiz-option">D. Chỉ là sự tương hợp</button>
                            </div>
                        </div>
                        <div class="quiz-score">
                            <p>Điểm: <span id="quizScore">0</span>/5</p>
                        </div>
                    </div>
                </div>
            `;
            initQuiz();
            break;
            
        case 'heart-calculator':
            gameTitle.textContent = '💯 Máy Tính Tình Yêu 💯';
            gameContent.innerHTML = `
                <div class="heart-calculator">
                    <h4>Tính độ tương hợp tình yêu!</h4>
                    <div class="calculator-form">
                        <div class="form-group">
                            <label>Tên của bạn:</label>
                            <input type="text" id="yourName" placeholder="Nhập tên của bạn">
                        </div>
                        <div class="form-group">
                            <label>Tên người yêu:</label>
                            <input type="text" id="loverName" placeholder="Nhập tên người yêu">
                        </div>
                        <button onclick="calculateLove()" class="calculate-btn">Tính Tình Yêu</button>
                    </div>
                    <div id="loveResult" class="love-result"></div>
                </div>
            `;
            break;
            
        case 'love-story':
            gameTitle.textContent = '📖 Câu Chuyện Tình Yêu 📖';
            gameContent.innerHTML = `
                <div class="love-story">
                    <h4>Tạo câu chuyện tình yêu ngẫu nhiên!</h4>
                    <div class="story-content">
                        <p id="storyText">Đang tạo câu chuyện...</p>
                        <button onclick="generateStory()" class="generate-story-btn">Tạo câu chuyện mới</button>
                    </div>
                </div>
            `;
            generateStory();
            break;
            
        case 'couple-challenge':
            gameTitle.textContent = '🏆 Thử Thách Cặp Đôi 🏆';
            gameContent.innerHTML = `
                <div class="couple-challenge">
                    <h4>Thử thách tình yêu dành cho cặp đôi!</h4>
                    <div class="challenge-content">
                        <div class="challenge-card" onclick="getChallenge()">
                            <div class="challenge-icon">💕</div>
                            <p>Nhấn để nhận thử thách</p>
                        </div>
                        <div id="challengeResult" class="challenge-result"></div>
                    </div>
                </div>
            `;
            break;
            
        case 'love-music':
            gameTitle.textContent = '🎵 Nhạc Tình Yêu 🎵';
            gameContent.innerHTML = `
                <div class="love-music">
                    <h4>Gợi ý bài hát lãng mạn!</h4>
                    <div class="music-content">
                        <div class="music-card">
                            <div class="music-info">
                                <h5 id="songTitle">Đang tìm bài hát...</h5>
                                <p id="songArtist">Nghệ sĩ</p>
                            </div>
                            <button onclick="getLoveSong()" class="music-btn">🎵 Bài hát mới</button>
                        </div>
                    </div>
                </div>
            `;
            getLoveSong();
            break;
            
        case 'date-ideas':
            gameTitle.textContent = '💡 Ý Tưởng Hẹn Hò 💡';
            gameContent.innerHTML = `
                <div class="date-ideas">
                    <h4>Gợi ý hoạt động hẹn hò lãng mạn!</h4>
                    <div class="ideas-content">
                        <div class="idea-card">
                            <h5 id="ideaTitle">Đang tìm ý tưởng...</h5>
                            <p id="ideaDescription">Mô tả hoạt động</p>
                            <p id="ideaLocation">Địa điểm</p>
                        </div>
                        <button onclick="getDateIdea()" class="idea-btn">💡 Ý tưởng mới</button>
                    </div>
                </div>
            `;
            getDateIdea();
            break;
            
        case 'love-calendar':
            gameTitle.textContent = '📅 Lịch Tình Yêu 📅';
            gameContent.innerHTML = `
                <div class="love-calendar">
                    <h4>Ngày kỷ niệm đặc biệt trong tình yêu!</h4>
                    <div class="calendar-content">
                        <div class="special-dates">
                            <h5>Những ngày đặc biệt:</h5>
                            <ul id="specialDatesList">
                                <li>💕 Ngày Valentine (14/2)</li>
                                <li>🌹 Ngày Phụ nữ Việt Nam (20/10)</li>
                                <li>💝 Ngày Quốc tế Phụ nữ (8/3)</li>
                                <li>💐 Ngày của Mẹ</li>
                                <li>🎂 Ngày sinh nhật đặc biệt</li>
                            </ul>
                        </div>
                        <div class="anniversary-calculator">
                            <h5>Tính ngày kỷ niệm:</h5>
                            <input type="date" id="anniversaryDate" placeholder="Ngày bắt đầu yêu">
                            <button onclick="calculateAnniversary()" class="anniversary-btn">Tính kỷ niệm</button>
                            <div id="anniversaryResult"></div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
}

function closeGameModal() {
    document.getElementById('gameModal').style.display = 'none';
}

function loveTestResult(isLove) {
    const result = isLove ? 
        '💖 Tuyệt vời! Bạn đã vượt qua bài test tình yêu! 💖' : 
        '💔 Thất bại! Bạn cần yêu thương nhiều hơn! 💔';
    
    document.querySelector('.love-test').innerHTML = `
        <h4>Kết quả:</h4>
        <p>${result}</p>
        <button onclick="openGame('love-test')" class="retry-btn">Thử lại</button>
    `;
}

function generateLoveLetter() {
    const letters = [
        "💕 Em yêu ơi, anh muốn nói với em rằng em là tia nắng ấm áp nhất trong cuộc đời anh...",
        "💖 Muội à, mỗi ngày anh thức dậy, điều đầu tiên anh nghĩ đến là em...",
        "💝 Anh yêu em không chỉ vì em là em, mà còn vì cách em làm anh trở thành phiên bản tốt nhất của chính mình...",
        "💗 Em như một ngôi sao sáng trong đêm tối, dẫn lối cho anh đi...",
        "💘 Tình yêu anh dành cho em không có từ ngữ nào có thể diễn tả hết được..."
    ];
    
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('letterText').textContent = randomLetter;
}

function tellFortune() {
    const fortunes = [
        "🌟 Tình yêu của bạn sẽ nở hoa rực rỡ!",
        "💕 Bạn sẽ gặp được may mắn trong tình cảm!",
        "💖 Mối quan hệ hiện tại sẽ phát triển tốt đẹp!",
        "💝 Hãy mở lòng và tin tưởng vào tình yêu!",
        "💗 Thời gian tới sẽ có nhiều điều ngọt ngào chờ đón!"
    ];
    
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    document.getElementById('fortuneResult').innerHTML = `
        <div class="fortune-text">${randomFortune}</div>
        <button onclick="tellFortune()" class="retry-btn">Bói lại</button>
    `;
}

// Admin functions
function openAdmin() {
    document.getElementById('adminModal').style.display = 'block';
    updateAdminStats();
    loadAdminRecords();
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="switchAdminTab('${tabName}')"]`).classList.add('active');
    
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    currentAdminTab = tabName;
    
    if (tabName === 'stats') {
        updateAdminStats();
    } else if (tabName === 'manage') {
        loadAdminRecords();
    }
}

function updateAdminStats() {
    const stats = {
        total: allRecords.length,
        drinking: allRecords.filter(r => r.type === 'drinking').length,
        eating: allRecords.filter(r => r.type === 'eating').length,
        shopping: allRecords.filter(r => r.type === 'shopping').length,
        travel: allRecords.filter(r => r.type === 'travel').length,
        hanging: allRecords.filter(r => r.type === 'hanging').length,
        work: allRecords.filter(r => r.type === 'work').length,
        study: allRecords.filter(r => r.type === 'study').length,
        sports: allRecords.filter(r => r.type === 'sports').length,
        health: allRecords.filter(r => r.type === 'health').length,
        family: allRecords.filter(r => r.type === 'family').length,
        other: allRecords.filter(r => r.type === 'other').length,
        confirmations: allRecords.filter(r => r.type === 'confirmation_attempt').length,
        stayHome: allRecords.filter(r => r.type === 'stay_home_decision').length
    };
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('drinkingCount').textContent = stats.drinking;
    document.getElementById('eatingCount').textContent = stats.eating;
    document.getElementById('shoppingCount').textContent = stats.shopping;
    
    // Add more stats if elements exist
    if (document.getElementById('studyCount')) {
        document.getElementById('studyCount').textContent = stats.study;
    }
    if (document.getElementById('sportsCount')) {
        document.getElementById('sportsCount').textContent = stats.sports;
    }
    if (document.getElementById('confirmationsCount')) {
        document.getElementById('confirmationsCount').textContent = stats.confirmations;
    }
    if (document.getElementById('stayHomeCount')) {
        document.getElementById('stayHomeCount').textContent = stats.stayHome;
    }
}

function loadAdminRecords() {
    const adminRecordList = document.getElementById('adminRecordList');
    
    if (allRecords.length === 0) {
        adminRecordList.innerHTML = '<p>Chưa có đơn xin phép nào.</p>';
        return;
    }
    
    adminRecordList.innerHTML = allRecords.map(record => {
        // Get display title based on record type
        let title = 'Hoạt động';
        if (record.type === 'confirmation_attempt') {
            title = `Lần xác nhận thứ ${record.attempt}`;
        } else if (record.type === 'stay_home_decision') {
            title = 'Quyết định ở nhà';
        } else {
            title = record.type === 'drinking' ? record.drinkingWith : 
                   record.type === 'eating' ? record.eatingWith :
                   record.type === 'shopping' ? record.shoppingWith :
                   record.type === 'travel' ? record.travelDestination :
                   record.type === 'hanging' ? record.hangingWith :
                   record.type === 'work' ? record.workType :
                   record.type === 'study' ? record.studySubject :
                   record.type === 'sports' ? record.sportType :
                   record.type === 'health' ? record.healthType :
                   record.type === 'family' ? record.familyType :
                   record.type === 'other' ? record.otherType : 'Hoạt động';
        }
        
        const icons = {
            drinking: '🍻',
            eating: '🍽️',
            shopping: '🛍️',
            travel: '✈️',
            hanging: '🎮',
            work: '💼',
            study: '🎓',
            sports: '🏃‍♂️',
            health: '🏥',
            family: '👨‍👩‍👧‍👦',
            other: '📝',
            confirmation_attempt: '💔',
            stay_home_decision: '💕'
        };
        
        const icon = icons[record.type] || '📋';
        
        return `
            <div class="admin-record-item">
                <div class="admin-record-info">
                    <h6>${icon} ${title}</h6>
                    <p><strong>Loại:</strong> ${getTypeDisplayName(record.type)}</p>
                    <p><strong>ID:</strong> ${record.id}</p>
                    <p><strong>Thời gian:</strong> ${record.startTime || record.travelStartDate || record.studyStartTime || record.sportStartTime || record.healthStartTime || record.familyStartTime || record.otherStartTime || 'N/A'} - ${record.endTime || record.travelEndDate || record.studyEndTime || record.sportEndTime || record.healthEndTime || record.familyEndTime || record.otherEndTime || 'N/A'}</p>
                    <p><strong>Ngày tạo:</strong> ${record.createdAt || record.timestamp}</p>
                    ${record.type === 'confirmation_attempt' || record.type === 'stay_home_decision' ? 
                        `<p><strong>Hành động:</strong> ${record.action === 'confirm' ? 'Xác nhận' : 'Ở nhà'}</p>` : 
                        ''
                    }
                </div>
                <div class="admin-record-actions">
                    <button onclick="showDetail(${record.id})" class="view-btn">Xem chi tiết</button>
                    <button onclick="deleteRecord(${record.id})" class="delete-btn">Xóa</button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteRecord(id) {
    if (confirm('Bạn có chắc muốn xóa đơn này?')) {
        allRecords = allRecords.filter(r => r.id !== id);
        saveAllRecords();
        loadAdminRecords();
        renderDrinkingList();
        showNotification('Đã xóa đơn xin phép!', 'success');
    }
}

async function saveAllRecords() {
    try {
        const response = await fetch(JSONBIN_UPDATE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(allRecords)
        });
        
        if (response.ok) {
            console.log('Dữ liệu đã được lưu vào JSONBin');
            // Auto update UI after successful save
            renderDrinkingList();
            updateAdminStats();
        } else {
            throw new Error('Lỗi khi lưu vào JSONBin');
        }
    } catch (error) {
        console.log('Lưu vào localStorage làm backup');
        localStorage.setItem('allRecords', JSON.stringify(allRecords));
        // Still update UI even if JSONBin fails
        renderDrinkingList();
        updateAdminStats();
    }
}

function exportData() {
    const dataStr = JSON.stringify(allRecords, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `permission-requests-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('Đã xuất dữ liệu!', 'success');
}

function clearAllData() {
    if (confirm('Bạn có chắc muốn xóa TẤT CẢ dữ liệu? Hành động này không thể hoàn tác!')) {
        allRecords = [];
        saveAllRecords();
        renderDrinkingList();
        updateAdminStats();
        loadAdminRecords();
        showNotification('Đã xóa tất cả dữ liệu!', 'warning');
    }
}

function backupData() {
    localStorage.setItem('backup_' + Date.now(), JSON.stringify(allRecords));
    showNotification('Đã backup dữ liệu!', 'success');
}

// New game functions
let quizScore = 0;
let currentQuestion = 0;

function initQuiz() {
    quizScore = 0;
    currentQuestion = 0;
    updateQuizQuestion();
}

function updateQuizQuestion() {
    const questions = [
        {
            question: "Tình yêu đích thực là gì?",
            options: [
                "Chỉ là cảm xúc nhất thời",
                "Sự hy sinh và quan tâm lẫn nhau",
                "Sự hấp dẫn về thể xác",
                "Chỉ là sự tương hợp"
            ],
            correct: 2
        },
        {
            question: "Điều quan trọng nhất trong tình yêu là gì?",
            options: [
                "Ngoại hình",
                "Tiền bạc",
                "Sự tin tưởng",
                "Sở thích chung"
            ],
            correct: 3
        },
        {
            question: "Khi yêu, bạn nên làm gì khi có xung đột?",
            options: [
                "Im lặng và tránh né",
                "Tranh cãi đến cùng",
                "Lắng nghe và thảo luận",
                "Đổ lỗi cho đối phương"
            ],
            correct: 3
        },
        {
            question: "Tình yêu bền vững cần gì?",
            options: [
                "Chỉ cần cảm xúc",
                "Sự kiên nhẫn và nỗ lực",
                "May mắn",
                "Sự hoàn hảo"
            ],
            correct: 2
        },
        {
            question: "Cách thể hiện tình yêu tốt nhất là gì?",
            options: [
                "Quà cáp đắt tiền",
                "Lời nói ngọt ngào",
                "Hành động quan tâm hàng ngày",
                "Khoe khoang trên mạng xã hội"
            ],
            correct: 3
        }
    ];

    if (currentQuestion < questions.length) {
        const q = questions[currentQuestion];
        document.getElementById('questionText').textContent = `Câu ${currentQuestion + 1}: ${q.question}`;
        
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            option.textContent = `${String.fromCharCode(65 + index)}. ${q.options[index]}`;
        });
    } else {
        showQuizResult();
    }
}

function answerQuiz(selectedAnswer) {
    const questions = [
        { correct: 2 }, { correct: 3 }, { correct: 3 }, { correct: 2 }, { correct: 3 }
    ];
    
    if (selectedAnswer === questions[currentQuestion].correct) {
        quizScore++;
        showNotification('Chính xác! 💖', 'success');
    } else {
        showNotification('Sai rồi! 💔', 'error');
    }
    
    currentQuestion++;
    setTimeout(updateQuizQuestion, 1000);
}

function showQuizResult() {
    const result = quizScore >= 4 ? 'Xuất sắc! 💖' : 
                   quizScore >= 3 ? 'Tốt! 💕' : 
                   quizScore >= 2 ? 'Khá! 💗' : 'Cần cố gắng hơn! 💔';
    
    document.getElementById('quizContent').innerHTML = `
        <div class="quiz-result">
            <h4>Kết quả Quiz Tình Yêu</h4>
            <div class="result-score">
                <p>Điểm số: <span style="font-size: 2rem; color: #e91e63;">${quizScore}/5</span></p>
                <p>${result}</p>
            </div>
            <button onclick="initQuiz()" class="retry-btn">Làm lại</button>
        </div>
    `;
}

function calculateLove() {
    const yourName = document.getElementById('yourName').value;
    const loverName = document.getElementById('loverName').value;
    
    if (!yourName || !loverName) {
        showNotification('Vui lòng nhập đầy đủ tên!', 'error');
        return;
    }
    
    // Simple love calculation based on name length and characters
    const score = Math.abs((yourName.length * loverName.length) % 100) + 1;
    
    const result = document.getElementById('loveResult');
    result.innerHTML = `
        <div class="love-score">
            <h3>💕 Kết quả tính toán tình yêu 💕</h3>
            <div class="score-circle">
                <span class="score-number">${score}%</span>
                <p>Tương hợp</p>
            </div>
            <div class="love-message">
                ${getLoveMessage(score)}
            </div>
        </div>
    `;
}

function getLoveMessage(score) {
    if (score >= 90) return "💖 Tình yêu hoàn hảo! Cặp đôi lý tưởng!";
    if (score >= 80) return "💕 Tình yêu rất mạnh mẽ! Hãy trân trọng nhau!";
    if (score >= 70) return "💗 Tình yêu tốt đẹp! Cần nỗ lực thêm!";
    if (score >= 60) return "💝 Tình yêu khá ổn! Cố gắng hiểu nhau hơn!";
    if (score >= 50) return "💘 Tình yêu trung bình! Cần nhiều thời gian!";
    return "💔 Cần nỗ lực nhiều hơn để hiểu nhau!";
}

function generateStory() {
    const stories = [
        "Một ngày nọ, có hai trái tim gặp nhau trong một quán cà phê nhỏ. Từ ánh mắt đầu tiên, họ biết rằng đây chính là định mệnh. Tình yêu của họ nở hoa như những bông hồng trong vườn, đẹp đẽ và thơm ngát.",
        "Trong một buổi chiều mưa, anh đã chia sẻ chiếc ô với cô gái lạ. Từ khoảnh khắc đó, họ bắt đầu một câu chuyện tình yêu đẹp như cổ tích. Mỗi ngày cùng nhau trở thành một trang mới trong cuốn sách hạnh phúc.",
        "Hai người bạn thân từ nhỏ, qua nhiều năm tháng, tình bạn đã chuyển thành tình yêu. Họ hiểu nhau hơn ai hết, yêu thương nhau bằng cả trái tim và tâm hồn.",
        "Trong một chuyến du lịch, họ gặp nhau tình cờ. Từ những cuộc trò chuyện ngắn ngủi, họ nhận ra sự tương hợp kỳ lạ. Tình yêu nảy nở như hoa nở trong mùa xuân.",
        "Cô gái đã cứu chú chó của anh trong một ngày mưa. Từ hành động nhân ái đó, tình yêu đã nảy nở. Họ yêu nhau không chỉ vì vẻ ngoài mà còn vì tấm lòng nhân hậu."
    ];
    
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    document.getElementById('storyText').textContent = randomStory;
}

function getChallenge() {
    const challenges = [
        "💕 Hãy khen người yêu 3 điều mà bạn thích nhất về họ",
        "💖 Viết một lá thư tình bằng tay và gửi cho người yêu",
        "💗 Nấu một bữa ăn ngon cho người yêu",
        "💝 Tạo một playlist nhạc yêu thương và chia sẻ",
        "💘 Dành một ngày hoàn toàn cho người yêu, không điện thoại",
        "💕 Chụp ảnh cùng nhau và in ra làm kỷ niệm",
        "💖 Học một bài hát tình yêu để hát cho người yêu nghe",
        "💗 Viết nhật ký về những khoảnh khắc hạnh phúc cùng nhau",
        "💝 Tạo một video compilation về những kỷ niệm đẹp",
        "💘 Thực hiện một điều mà người yêu từng mong ước"
    ];
    
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    document.getElementById('challengeResult').innerHTML = `
        <div class="challenge-text">${randomChallenge}</div>
        <button onclick="getChallenge()" class="retry-btn">Thử thách mới</button>
    `;
}

function getLoveSong() {
    const songs = [
        { title: "Anh Ơi Ở Lại", artist: "Chi Pu" },
        { title: "Chúng Ta Của Hiện Tại", artist: "Sơn Tùng M-TP" },
        { title: "Em Gì Ơi", artist: "Jack & K-ICM" },
        { title: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP" },
        { title: "Yêu Đương Khó Quá", artist: "Lou Hoàng" },
        { title: "Chạy Ngay Đi", artist: "Sơn Tùng M-TP" },
        { title: "Em Ơi", artist: "Karik ft. Orange" },
        { title: "Bước Qua Mùa Cô Đơn", artist: "Vũ" },
        { title: "Sóng Gió", artist: "Jack & K-ICM" },
        { title: "Đừng Như Thói Quen", artist: "Jaykii" }
    ];
    
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    document.getElementById('songTitle').textContent = randomSong.title;
    document.getElementById('songArtist').textContent = randomSong.artist;
}

function getDateIdea() {
    const ideas = [
        {
            title: "Hẹn hò tại quán cà phê sách",
            description: "Cùng nhau đọc sách, thưởng thức cà phê và trò chuyện về những cuốn sách yêu thích",
            location: "Quán cà phê sách, thư viện, hoặc quán cà phê yên tĩnh"
        },
        {
            title: "Dạo phố vào buổi tối",
            description: "Đi bộ cùng nhau trên những con phố đẹp, ngắm cảnh và chia sẻ những câu chuyện",
            location: "Phố cổ, khu phố đi bộ, hoặc bờ hồ"
        },
        {
            title: "Xem phim tại nhà",
            description: "Chọn một bộ phim lãng mạn, chuẩn bị bỏng ngô và cùng nhau thưởng thức",
            location: "Nhà của một trong hai người"
        },
        {
            title: "Cooking date",
            description: "Cùng nhau nấu ăn, thử những món mới và tận hưởng thời gian bên nhau",
            location: "Nhà bếp hoặc lớp học nấu ăn"
        },
        {
            title: "Picnic trong công viên",
            description: "Chuẩn bị đồ ăn và cùng nhau dã ngoại trong công viên, ngắm thiên nhiên",
            location: "Công viên, vườn hoa, hoặc bãi biển"
        }
    ];
    
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    document.getElementById('ideaTitle').textContent = randomIdea.title;
    document.getElementById('ideaDescription').textContent = randomIdea.description;
    document.getElementById('ideaLocation').textContent = `📍 ${randomIdea.location}`;
}

function calculateAnniversary() {
    const anniversaryDate = document.getElementById('anniversaryDate').value;
    
    if (!anniversaryDate) {
        showNotification('Vui lòng chọn ngày kỷ niệm!', 'error');
        return;
    }
    
    const startDate = new Date(anniversaryDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    document.getElementById('anniversaryResult').innerHTML = `
        <div class="anniversary-result">
            <h5>💕 Thời gian yêu nhau 💕</h5>
            <div class="time-display">
                <p><strong>${years}</strong> năm</p>
                <p><strong>${months}</strong> tháng</p>
                <p><strong>${days}</strong> ngày</p>
            </div>
            <p class="total-days">Tổng cộng: <strong>${diffDays}</strong> ngày yêu nhau</p>
        </div>
    `;
}

// Start romantic effects
createRomanticEffects();
