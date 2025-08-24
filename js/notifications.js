/**
 * Sistema de notificações para o sistema de gamificação
 * Gerencia notificações push, alertas e mensagens para os usuários
 */

// Namespace para o sistema de notificações
const Notifications = {
    // Armazenamento local de notificações
    _notifications: [],
    
    /**
     * Inicializa o sistema de notificações
     */
    init: function() {
        // Carregar notificações do localStorage
        this.loadNotifications();
        
        // Verificar se há novas notificações a cada minuto
        setInterval(() => {
            this.checkNewNotifications();
        }, 60000);
        
        // Adicionar estilos CSS para notificações se ainda não existirem
        this.addNotificationStyles();
        
        // Criar container de notificações se não existir
        this.createNotificationContainer();
        
        // Atualizar contador de notificações
        this.updateNotificationCounter();
        
        console.log('Sistema de notificações inicializado');
    },
    
    /**
     * Carrega notificações do localStorage
     */
    loadNotifications: function() {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            this._notifications = JSON.parse(savedNotifications);
        } else {
            // Adicionar algumas notificações de exemplo
            this._notifications = this.getExampleNotifications();
            this.saveNotifications();
        }
    },
    
    /**
     * Salva notificações no localStorage
     */
    saveNotifications: function() {
        localStorage.setItem('notifications', JSON.stringify(this._notifications));
    },
    
    /**
     * Verifica se há novas notificações (simulado)
     */
    checkNewNotifications: function() {
        // Em um sistema real, isso faria uma chamada ao servidor
        // Aqui vamos apenas simular com uma chance aleatória
        
        if (Math.random() < 0.3) { // 30% de chance de nova notificação
            const newNotification = {
                id: Date.now(),
                title: 'Novo desafio disponível!',
                message: 'Um novo desafio foi adicionado. Confira agora e ganhe pontos extras!',
                type: 'challenge',
                read: false,
                date: new Date().toISOString()
            };
            
            this.addNotification(newNotification);
        }
    },
    
    /**
     * Adiciona uma nova notificação
     */
    addNotification: function(notification) {
        this._notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationCounter();
        this.showNotificationPopup(notification);
    },
    
    /**
     * Marca uma notificação como lida
     */
    markAsRead: function(notificationId) {
        const notification = this._notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationCounter();
        }
    },
    
    /**
     * Marca todas as notificações como lidas
     */
    markAllAsRead: function() {
        this._notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateNotificationCounter();
    },
    
    /**
     * Remove uma notificação
     */
    removeNotification: function(notificationId) {
        this._notifications = this._notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationCounter();
    },
    
    /**
     * Limpa todas as notificações
     */
    clearAllNotifications: function() {
        this._notifications = [];
        this.saveNotifications();
        this.updateNotificationCounter();
    },
    
    /**
     * Retorna todas as notificações
     */
    getAllNotifications: function() {
        return [...this._notifications];
    },
    
    /**
     * Retorna apenas notificações não lidas
     */
    getUnreadNotifications: function() {
        return this._notifications.filter(n => !n.read);
    },
    
    /**
     * Atualiza o contador de notificações na interface
     */
    updateNotificationCounter: function() {
        const unreadCount = this.getUnreadNotifications().length;
        
        // Atualizar o contador na interface
        const counter = document.querySelector('.notification-counter');
        if (counter) {
            counter.textContent = unreadCount;
            counter.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    },
    
    /**
     * Exibe um popup de notificação
     */
    showNotificationPopup: function(notification) {
        // Criar elemento de notificação
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-popup notification-${notification.type}`;
        
        // Adicionar conteúdo
        notificationElement.innerHTML = `
            <div class="notification-header">
                <h4>${notification.title}</h4>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">
                <p>${notification.message}</p>
            </div>
        `;
        
        // Adicionar ao container
        const container = document.querySelector('.notification-container');
        if (container) {
            container.appendChild(notificationElement);
            
            // Configurar evento de fechar
            notificationElement.querySelector('.notification-close').addEventListener('click', function() {
                notificationElement.classList.add('notification-hiding');
                setTimeout(() => {
                    notificationElement.remove();
                }, 300);
            });
            
            // Auto-remover após 5 segundos
            setTimeout(() => {
                notificationElement.classList.add('notification-hiding');
                setTimeout(() => {
                    notificationElement.remove();
                }, 300);
            }, 5000);
        }
    },
    
    /**
     * Cria o container de notificações se não existir
     */
    createNotificationContainer: function() {
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    },
    
    /**
     * Adiciona estilos CSS para notificações
     */
    addNotificationStyles: function() {
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .notification-popup {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    width: 300px;
                    overflow: hidden;
                    animation: notification-slide-in 0.3s ease;
                    opacity: 1;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .notification-hiding {
                    opacity: 0;
                    transform: translateX(100%);
                }
                
                .notification-header {
                    padding: 10px 15px;
                    background-color: var(--primary-color);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .notification-header h4 {
                    margin: 0;
                    font-size: 1rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification-body {
                    padding: 15px;
                }
                
                .notification-body p {
                    margin: 0;
                    font-size: 0.9rem;
                }
                
                .notification-challenge {
                    border-left: 4px solid var(--primary-color);
                }
                
                .notification-achievement {
                    border-left: 4px solid var(--success-color);
                }
                
                .notification-achievement .notification-header {
                    background-color: var(--success-color);
                }
                
                .notification-alert {
                    border-left: 4px solid var(--danger-color);
                }
                
                .notification-alert .notification-header {
                    background-color: var(--danger-color);
                }
                
                .notification-counter {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: var(--danger-color);
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 0.7rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes notification-slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .notification-dropdown {
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .notification-item {
                    padding: 10px 15px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                }
                
                .notification-item:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }
                
                .notification-item.unread {
                    background-color: rgba(var(--primary-rgb), 0.1);
                }
                
                .notification-item-title {
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .notification-item-message {
                    font-size: 0.85rem;
                    color: #666;
                }
                
                .notification-item-date {
                    font-size: 0.75rem;
                    color: #999;
                    margin-top: 5px;
                    text-align: right;
                }
                
                .notification-empty {
                    padding: 20px;
                    text-align: center;
                    color: #999;
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    /**
     * Renderiza o dropdown de notificações
     */
    renderNotificationDropdown: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Limpar conteúdo atual
        container.innerHTML = '';
        
        // Verificar se há notificações
        if (this._notifications.length === 0) {
            container.innerHTML = '<div class="notification-empty">Nenhuma notificação</div>';
            return;
        }
        
        // Adicionar cabeçalho
        const header = document.createElement('div');
        header.className = 'dropdown-header d-flex justify-content-between align-items-center';
        header.innerHTML = `
            <span>Notificações</span>
            <div>
                <button class="btn btn-sm btn-link mark-all-read">Marcar todas como lidas</button>
                <button class="btn btn-sm btn-link clear-all">Limpar todas</button>
            </div>
        `;
        container.appendChild(header);
        
        // Adicionar divisor
        const divider = document.createElement('div');
        divider.className = 'dropdown-divider';
        container.appendChild(divider);
        
        // Adicionar notificações
        const notificationList = document.createElement('div');
        notificationList.className = 'notification-dropdown';
        
        this._notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? '' : 'unread'}`;
            item.dataset.id = notification.id;
            
            item.innerHTML = `
                <div class="notification-item-title">${notification.title}</div>
                <div class="notification-item-message">${notification.message}</div>
                <div class="notification-item-date">${this.formatDate(notification.date)}</div>
            `;
            
            notificationList.appendChild(item);
        });
        
        container.appendChild(notificationList);
        
        // Configurar eventos
        container.querySelector('.mark-all-read').addEventListener('click', (e) => {
            e.stopPropagation();
            this.markAllAsRead();
            this.renderNotificationDropdown(containerId);
        });
        
        container.querySelector('.clear-all').addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearAllNotifications();
            this.renderNotificationDropdown(containerId);
        });
        
        notificationList.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
                this.renderNotificationDropdown(containerId);
            });
        });
    },
    
    /**
     * Formata a data para exibição
     */
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 0) {
            return `${diffDay} dia${diffDay > 1 ? 's' : ''} atrás`;
        } else if (diffHour > 0) {
            return `${diffHour} hora${diffHour > 1 ? 's' : ''} atrás`;
        } else if (diffMin > 0) {
            return `${diffMin} minuto${diffMin > 1 ? 's' : ''} atrás`;
        } else {
            return 'Agora mesmo';
        }
    },
    
    /**
     * Retorna notificações de exemplo
     */
    getExampleNotifications: function() {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        return [
            {
                id: 1,
                title: 'Novo desafio disponível',
                message: 'Desafio "Rei dos Cortes Premium" está disponível para você participar!',
                type: 'challenge',
                read: false,
                date: now.toISOString()
            },
            {
                id: 2,
                title: 'Parabéns! Nova conquista',
                message: 'Você atingiu o nível 3! Desbloqueou novas recompensas.',
                type: 'achievement',
                read: false,
                date: yesterday.toISOString()
            },
            {
                id: 3,
                title: 'Desafio concluído',
                message: 'Você completou o desafio "Vendas Relâmpago" e ganhou 150 pontos!',
                type: 'achievement',
                read: true,
                date: twoDaysAgo.toISOString()
            }
        ];
    }
};

// Inicializar o sistema de notificações quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    Notifications.init();
});