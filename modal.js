/**
 * Modal Helper - سیستم مدیریت پنجره‌های مدال پیشرفته
 * نسخه 2.0 - 2024
 */

const ModalHelper = (() => {
    // ذخیره‌سازی وضعیت Modal ها
    const state = {
        activeModals: new Map(),
        zIndex: 1000,
        eventListeners: new Map()
    };

    // پیکربندی پیش‌فرض
    const defaultConfig = {
        animationDuration: 300,
        backdropOpacity: 0.5,
        maxWidth: '500px',
        closeOnBackdrop: true,
        closeOnEscape: true,
        preventScroll: true
    };

    /**
     * ایجاد Modal جدید
     * @param {Object} options - تنظیمات Modal
     * @returns {string} Modal ID
     */
    function createModal(options) {
        const {
            title = '',
            content = '',
            type = 'default',
            size = 'medium',
            onClose = null,
            onConfirm = null,
            showCloseButton = true,
            customClass = ''
        } = options;

        // ایجاد ID یکتا
        const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // تعیین کلاس‌ها بر اساس نوع و سایز
        const typeClass = `modal-${type}`;
        const sizeClass = `modal-${size}`;
        
        // ساخت HTML Modal
        const modalHTML = `
            <div id="${modalId}" 
                 class="modal ${typeClass} ${sizeClass} ${customClass}" 
                 role="dialog" 
                 aria-modal="true" 
                 aria-labelledby="${modalId}-title"
                 tabindex="-1">
                <div class="modal-backdrop"></div>
                <div class="modal-container">
                    <div class="modal-content">
                        ${title ? `
                            <div class="modal-header">
                                <h2 id="${modalId}-title" class="modal-title">${escapeHtml(title)}</h2>
                                ${showCloseButton ? `
                                    <button type="button" 
                                            class="modal-close" 
                                            aria-label="بستن"
                                            data-modal-id="${modalId}">
                                        ×
                                    </button>
                                ` : ''}
                            </div>
                        ` : ''}
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${onConfirm ? `
                            <div class="modal-footer">
                                <button type="button" 
                                        class="btn btn-secondary" 
                                        data-action="cancel"
                                        data-modal-id="${modalId}">
                                    انصراف
                                </button>
                                <button type="button" 
                                        class="btn btn-primary" 
                                        data-action="confirm"
                                        data-modal-id="${modalId}">
                                    تأیید
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // اضافه کردن Modal به DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // تنظیم وضعیت
        const modalElement = document.getElementById(modalId);
        state.activeModals.set(modalId, {
            element: modalElement,
            onClose,
            onConfirm,
            config: options
        });

        // تنظیم z-index
        modalElement.style.zIndex = state.zIndex++;
        
        // تنظیم event listeners
        setupModalEvents(modalId);
        
        // جلوگیری از scroll
        if (defaultConfig.preventScroll) {
            document.body.style.overflow = 'hidden';
        }

        // فعال‌سازی Modal با انیمیشن
        setTimeout(() => {
            modalElement.classList.add('active');
        }, 10);

        console.log(`📱 Modal created: ${modalId}`);
        return modalId;
    }

    /**
     * تنظیم event listeners برای Modal
     */
    function setupModalEvents(modalId) {
        const modalData = state.activeModals.get(modalId);
        if (!modalData) return;

        const { element, onClose, onConfirm, config } = modalData;
        const listeners = [];

        // دکمه بستن
        const closeBtn = element.querySelector('.modal-close');
        if (closeBtn) {
            const closeHandler = (e) => {
                e.stopPropagation();
                closeModal(modalId);
            };
            closeBtn.addEventListener('click', closeHandler);
            listeners.push({ element: closeBtn, type: 'click', handler: closeHandler });
        }

        // دکمه‌های footer
        const cancelBtn = element.querySelector('[data-action="cancel"]');
        if (cancelBtn) {
            const cancelHandler = (e) => {
                e.stopPropagation();
                closeModal(modalId);
                if (onClose) onClose();
            };
            cancelBtn.addEventListener('click', cancelHandler);
            listeners.push({ element: cancelBtn, type: 'click', handler: cancelHandler });
        }

        const confirmBtn = element.querySelector('[data-action="confirm"]');
        if (confirmBtn) {
            const confirmHandler = (e) => {
                e.stopPropagation();
                if (onConfirm) {
                    onConfirm();
                }
                closeModal(modalId);
            };
            confirmBtn.addEventListener('click', confirmHandler);
            listeners.push({ element: confirmBtn, type: 'click', handler: confirmHandler });
        }

        // بستن با کلیک روی backdrop
        if (config.closeOnBackdrop !== false) {
            const backdrop = element.querySelector('.modal-backdrop');
            if (backdrop) {
                const backdropHandler = (e) => {
                    if (e.target === backdrop) {
                        closeModal(modalId);
                        if (onClose) onClose();
                    }
                };
                backdrop.addEventListener('click', backdropHandler);
                listeners.push({ element: backdrop, type: 'click', handler: backdropHandler });
            }
        }

        // بستن با کلید Escape
        if (config.closeOnEscape !== false) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && state.activeModals.has(modalId)) {
                    closeModal(modalId);
                    if (onClose) onClose();
                }
            };
            document.addEventListener('keydown', escapeHandler);
            listeners.push({ element: document, type: 'keydown', handler: escapeHandler });
        }

        // ذخیره listeners برای تمیزکاری بعدی
        state.eventListeners.set(modalId, listeners);
    }

    /**
     * بستن Modal
     */
    function closeModal(modalId) {
        const modalData = state.activeModals.get(modalId);
        if (!modalData) return;

        const { element, onClose } = modalData;
        
        // انیمیشن خروج
        element.classList.remove('active');
        
        // حذف بعد از انیمیشن
        setTimeout(() => {
            if (element.parentNode) {
                // تمیز کردن event listeners
                const listeners = state.eventListeners.get(modalId) || [];
                listeners.forEach(({ element: el, type, handler }) => {
                    el.removeEventListener(type, handler);
                });
                state.eventListeners.delete(modalId);
                
                // حذف از DOM
                element.remove();
                
                // حذف از state
                state.activeModals.delete(modalId);
                
                // بازگرداندن scroll اگر modal دیگری وجود ندارد
                if (state.activeModals.size === 0 && defaultConfig.preventScroll) {
                    document.body.style.overflow = '';
                }
                
                console.log(`📱 Modal closed: ${modalId}`);
                
                // اجرای callback بستن
                if (onClose) {
                    try {
                        onClose();
                    } catch (error) {
                        console.error('Error in modal close callback:', error);
                    }
                }
            }
        }, defaultConfig.animationDuration);
    }

    /**
     * بستن همه Modal ها
     */
    function closeAllModals() {
        state.activeModals.forEach((_, modalId) => {
            closeModal(modalId);
        });
    }

    /**
     * نمایش Modal اطلاعات
     */
    function showInfo(title, message, icon = 'ℹ️') {
        const content = `
            <div class="modal-info">
                <div class="modal-icon">${escapeHtml(icon)}</div>
                <div class="modal-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        return createModal({
            title,
            content,
            type: 'info',
            size: 'small',
            showCloseButton: true
        });
    }

    /**
     * نمایش Modal تأیید
     */
    function showConfirm(title, message, onConfirm, onCancel = null) {
        const content = `
            <div class="modal-confirm">
                <div class="modal-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        return createModal({
            title,
            content,
            type: 'confirm',
            size: 'small',
            onClose: onCancel,
            onConfirm
        });
    }

    /**
     * نمایش Modal موفقیت
     */
    function showSuccess(title, message, icon = '✅') {
        const content = `
            <div class="modal-success">
                <div class="modal-icon">${escapeHtml(icon)}</div>
                <div class="modal-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        return createModal({
            title,
            content,
            type: 'success',
            size: 'small',
            showCloseButton: true
        });
    }

    /**
     * نمایش Modal خطا
     */
    function showError(title, message, icon = '❌') {
        const content = `
            <div class="modal-error">
                <div class="modal-icon">${escapeHtml(icon)}</div>
                <div class="modal-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        return createModal({
            title,
            content,
            type: 'error',
            size: 'small',
            showCloseButton: true
        });
    }

    /**
     * نمایش Modal دستاورد
     */
    function showAchievement(title, message, icon = '🏆') {
        const content = `
            <div class="modal-achievement">
                <div class="modal-icon animate-bounce">${escapeHtml(icon)}</div>
                <h3 class="modal-title">${escapeHtml(title)}</h3>
                <div class="modal-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        const modalId = createModal({
            title: '🎉 دستاورد جدید!',
            content,
            type: 'achievement',
            size: 'medium',
            showCloseButton: true,
            customClass: 'animate-pulse'
        });
        
        // پخش صدای دستاورد
        if (typeof window.isMuted === 'function' && !window.isMuted()) {
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
                audio.volume = 0.3;
                audio.play();
            } catch (e) {
                console.log('Audio play failed:', e);
            }
        }
        
        return modalId;
    }

    /**
     * نمایش Modal لودینگ
     */
    function showLoading(message = 'لطفاً منتظر بمانید...') {
        const content = `
            <div class="modal-loading">
                <div class="loading-spinner"></div>
                <div class="loading-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        return createModal({
            content,
            type: 'loading',
            size: 'small',
            showCloseButton: false,
            closeOnBackdrop: false,
            closeOnEscape: false
        });
    }

    /**
     * به‌روزرسانی محتوای Modal
     */
    function updateModalContent(modalId, newContent) {
        const modalData = state.activeModals.get(modalId);
        if (!modalData) return false;
        
        const modalBody = modalData.element.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = newContent;
            return true;
        }
        return false;
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
     * دریافت وضعیت فعلی Modal ها
     */
    function getState() {
        return {
            activeCount: state.activeModals.size,
            activeModals: Array.from(state.activeModals.keys()),
            zIndex: state.zIndex
        };
    }

    // اضافه کردن استایل‌های CSS
    function injectStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const styles = `
            /* Modal Styles */
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity ${defaultConfig.animationDuration}ms ease, 
                            visibility ${defaultConfig.animationDuration}ms ease;
                z-index: 1000;
            }
            
            .modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, ${defaultConfig.backdropOpacity});
                backdrop-filter: blur(3px);
            }
            
            .modal-container {
                position: relative;
                width: 90%;
                max-width: ${defaultConfig.maxWidth};
                max-height: 90vh;
                margin: 20px;
                transform: translateY(20px) scale(0.95);
                transition: transform ${defaultConfig.animationDuration}ms ease;
            }
            
            .modal.active .modal-container {
                transform: translateY(0) scale(1);
            }
            
            .modal-content {
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                max-height: inherit;
            }
            
            body.dark .modal-content {
                background: #2d3748;
                color: #f0f0f0;
            }
            
            .modal-header {
                padding: 20px 24px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            
            body.dark .modal-header {
                border-bottom-color: #4a5568;
            }
            
            .modal-title {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: #4CAF50;
            }
            
            body.dark .modal-title {
                color: #68D391;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 28px;
                color: #666;
                cursor: pointer;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s;
                padding: 0;
                line-height: 1;
            }
            
            body.dark .modal-close {
                color: #aaa;
            }
            
            .modal-close:hover {
                background: #f5f5f5;
                color: #333;
            }
            
            body.dark .modal-close:hover {
                background: #4a5568;
                color: #f0f0f0;
            }
            
            .modal-body {
                padding: 24px;
                overflow-y: auto;
                flex: 1;
            }
            
            .modal-footer {
                padding: 20px 24px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                flex-shrink: 0;
            }
            
            body.dark .modal-footer {
                border-top-color: #4a5568;
            }
            
            /* انواع Modal */
            .modal-info .modal-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 20px;
                color: #2196F3;
            }
            
            .modal-success .modal-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 20px;
                color: #4CAF50;
            }
            
            .modal-error .modal-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 20px;
                color: #F44336;
            }
            
            .modal-achievement {
                text-align: center;
                padding: 10px;
            }
            
            .modal-achievement .modal-icon {
                font-size: 72px;
                margin-bottom: 20px;
                display: inline-block;
            }
            
            .modal-achievement .modal-title {
                color: #FF9800;
                margin-bottom: 15px;
            }
            
            .modal-message {
                font-size: 16px;
                line-height: 1.6;
                color: #333;
            }
            
            body.dark .modal-message {
                color: #f0f0f0;
            }
            
            /* Loading Modal */
            .modal-loading {
                text-align: center;
                padding: 30px 20px;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px auto;
            }
            
            body.dark .loading-spinner {
                border-color: #4a5568;
                border-top-color: #68D391;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-message {
                color: #666;
                font-size: 16px;
            }
            
            body.dark .loading-message {
                color: #aaa;
            }
            
            /* Animation Classes */
            .animate-bounce {
                animation: bounce 1s infinite;
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .animate-pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            /* سایزهای مختلف */
            .modal-small .modal-container {
                max-width: 400px;
            }
            
            .modal-medium .modal-container {
                max-width: 500px;
            }
            
            .modal-large .modal-container {
                max-width: 700px;
            }
            
            /* رسپانسیو */
            @media (max-width: 480px) {
                .modal-container {
                    width: 95%;
                    margin: 10px;
                }
                
                .modal-header,
                .modal-body,
                .modal-footer {
                    padding: 15px;
                }
                
                .modal-title {
                    font-size: 18px;
                }
                
                .modal-footer {
                    flex-direction: column;
                }
                
                .modal-footer .btn {
                    width: 100%;
                }
            }
        `;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'modal-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // مقداردهی اولیه
    function init() {
        injectStyles();
        
        // Event Delegation برای دکمه‌های عمومی
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal-action="close"]')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            }
        });
        
        console.log('✅ Modal Helper initialized');
    }

    // API عمومی
    return {
        init,
        createModal,
        closeModal,
        closeAllModals,
        showInfo,
        showConfirm,
        showSuccess,
        showError,
        showAchievement,
        showLoading,
        updateModalContent,
        getState,
        
        // برای backward compatibility
        showCustomModal: (title, content) => createModal({ title, content }),
        showNotification: (title, message) => showInfo(title, message)
    };
})();

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', ModalHelper.init);

// در دسترس قرار دادن در window
window.ModalHelper = ModalHelper;
window.showModal = ModalHelper.createModal;
window.closeModal = ModalHelper.closeModal;
