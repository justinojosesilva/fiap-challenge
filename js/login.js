/**
 * Script para gerenciar o processo de login
 * Valida as credenciais e redireciona para o dashboard apropriado
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    // Verificar se já existe uma sessão ativa
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        // Redirecionar para o dashboard apropriado
        redirecionarUsuario(currentUser);
        return;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Usar o módulo de autenticação para fazer login
        const user = Auth.login(username, password);
        
        if (user) {
            // Redirecionar para o dashboard apropriado
            redirecionarUsuario(user);
        } else {
            // Mostrar mensagem de erro
            loginError.classList.remove('d-none');
            
            // Limpar senha
            document.getElementById('password').value = '';
        }
    });
});

/**
 * Redireciona o usuário para o dashboard apropriado com base no seu papel
 * @param {Object} user - Dados do usuário
 */
function redirecionarUsuario(user) {
    if (user.role === 'vendedor') {
        window.location.href = 'pages/vendedor/dashboard-vendedor.html';
    } else if (user.role === 'gestor') {
        window.location.href = 'pages/gestor/dashboard-gestor.html';
    } else if (user.role === 'admin') {
        window.location.href = 'pages/dashboard-admin.html';
    }
}