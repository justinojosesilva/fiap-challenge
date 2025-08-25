/**
 * Script para gerenciar a página de ranking
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones Feather
    feather.replace();
    
    // Verificar autenticação
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    // Atualizar nome do usuário na barra de navegação
    document.getElementById('username').textContent = currentUser.nome || currentUser.username;
    
    // Configurar evento de logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        Auth.logout();
    });
    
    // Destacar a linha do usuário atual na tabela
    highlightCurrentUser();
    
    // Configurar evento para o botão de filtro
    document.getElementById('filtrarBtn').addEventListener('click', function() {
        aplicarFiltros();
    });
});

/**
 * Destaca a linha do usuário atual na tabela de ranking
 */
function highlightCurrentUser() {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) return;
    
    // Na implementação real, você buscaria os dados do servidor
    // Aqui estamos apenas simulando a funcionalidade
    
    // Destacar visualmente a linha do usuário (já está feito via CSS com a classe table-active)
    // Opcionalmente, poderia rolar a tabela até a posição do usuário
    const userRow = document.querySelector('.table-active');
    if (userRow) {
        setTimeout(() => {
            userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}

/**
 * Aplica os filtros selecionados e atualiza o ranking
 */
function aplicarFiltros() {
    const periodo = document.getElementById('periodoRanking').value;
    const tipo = document.getElementById('tipoRanking').value;
    const loja = document.getElementById('lojaRanking').value;
    
    // Exibir notificação de carregamento
    showNotification('Atualizando ranking...', 'info');
    
    // Simular um tempo de carregamento
    setTimeout(() => {
        // Na implementação real, você faria uma requisição ao servidor com os filtros
        // e atualizaria a tabela com os dados recebidos
        
        // Atualizar o período exibido
        atualizarPeriodoExibido(periodo);
        
        // Simular atualização dos dados
        simulateRankingUpdate(tipo, loja);
        
        // Exibir notificação de sucesso
        showNotification('Ranking atualizado com sucesso!', 'success');
    }, 800);
}

/**
 * Atualiza o texto do período exibido no cabeçalho do ranking
 */
function atualizarPeriodoExibido(periodo) {
    const periodoElement = document.querySelector('.ranking-period');
    
    switch(periodo) {
        case 'semanal':
            periodoElement.textContent = 'Semana atual';
            break;
        case 'mensal':
            periodoElement.textContent = 'Julho/2023';
            break;
        case 'trimestral':
            periodoElement.textContent = '2º Trimestre/2023';
            break;
        case 'anual':
            periodoElement.textContent = '2023';
            break;
        case 'geral':
            periodoElement.textContent = 'Todos os tempos';
            break;
    }
}

/**
 * Simula a atualização dos dados do ranking com base nos filtros
 */
function simulateRankingUpdate(tipo, loja) {
    // Esta é uma simulação simplificada
    // Em uma implementação real, você receberia estes dados do servidor
    
    // Dados simulados para diferentes tipos de ranking
    const dadosSimulados = {
        pontos: [
            { posicao: 1, nome: 'Carlos Silva', loja: 'Loja Central', nivel: 5, pontos: 2450 },
            { posicao: 2, nome: 'Ana Oliveira', loja: 'Franquia Shopping', nivel: 4, pontos: 1980 },
            { posicao: 3, nome: 'Roberto Almeida', loja: 'Loja Sul', nivel: 4, pontos: 1875 },
            { posicao: 4, nome: 'Você', loja: 'Loja Central', nivel: 3, pontos: 1250 }
        ],
        desafios: [
            { posicao: 1, nome: 'Ana Oliveira', loja: 'Franquia Shopping', nivel: 4, pontos: 2100 },
            { posicao: 2, nome: 'Carlos Silva', loja: 'Loja Central', nivel: 5, pontos: 1950 },
            { posicao: 3, nome: 'Você', loja: 'Loja Central', nivel: 3, pontos: 1580 },
            { posicao: 4, nome: 'Roberto Almeida', loja: 'Loja Sul', nivel: 4, pontos: 1420 }
        ],
        vendas: [
            { posicao: 1, nome: 'Roberto Almeida', loja: 'Loja Sul', nivel: 4, pontos: 2250 },
            { posicao: 2, nome: 'Carlos Silva', loja: 'Loja Central', nivel: 5, pontos: 2100 },
            { posicao: 3, nome: 'Ana Oliveira', loja: 'Franquia Shopping', nivel: 4, pontos: 1850 },
            { posicao: 4, nome: 'Você', loja: 'Loja Central', nivel: 3, pontos: 1320 }
        ],
        cortes_premium: [
            { posicao: 1, nome: 'Você', loja: 'Loja Central', nivel: 3, pontos: 2400 },
            { posicao: 2, nome: 'Carlos Silva', loja: 'Loja Central', nivel: 5, pontos: 2200 },
            { posicao: 3, nome: 'Ana Oliveira', loja: 'Franquia Shopping', nivel: 4, pontos: 1950 },
            { posicao: 4, nome: 'Roberto Almeida', loja: 'Loja Sul', nivel: 4, pontos: 1680 }
        ]
    };
    
    // Selecionar os dados com base no tipo de ranking
    const dados = dadosSimulados[tipo] || dadosSimulados.pontos;
    
    // Atualizar o pódio
    atualizarPodio(dados);
    
    // Atualizar a tabela de ranking
    atualizarTabelaRanking(dados);
}

/**
 * Atualiza o pódio com os três primeiros colocados
 */
function atualizarPodio(dados) {
    if (dados.length < 3) return;
    
    // Atualizar o primeiro colocado
    const primeiro = document.querySelector('.podium-first');
    primeiro.querySelector('.podium-name').textContent = dados[0].nome;
    primeiro.querySelector('.podium-points').textContent = `${dados[0].pontos} pts`;
    primeiro.querySelector('.podium-level').textContent = `Nível ${dados[0].nivel}`;
    
    // Atualizar o segundo colocado
    const segundo = document.querySelector('.podium-second');
    segundo.querySelector('.podium-name').textContent = dados[1].nome;
    segundo.querySelector('.podium-points').textContent = `${dados[1].pontos} pts`;
    segundo.querySelector('.podium-level').textContent = `Nível ${dados[1].nivel}`;
    
    // Atualizar o terceiro colocado
    const terceiro = document.querySelector('.podium-third');
    terceiro.querySelector('.podium-name').textContent = dados[2].nome;
    terceiro.querySelector('.podium-points').textContent = `${dados[2].pontos} pts`;
    terceiro.querySelector('.podium-level').textContent = `Nível ${dados[2].nivel}`;
}

/**
 * Atualiza a tabela de ranking com os dados fornecidos
 */
function atualizarTabelaRanking(dados) {
    const tbody = document.querySelector('.table tbody');
    
    // Limpar a tabela atual
    tbody.innerHTML = '';
    
    // Adicionar as novas linhas
    dados.forEach(item => {
        const tr = document.createElement('tr');
        
        // Adicionar classe para destacar o usuário atual
        if (item.nome === 'Você') {
            tr.classList.add('table-active');
        } else if (item.posicao === 1) {
            tr.classList.add('table-warning');
        } else if (item.posicao === 2) {
            tr.classList.add('table-secondary');
        } else if (item.posicao === 3) {
            tr.classList.add('table-info');
        }
        
        tr.innerHTML = `
            <td>${item.posicao}</td>
            <td>${item.nome}</td>
            <td>${item.loja}</td>
            <td>${item.nivel}</td>
            <td>${item.pontos}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Exibe uma notificação temporária
 */
function showNotification(message, type = 'info') {
    // Verificar se já existe uma notificação
    let notification = document.querySelector('.notification');
    
    // Se não existir, criar uma nova
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Definir a classe de acordo com o tipo
    notification.className = `notification notification-${type} show`;
    notification.textContent = message;
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.className = notification.className.replace('show', '');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}