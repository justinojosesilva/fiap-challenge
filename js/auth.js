/**
 * Módulo de autenticação para o Sistema de Gamificação
 * Gerencia login, logout e verificação de sessão
 */

// Usuários de exemplo para demonstração
const USERS = [
    { username: 'vendedor', password: '123456', role: 'vendedor', nome: 'João Vendedor', loja: 'Loja Central' },
    { username: 'gestor', password: '123456', role: 'gestor', nome: 'Maria Gestora', loja: 'Loja Central' },
    { username: 'admin', password: '123456', role: 'admin', nome: 'Admin Sistema', loja: 'Corporativo' }
];

/**
 * Realiza o login do usuário
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 * @returns {Object|null} - Dados do usuário ou null se falhar
 */
function login(username, password) {
    // Verificar credenciais
    const user = USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Criar objeto de usuário sem a senha
        const userData = {
            username: user.username,
            role: user.role,
            nome: user.nome,
            loja: user.loja
        };
        
        // Armazenar na sessão
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Definir tempo de expiração (2 horas)
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);
        sessionStorage.setItem('sessionExpires', expiration.getTime());
        
        return userData;
    }
    
    return null;
}

/**
 * Realiza o logout do usuário
 */
function logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionExpires');
    window.location.href = '../../index.html';
}

/**
 * Verifica se o usuário está autenticado
 * @returns {Object|null} - Dados do usuário ou null se não autenticado
 */
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    const expires = sessionStorage.getItem('sessionExpires');
    
    // Verificar se existe usuário e se a sessão não expirou
    if (userData && expires) {
        if (new Date().getTime() < parseInt(expires)) {
            return JSON.parse(userData);
        } else {
            // Sessão expirada
            logout();
        }
    }
    
    return null;
}

/**
 * Verifica se o usuário tem permissão para acessar uma página
 * @param {Array} allowedRoles - Papéis permitidos
 * @returns {boolean} - true se tem permissão, false caso contrário
 */
function checkPermission(allowedRoles) {
    const user = getCurrentUser();
    
    if (!user) {
        return false;
    }
    
    return allowedRoles.includes(user.role);
}

// Exportar funções para uso global
window.Auth = {
    login,
    logout,
    getCurrentUser,
    checkPermission
};