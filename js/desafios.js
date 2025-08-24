/**
 * Script para gerenciar o cadastro e edição de desafios
 * Implementa validação de formulário e manipulação de dados
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones Feather
    feather.replace();
    
    // Verificar autenticação e permissões
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'gerente')) {
        window.location.href = '../index.html';
        return;
    }
    
    // Configurar data mínima para hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataInicio').min = today;
    document.getElementById('dataFim').min = today;
    
    // Validar que a data final é posterior à data inicial
    document.getElementById('dataInicio').addEventListener('change', function() {
        document.getElementById('dataFim').min = this.value;
    });
    
    // Manipular envio do formulário
    const desafioForm = document.getElementById('desafioForm');
    if (desafioForm) {
        desafioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const desafio = {
                nome: document.getElementById('nomeDesafio').value,
                descricao: document.getElementById('descricaoDesafio').value,
                meta: document.getElementById('metaDesafio').value,
                pontos: document.getElementById('pontosDesafio').value,
                dataInicio: document.getElementById('dataInicio').value,
                dataFim: document.getElementById('dataFim').value,
                tipo: document.getElementById('tipoDesafio').value,
                loja: document.getElementById('lojaDesafio').value,
                id: new Date().getTime() // ID temporário para simulação
            };
            
            // Em um sistema real, enviaríamos para o backend
            // Aqui vamos simular salvando no localStorage
            salvarDesafio(desafio);
            
            // Mostrar mensagem de sucesso
            showNotification('Desafio cadastrado com sucesso!', 'success');
            
            // Limpar formulário
            desafioForm.reset();
            
            // Atualizar tabela (em um sistema real, isso seria feito via API)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }
    
    // Botão cancelar
    const cancelarBtn = document.getElementById('cancelarBtn');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            desafioForm.reset();
        });
    }
    
    // Configurar botões de edição e exclusão
    configurarBotoesAcao();
});

/**
 * Salva um desafio no localStorage (simulação de backend)
 * @param {Object} desafio - Objeto com dados do desafio
 */
function salvarDesafio(desafio) {
    // Obter desafios existentes
    let desafios = JSON.parse(localStorage.getItem('desafios')) || [];
    
    // Verificar se é edição ou novo
    const index = desafios.findIndex(d => d.id === desafio.id);
    
    if (index >= 0) {
        // Atualizar existente
        desafios[index] = desafio;
    } else {
        // Adicionar novo
        desafios.push(desafio);
    }
    
    // Salvar no localStorage
    localStorage.setItem('desafios', JSON.stringify(desafios));
}

/**
 * Configura os botões de edição e exclusão na tabela de desafios
 */
function configurarBotoesAcao() {
    // Botões de edição
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const nome = row.cells[0].textContent;
            
            // Em um sistema real, buscaríamos os dados completos via API
            // Aqui vamos apenas mostrar uma mensagem
            alert(`Edição do desafio "${nome}" seria implementada aqui.`);
        });
    });
    
    // Botões de exclusão
    document.querySelectorAll('.btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const nome = row.cells[0].textContent;
            
            if (confirm(`Tem certeza que deseja excluir o desafio "${nome}"?`)) {
                // Em um sistema real, enviaríamos para o backend
                // Aqui vamos apenas remover a linha da tabela
                row.remove();
                showNotification('Desafio excluído com sucesso!', 'success');
            }
        });
    });
}