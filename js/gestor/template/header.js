function carregarHeader() {
    fetch('../gestor/template/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        feather.replace();
    });
}

function notificacoes() {
    // Inicializar sistema de notificações
    if (document.getElementById('notificationContainer')) {
        Notifications.renderNotificationDropdown('notificationContainer');
        
        // Atualizar dropdown quando aberto
        document.getElementById('notificationDropdown').addEventListener('click', function() {
            Notifications.renderNotificationDropdown('notificationContainer');
        });
    }

    // setTimeout(function() {
    //     showNotification('Novo desafio disponível!', 'info');
    // }, 3000);
}

/**
 * Exibe uma notificação temporária para o usuário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `notification notification-${type}`;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '300px';
    
    container.innerHTML = `
        <div class="d-flex align-items-center">
            <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" 
               style="margin-right: 10px;"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-sm" style="position: absolute; top: 5px; right: 5px;"></button>
    `;
    
    document.body.appendChild(container);
    feather.replace();
    
    // Adicionar evento para fechar notificação
    container.querySelector('.btn-close').addEventListener('click', function() {
        document.body.removeChild(container);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(function() {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }, 5000);
}

/**
 * Função para logout do usuário
 * @param {Event} e - Evento de clique
 */
function logoutBtn(e) {
    e.preventDefault();
    Auth.logout();
}

carregarHeader();
notificacoes();