// Notification System for Real-time Updates
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
        
        // Listen for data manager events
        if (window.dataManager) {
            window.dataManager.addEventListener('newNotification', (notification) => {
                this.showNotification(notification.message, 'info', {
                    title: notification.title,
                    action: notification.postId ? () => this.handleNotificationAction(notification) : null
                });
            });
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    setupStyles() {
        if (document.getElementById('notification-system-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-system-styles';
        styles.textContent = `
            .notification-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }

            .notification-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                margin-bottom: 12px;
                padding: 16px 20px;
                min-width: 320px;
                max-width: 400px;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border-left: 4px solid var(--primary-color);
                position: relative;
                overflow: hidden;
            }

            .notification-item.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-item.success {
                border-left-color: var(--success-color);
            }

            .notification-item.error {
                border-left-color: var(--danger-color);
            }

            .notification-item.warning {
                border-left-color: var(--warning-color);
            }

            .notification-item.info {
                border-left-color: var(--primary-color);
            }

            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .notification-title {
                font-weight: 600;
                color: var(--text-dark);
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .notification-close {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .notification-close:hover {
                background: var(--bg-light);
                color: var(--text-dark);
            }

            .notification-message {
                color: var(--text-light);
                font-size: 13px;
                line-height: 1.4;
                margin-bottom: 12px;
            }

            .notification-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }

            .notification-action {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-action:hover {
                background: var(--secondary-color);
                transform: translateY(-1px);
            }

            .notification-action.secondary {
                background: var(--bg-light);
                color: var(--text-dark);
            }

            .notification-action.secondary:hover {
                background: var(--border-color);
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--primary-color);
                transition: width linear;
            }

            .notification-icon {
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 480px) {
                .notification-container {
                    right: 10px;
                    left: 10px;
                }

                .notification-item {
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    showNotification(message, type = 'info', options = {}) {
        const {
            title = '',
            duration = this.defaultDuration,
            action = null,
            actionText = 'View',
            persistent = false
        } = options;

        // Remove oldest notification if at max capacity
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.removeNotification(oldestId);
        }

        const id = Date.now() + Math.random();
        const notification = this.createNotificationElement(id, message, type, {
            title,
            action,
            actionText,
            persistent
        });

        this.notifications.set(id, notification);
        this.container.appendChild(notification.element);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.element.classList.add('show');
        });

        // Auto remove if not persistent
        if (!persistent && duration > 0) {
            notification.timer = setTimeout(() => {
                this.removeNotification(id);
            }, duration);

            // Add progress bar
            if (duration > 1000) {
                this.addProgressBar(notification.element, duration);
            }
        }

        return id;
    }

    createNotificationElement(id, message, type, options) {
        const { title, action, actionText, persistent } = options;

        const element = document.createElement('div');
        element.className = `notification-item ${type}`;
        element.dataset.id = id;

        const icon = this.getIcon(type);

        element.innerHTML = `
            ${title ? `
                <div class="notification-header">
                    <div class="notification-title">
                        <span class="notification-icon">${icon}</span>
                        ${title}
                    </div>
                    <button class="notification-close" onclick="notificationSystem.removeNotification(${id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            ` : `
                <div class="notification-header">
                    <div class="notification-title">
                        <span class="notification-icon">${icon}</span>
                    </div>
                    <button class="notification-close" onclick="notificationSystem.removeNotification(${id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `}
            <div class="notification-message">${message}</div>
            ${action ? `
                <div class="notification-actions">
                    <button class="notification-action secondary" onclick="notificationSystem.removeNotification(${id})">
                        Dismiss
                    </button>
                    <button class="notification-action" onclick="notificationSystem.handleAction(${id})">
                        ${actionText}
                    </button>
                </div>
            ` : ''}
        `;

        return {
            element,
            action,
            timer: null
        };
    }

    addProgressBar(element, duration) {
        const progressBar = document.createElement('div');
        progressBar.className = 'notification-progress';
        progressBar.style.width = '100%';
        element.appendChild(progressBar);

        // Animate progress bar
        requestAnimationFrame(() => {
            progressBar.style.transition = `width ${duration}ms linear`;
            progressBar.style.width = '0%';
        });
    }

    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>',
            error: '<i class="fas fa-exclamation-circle" style="color: var(--danger-color);"></i>',
            warning: '<i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>',
            info: '<i class="fas fa-info-circle" style="color: var(--primary-color);"></i>'
        };
        return icons[type] || icons.info;
    }

    removeNotification(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Clear timer
        if (notification.timer) {
            clearTimeout(notification.timer);
        }

        // Animate out
        notification.element.classList.remove('show');
        
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.notifications.delete(id);
        }, 300);
    }

    handleAction(id) {
        const notification = this.notifications.get(id);
        if (notification && notification.action) {
            notification.action();
        }
        this.removeNotification(id);
    }

    handleNotificationAction(notification) {
        if (notification.postId) {
            // Navigate to admin panel and show the specific post
            if (window.location.pathname.includes('admin.html')) {
                // Already on admin page, just show the post
                if (window.viewPost) {
                    window.viewPost(notification.postId);
                }
            } else {
                // Navigate to admin page
                window.location.href = `admin.html?post=${notification.postId}`;
            }
        }
    }

    // Convenience methods
    success(message, options = {}) {
        return this.showNotification(message, 'success', options);
    }

    error(message, options = {}) {
        return this.showNotification(message, 'error', options);
    }

    warning(message, options = {}) {
        return this.showNotification(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.showNotification(message, 'info', options);
    }

    // Clear all notifications
    clearAll() {
        this.notifications.forEach((notification, id) => {
            this.removeNotification(id);
        });
    }
}

// Create global instance
window.notificationSystem = new NotificationSystem();