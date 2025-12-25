/**
 * Modal Helper - مدیریت پنجره‌های گزارش
 * نسخه نهایی ۲۰۲۵ - الگوی تمیز و قابل اعتماد
 */

const ModalHelper = (() => {
    // Map برای ذخیره callbacks - بدون آلودگی global scope
    const callbacks = new Map();
    
    // آخرین modal فعال
    let activeModalId = null;
    
    /**
     * نمایش modal سفارشی
     */
    function showCustomModal(title, content, onClose = null) {
        // بستن modal قبلی اگر وجود دارد
        if (activeModalId) {
            closeModal(activeModalId);
        }
        
        // ایجاد ID منحصر به فرد
        const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        activeModalId = modalId;
        
        // ذخیره callback در Map
        if (onClose) {
            callbacks.set(`${modalId}-close`, onClose);
        }
        
        // ساخت HTML
        const modalHTML = `
            <div id="${modalId}" class="custom-modal active" tabindex="-1">
                <div class="custom-modal-content">
                    <div class="custom-modal-header">
                        <h2>${escapeHtml(title)}</h2>
                        <button class="modal-close-btn" data-modal-id="${modalId}">×</button>
                    </div>
                    <div class="custom-modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        // اضافه کردن به DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // تنظیم event listeners
        setupModalEvents(modalId);
        
        // Focus روی modal برای دسترسی‌پذیری
        setTimeout(() => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.focus();
                
                // بستن با کلید ESC
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        closeModal(modalId);
                    }
                });
            }
        }, 100);
        
        console.log(`📱 Modal opened: ${modalId}`);
        return modalId;
    }
    
    /**
     * تنظیم event listeners برای modal
     */
    function setupModalEvents(modalId) {
        const closeBtn = document.querySelector(`[data-modal-id="${modalId}"]`);
        const modal = document.getElementById(modalId);
        
        if (!closeBtn || !modal) return;
        
        // بستن با کلیک روی دکمه ×
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal(modalId);
        });
        
        // بستن با کلیک روی پس‌زمینه
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modalId);
            }
        });
    }
    
    /**
     * بستن modal خاص
     */
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        console.log(`📱 Closing modal: ${modalId}`);
        
        // اجرای callback بستن
        const closeCallback = callbacks.get(`${modalId}-close`);
        if (closeCallback) {
            try {
                closeCallback();
            } catch (error) {
                console.error('Error in modal close callback:', error);
            }
            callbacks.delete(`${modalId}-close`);
        }
        
        // حذف event listeners برای جلوگیری از memory leak
        const closeBtn = document.querySelector(`[data-modal-id="${modalId}"]`);
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        }
        
        // انیمیشن بستن
        modal.classList.remove('active');
        
        // حذف از DOM بعد از انیمیشن
        setTimeout(() => {
            if (modal && modal.parentNode) {
                modal.remove();
            }
            
            // به‌روزرسانی activeModalId
            if (activeModalId === modalId) {
                activeModalId = null;
            }
            
            console.log(`📱 Modal removed: ${modalId}`);
        }, 300);
    }
    
    /**
     * نمایش modal تأیید
     */
    function showConfirmModal(title, message, onConfirm, onCancel = null) {
        const modalId = `confirm-${Date.now()}`;
        
        // ذخیره callbacks
        callbacks.set(`${modalId}-confirm`, onConfirm);
        if (onCancel) {
            callbacks.set(`${modalId}-cancel`, onCancel);
        }
        
        const content = `
            <div class="confirm-modal">
                <p>${escapeHtml(message)}</p>
                <div class="confirm-buttons">
                    <button class="btn btn-primary" data-action="confirm" data-modal-id="${modalId}">
                        تأیید
                    </button>
                    <button class="btn btn-secondary" data-action="cancel" data-modal-id="${modalId}">
                        انصراف
                    </button>
                </div>
            </div>
        `;
        
        // نمایش modal
        const actualModalId = showCustomModal(title, content, () => {
            // اجرای callback انصراف هنگام بستن از × یا پس‌زمینه
            const cancelCallback = callbacks.get(`${modalId}-cancel`);
            if (cancelCallback) {
                cancelCallback();
            }
            cleanupConfirmCallbacks(modalId);
        });
        
        // تنظیم event listeners برای دکمه‌های تأیید/انصراف
        setTimeout(() => {
            const confirmBtn = document.querySelector(`[data-action="confirm"][data-modal-id="${modalId}"]`);
            const cancelBtn = document.querySelector(`[data-action="cancel"][data-modal-id="${modalId}"]`);
            
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    const confirmCallback = callbacks.get(`${modalId}-confirm`);
                    if (confirmCallback) {
                        confirmCallback();
                    }
                    cleanupConfirmCallbacks(modalId);
                    closeModal(actualModalId);
                });
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    const cancelCallback = callbacks.get(`${modalId}-cancel`);
                    if (cancelCallback) {
                        cancelCallback();
                    }
                    cleanupConfirmCallbacks(modalId);
                    closeModal(actualModalId);
                });
            }
        }, 50);
        
        return actualModalId;
    }
    
    /**
     * پاکسازی callbacks مربوط به confirm modal
     */
    function cleanupConfirmCallbacks(modalId) {
        callbacks.delete(`${modalId}-confirm`);
        callbacks.delete(`${modalId}-cancel`);
    }
    
    /**
     * نمایش modal اطلاعات
     */
    function showInfoModal(title, message, icon = 'ℹ️') {
        const content = `
            <div class="info-modal">
                <div class="info-icon">${escapeHtml(icon)}</div>
                <p>${escapeHtml(message)}</p>
                <button class="btn btn-primary" data-action="close">
                    فهمیدم
                </button>
            </div>
        `;
        
        return showCustomModal(title, content);
    }
    
    /**
     * نمایش modal دستاورد
     */
    function showAchievementModal(title, message, icon = '🏆') {
        const content = `
            <div class="achievement-modal">
                <div class="achievement-icon">${escapeHtml(icon)}</div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(message)}</p>
                <button class="btn btn-primary" data-action="close">
                    عالی! ادامه می‌دهم
                </button>
            </div>
        `;
        
        return showCustomModal('دستاورد جدید! 🎉', content);
    }
    
    /**
     * بستن همه modal ها
     */
    function closeAllModals() {
        const modals = document.querySelectorAll('.custom-modal');
        modals.forEach(modal => {
            const modalId = modal.id;
            closeModal(modalId);
        });
        
        // پاکسازی همه callbacks
        callbacks.clear();
        activeModalId = null;
    }
    
    /**
     * Escape HTML برای جلوگیری از XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * API عمومی
     */
    return {
        showCustomModal,
        closeModal,
        showConfirmModal,
        showInfoModal,
        showAchievementModal,
        closeAllModals,
        
        // برای debug
        _getCallbacks: () => new Map(callbacks),
        _getActiveModalId: () => activeModalId
    };
})();

// در دسترس قرار دادن API جهانی - فقط توابع ضروری
window.ModalHelper = ModalHelper;

// توابع global برای backward compatibility
window.showCustomModal = (title, content) => ModalHelper.showCustomModal(title, content);
window.closeCustomModal = () => ModalHelper.closeAllModals();

// راه‌اندازی event delegation برای دکمه‌های عمومی
document.addEventListener('DOMContentLoaded', () => {
    // Event delegation برای دکمه‌های data-action="close"
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-action="close"]')) {
            const modal = e.target.closest('.custom-modal');
            if (modal) {
                ModalHelper.closeModal(modal.id);
            }
        }
    });
    
    console.log('✅ Modal Helper initialized (2025 Architecture)');
});
