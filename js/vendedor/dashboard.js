/**
 * Script para gerenciar as funcionalidades do dashboard
 * Inicializa os ícones, gerencia o logout e carrega dados do usuário
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones Feather
    feather.replace();
    
    // Verificar autenticação
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../../index.html';
        return;
    }
    
    console.log(currentUser);
    // Atualizar nome do usuário na barra de navegação
    //document.getElementById('username').textContent = currentUser.nome;
    
    // Configurar evento de logout
    // document.getElementById('logoutBtn').addEventListener('click', function(e) {
    //     e.preventDefault();
    //     Auth.logout();
    // });
    
    // Inicializar sistema de notificações
    // if (document.getElementById('notificationContainer')) {
    //     Notifications.renderNotificationDropdown('notificationContainer');
        
    //     // Atualizar dropdown quando aberto
    //     document.getElementById('notificationDropdown').addEventListener('click', function() {
    //         Notifications.renderNotificationDropdown('notificationContainer');
    //     });
    // }
    
    // // Simular notificações (em um sistema real, isso viria do backend)
    // setTimeout(function() {
    //     showNotification('Novo desafio disponível!', 'info');
    // }, 3000);
});

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