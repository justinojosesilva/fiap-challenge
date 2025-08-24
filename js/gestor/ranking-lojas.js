/**
 * Ranking de Lojas - Sistema de Gamificação
 * Script responsável por gerenciar as funcionalidades do ranking de lojas e franquias
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones Feather
    feather.replace();
    
    // Verifica autenticação
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'gestor' && currentUser.role !== 'admin')) {
        window.location.href = '../../index.html';
        return;
    }
    
    // Carrega os dados do ranking
    carregarDadosRanking();
    
    // Configura o botão de filtrar
    document.getElementById('filtrarBtn').addEventListener('click', function() {
        carregarDadosRanking();
    });
    
    // Configura os filtros de período
    document.querySelectorAll('.periodo-filtro').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const periodo = this.getAttribute('data-periodo');
            document.getElementById('periodoDropdown').innerHTML = `<i data-feather="calendar"></i> ${this.textContent}`;
            feather.replace();
            carregarDadosRanking();
        });
    });
    
    // Configura o botão de exportar ranking
    document.getElementById('exportarRanking').addEventListener('click', function() {
        exportarRanking();
    });
    
    // Configura o switch de mostrar detalhes
    document.getElementById('mostrarDetalhes').addEventListener('change', function() {
        carregarDadosRanking();
    });
    
    // Configura o botão de ver relatório completo
    document.getElementById('verRelatorioCompleto').addEventListener('click', function() {
        alert('Funcionalidade de relatório completo será implementada em breve!');
    });
    
    // Cria o gráfico comparativo
    criarGraficoComparativo();
});

/**
 * Carrega os dados do ranking com base nos filtros selecionados
 */
function carregarDadosRanking() {
    // Obtém os valores dos filtros
    const tipoRanking = document.getElementById('tipoRanking').value;
    const regiaoRanking = document.getElementById('regiaoRanking').value;
    const tipoLoja = document.getElementById('tipoLoja').value;
    const mostrarDetalhes = document.getElementById('mostrarDetalhes').checked;
    
    // Simulação de dados - Em um ambiente real, estes dados viriam de uma API
    const dadosSimulados = gerarDadosSimulados(tipoRanking, regiaoRanking, tipoLoja);
    
    // Atualiza o pódio
    atualizarPodio(dadosSimulados.slice(0, 3));
    
    // Atualiza a tabela de ranking
    atualizarTabelaRanking(dadosSimulados, mostrarDetalhes);
    
    // Atualiza o gráfico comparativo
    atualizarGraficoComparativo(dadosSimulados.slice(0, 5));
}

/**
 * Atualiza o pódio com os três primeiros colocados
 * @param {Array} topTres - Os três primeiros colocados no ranking
 */
function atualizarPodio(topTres) {
    if (topTres.length >= 1) {
        document.getElementById('firstPlaceName').textContent = topTres[0].nome;
        document.getElementById('firstPlacePoints').textContent = `${topTres[0].pontos.toLocaleString('pt-BR')} pts`;
    }
    
    if (topTres.length >= 2) {
        document.getElementById('secondPlaceName').textContent = topTres[1].nome;
        document.getElementById('secondPlacePoints').textContent = `${topTres[1].pontos.toLocaleString('pt-BR')} pts`;
    }
    
    if (topTres.length >= 3) {
        document.getElementById('thirdPlaceName').textContent = topTres[2].nome;
        document.getElementById('thirdPlacePoints').textContent = `${topTres[2].pontos.toLocaleString('pt-BR')} pts`;
    }
}

/**
 * Atualiza a tabela de ranking com os dados fornecidos
 * @param {Array} dados - Dados para a tabela de ranking
 * @param {boolean} mostrarDetalhes - Indica se deve mostrar detalhes adicionais
 */
function atualizarTabelaRanking(dados, mostrarDetalhes) {
    const tbody = document.getElementById('rankingTable');
    tbody.innerHTML = '';
    
    dados.forEach((loja, index) => {
        const tr = document.createElement('tr');
        
        // Determina o status com base na meta
        const statusClass = loja.status === 'Acima da meta' ? 'success' : 
                           loja.status === 'Na meta' ? 'warning' : 'danger';
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${loja.nome}</td>
            <td>${loja.tipo}</td>
            <td>${loja.regiao}</td>
            <td>${formatarMoeda(loja.vendas)}</td>
            <td>${formatarMoeda(loja.ticketMedio)}</td>
            <td>${loja.pontos.toLocaleString('pt-BR')}</td>
            <td>${loja.nivel}</td>
            <td><span class="badge bg-${statusClass}">${loja.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-detalhes" data-loja-id="${loja.id}">
                    <i data-feather="eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Reinicializa os ícones
    feather.replace();
    
    // Configura os botões de detalhes
    configurarBotoesDetalhes();
}

/**
 * Configura os botões de detalhes para abrir o modal
 */
function configurarBotoesDetalhes() {
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', function() {
            const lojaId = this.getAttribute('data-loja-id');
            abrirModalDetalhes(lojaId);
        });
    });
}

/**
 * Abre o modal de detalhes da loja
 * @param {string} lojaId - ID da loja para exibir detalhes
 */
function abrirModalDetalhes(lojaId) {
    // Simulação de dados - Em um ambiente real, estes dados viriam de uma API
    const loja = obterDetalhesLoja(lojaId);
    
    // Preenche os dados do modal
    document.getElementById('lojaDetalhesModalLabel').textContent = `Detalhes da Loja: ${loja.nome}`;
    document.getElementById('modalLojaNome').textContent = loja.nome;
    document.getElementById('modalLojaTipo').textContent = loja.tipo;
    document.getElementById('modalLojaRegiao').textContent = loja.regiao;
    document.getElementById('modalLojaGerente').textContent = loja.gerente;
    document.getElementById('modalLojaNivel').textContent = loja.nivel;
    document.getElementById('modalLojaVendas').textContent = formatarMoeda(loja.vendas);
    document.getElementById('modalLojaTicket').textContent = formatarMoeda(loja.ticketMedio);
    document.getElementById('modalLojaPontos').textContent = loja.pontos.toLocaleString('pt-BR') + ' pts';
    document.getElementById('modalLojaCrescimento').textContent = `${loja.crescimento}% vs período anterior`;
    
    // Determina o status com base na meta
    const statusClass = loja.status === 'Acima da meta' ? 'success' : 
                       loja.status === 'Na meta' ? 'warning' : 'danger';
    document.getElementById('modalLojaStatus').innerHTML = `<span class="badge bg-${statusClass}">${loja.status}</span>`;
    
    // Preenche a tabela de vendedores
    const tbodyVendedores = document.getElementById('modalLojaVendedores');
    tbodyVendedores.innerHTML = '';
    
    loja.vendedores.forEach((vendedor, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${vendedor.nome}</td>
            <td>${formatarMoeda(vendedor.vendas)}</td>
            <td>${vendedor.pontos.toLocaleString('pt-BR')}</td>
            <td>${vendedor.nivel}</td>
        `;
        tbodyVendedores.appendChild(tr);
    });
    
    // Cria o gráfico de evolução
    criarGraficoEvolucao(loja.evolucao);
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('lojaDetalhesModal'));
    modal.show();
}

/**
 * Cria o gráfico de evolução de vendas da loja
 * @param {Array} dados - Dados para o gráfico de evolução
 */
function criarGraficoEvolucao(dados) {
    const ctx = document.getElementById('modalLojaEvolucao').getContext('2d');
    
    // Destrói o gráfico anterior se existir
    if (window.graficoEvolucao) {
        window.graficoEvolucao.destroy();
    }
    
    window.graficoEvolucao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dados.map(item => item.periodo),
            datasets: [{
                label: 'Vendas (R$)',
                data: dados.map(item => item.valor),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
                        }
                    }
                }
            }
        }
    });
}

/**
 * Cria o gráfico comparativo de lojas
 */
function criarGraficoComparativo() {
    const ctx = document.getElementById('comparativoLojas').getContext('2d');
    
    // Dados iniciais vazios
    window.graficoComparativo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Pontos',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Atualiza o gráfico comparativo com os dados fornecidos
 * @param {Array} dados - Dados para o gráfico comparativo
 */
function atualizarGraficoComparativo(dados) {
    // Atualiza os dados do gráfico
    window.graficoComparativo.data.labels = dados.map(item => item.nome);
    window.graficoComparativo.data.datasets[0].data = dados.map(item => item.pontos);
    
    // Atualiza o tipo de dados exibido com base no filtro
    const tipoRanking = document.getElementById('tipoRanking').value;
    let label = 'Pontos';
    let backgroundColor = 'rgba(54, 162, 235, 0.7)';
    let borderColor = 'rgba(54, 162, 235, 1)';
    
    switch (tipoRanking) {
        case 'vendas':
            label = 'Vendas (R$)';
            backgroundColor = 'rgba(75, 192, 192, 0.7)';
            borderColor = 'rgba(75, 192, 192, 1)';
            window.graficoComparativo.data.datasets[0].data = dados.map(item => item.vendas);
            break;
        case 'ticket':
            label = 'Ticket Médio (R$)';
            backgroundColor = 'rgba(153, 102, 255, 0.7)';
            borderColor = 'rgba(153, 102, 255, 1)';
            window.graficoComparativo.data.datasets[0].data = dados.map(item => item.ticketMedio);
            break;
        case 'desafios':
            label = 'Desafios Concluídos';
            backgroundColor = 'rgba(255, 159, 64, 0.7)';
            borderColor = 'rgba(255, 159, 64, 1)';
            window.graficoComparativo.data.datasets[0].data = dados.map(item => item.desafiosConcluidos);
            break;
        case 'crescimento':
            label = 'Crescimento (%)';
            backgroundColor = 'rgba(255, 99, 132, 0.7)';
            borderColor = 'rgba(255, 99, 132, 1)';
            window.graficoComparativo.data.datasets[0].data = dados.map(item => item.crescimento);
            break;
    }
    
    window.graficoComparativo.data.datasets[0].label = label;
    window.graficoComparativo.data.datasets[0].backgroundColor = backgroundColor;
    window.graficoComparativo.data.datasets[0].borderColor = borderColor;
    
    // Atualiza o gráfico
    window.graficoComparativo.update();
}

/**
 * Exporta o ranking atual
 */
function exportarRanking() {
    // Simulação de exportação - Em um ambiente real, isso geraria um PDF ou Excel
    alert('Ranking exportado com sucesso!');
}

/**
 * Formata um valor para moeda brasileira
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
function formatarMoeda(valor) {
    return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

/**
 * Gera dados simulados para o ranking
 * @param {string} tipoRanking - Tipo de ranking selecionado
 * @param {string} regiaoRanking - Região selecionada
 * @param {string} tipoLoja - Tipo de loja selecionado
 * @returns {Array} - Array com os dados simulados
 */
function gerarDadosSimulados(tipoRanking, regiaoRanking, tipoLoja) {
    // Dados base que seriam obtidos de uma API em um ambiente real
    const lojas = [
        { id: '1', nome: 'Shopping Norte', tipo: 'Franquia', regiao: 'norte', vendas: 850000, ticketMedio: 350, pontos: 9850, nivel: 'Diamante', status: 'Acima da meta', desafiosConcluidos: 45, crescimento: 15 },
        { id: '2', nome: 'Shopping Sul', tipo: 'Franquia', regiao: 'sul', vendas: 780000, ticketMedio: 320, pontos: 8750, nivel: 'Ouro', status: 'Acima da meta', desafiosConcluidos: 38, crescimento: 12 },
        { id: '3', nome: 'Loja Centro', tipo: 'Própria', regiao: 'centro', vendas: 720000, ticketMedio: 280, pontos: 7500, nivel: 'Ouro', status: 'Na meta', desafiosConcluidos: 35, crescimento: 8 },
        { id: '4', nome: 'Shopping Leste', tipo: 'Franquia', regiao: 'leste', vendas: 650000, ticketMedio: 300, pontos: 6800, nivel: 'Prata', status: 'Na meta', desafiosConcluidos: 30, crescimento: 5 },
        { id: '5', nome: 'Loja Oeste', tipo: 'Própria', regiao: 'oeste', vendas: 580000, ticketMedio: 250, pontos: 6200, nivel: 'Prata', status: 'Na meta', desafiosConcluidos: 28, crescimento: 3 },
        { id: '6', nome: 'Quiosque Centro', tipo: 'Quiosque', regiao: 'centro', vendas: 320000, ticketMedio: 180, pontos: 4500, nivel: 'Bronze', status: 'Abaixo da meta', desafiosConcluidos: 20, crescimento: -2 },
        { id: '7', nome: 'Franquia Oeste', tipo: 'Franquia', regiao: 'oeste', vendas: 450000, ticketMedio: 220, pontos: 5800, nivel: 'Prata', status: 'Abaixo da meta', desafiosConcluidos: 25, crescimento: 1 },
        { id: '8', nome: 'Loja Norte', tipo: 'Própria', regiao: 'norte', vendas: 520000, ticketMedio: 240, pontos: 6000, nivel: 'Prata', status: 'Na meta', desafiosConcluidos: 27, crescimento: 4 },
        { id: '9', nome: 'Quiosque Sul', tipo: 'Quiosque', regiao: 'sul', vendas: 280000, ticketMedio: 160, pontos: 3800, nivel: 'Bronze', status: 'Abaixo da meta', desafiosConcluidos: 18, crescimento: -5 },
        { id: '10', nome: 'Franquia Leste', tipo: 'Franquia', regiao: 'leste', vendas: 420000, ticketMedio: 210, pontos: 5500, nivel: 'Prata', status: 'Abaixo da meta', desafiosConcluidos: 24, crescimento: 0 }
    ];
    
    // Filtra por região
    let lojasFiltradas = lojas;
    if (regiaoRanking !== 'todas') {
        lojasFiltradas = lojasFiltradas.filter(loja => loja.regiao === regiaoRanking);
    }
    
    // Filtra por tipo de loja
    if (tipoLoja !== 'todas') {
        lojasFiltradas = lojasFiltradas.filter(loja => {
            if (tipoLoja === 'proprias') return loja.tipo === 'Própria';
            if (tipoLoja === 'franquias') return loja.tipo === 'Franquia';
            if (tipoLoja === 'quiosques') return loja.tipo === 'Quiosque';
            return true;
        });
    }
    
    // Ordena por tipo de ranking
    switch (tipoRanking) {
        case 'pontos':
            lojasFiltradas.sort((a, b) => b.pontos - a.pontos);
            break;
        case 'vendas':
            lojasFiltradas.sort((a, b) => b.vendas - a.vendas);
            break;
        case 'ticket':
            lojasFiltradas.sort((a, b) => b.ticketMedio - a.ticketMedio);
            break;
        case 'desafios':
            lojasFiltradas.sort((a, b) => b.desafiosConcluidos - a.desafiosConcluidos);
            break;
        case 'crescimento':
            lojasFiltradas.sort((a, b) => b.crescimento - a.crescimento);
            break;
    }
    
    return lojasFiltradas;
}

/**
 * Obtém os detalhes de uma loja específica
 * @param {string} lojaId - ID da loja
 * @returns {Object} - Objeto com os detalhes da loja
 */
function obterDetalhesLoja(lojaId) {
    // Dados base que seriam obtidos de uma API em um ambiente real
    const lojas = {
        '1': {
            id: '1',
            nome: 'Shopping Norte',
            tipo: 'Franquia',
            regiao: 'Norte',
            gerente: 'Ricardo Almeida',
            vendas: 850000,
            ticketMedio: 350,
            pontos: 9850,
            nivel: 'Diamante',
            status: 'Acima da meta',
            desafiosConcluidos: 45,
            crescimento: 15,
            vendedores: [
                { nome: 'Carlos Silva', vendas: 180000, pontos: 2100, nivel: 'Diamante' },
                { nome: 'Ana Oliveira', vendas: 165000, pontos: 1950, nivel: 'Diamante' },
                { nome: 'Roberto Santos', vendas: 150000, pontos: 1800, nivel: 'Ouro' },
                { nome: 'Juliana Costa', vendas: 140000, pontos: 1650, nivel: 'Ouro' },
                { nome: 'Fernando Lima', vendas: 125000, pontos: 1500, nivel: 'Prata' }
            ],
            evolucao: [
                { periodo: 'Jan', valor: 650000 },
                { periodo: 'Fev', valor: 680000 },
                { periodo: 'Mar', valor: 720000 },
                { periodo: 'Abr', valor: 750000 },
                { periodo: 'Mai', valor: 780000 },
                { periodo: 'Jun', valor: 850000 }
            ]
        },
        '2': {
            id: '2',
            nome: 'Shopping Sul',
            tipo: 'Franquia',
            regiao: 'Sul',
            gerente: 'Mariana Souza',
            vendas: 780000,
            ticketMedio: 320,
            pontos: 8750,
            nivel: 'Ouro',
            status: 'Acima da meta',
            desafiosConcluidos: 38,
            crescimento: 12,
            vendedores: [
                { nome: 'Pedro Oliveira', vendas: 170000, pontos: 2000, nivel: 'Diamante' },
                { nome: 'Camila Santos', vendas: 155000, pontos: 1850, nivel: 'Ouro' },
                { nome: 'Lucas Ferreira', vendas: 140000, pontos: 1700, nivel: 'Ouro' },
                { nome: 'Amanda Costa', vendas: 130000, pontos: 1550, nivel: 'Prata' },
                { nome: 'Gustavo Lima', vendas: 115000, pontos: 1400, nivel: 'Prata' }
            ],
            evolucao: [
                { periodo: 'Jan', valor: 600000 },
                { periodo: 'Fev', valor: 650000 },
                { periodo: 'Mar', valor: 680000 },
                { periodo: 'Abr', valor: 720000 },
                { periodo: 'Mai', valor: 750000 },
                { periodo: 'Jun', valor: 780000 }
            ]
        },
        '3': {
            id: '3',
            nome: 'Loja Centro',
            tipo: 'Própria',
            regiao: 'Centro',
            gerente: 'Paulo Mendes',
            vendas: 720000,
            ticketMedio: 280,
            pontos: 7500,
            nivel: 'Ouro',
            status: 'Na meta',
            desafiosConcluidos: 35,
            crescimento: 8,
            vendedores: [
                { nome: 'Fernanda Silva', vendas: 160000, pontos: 1900, nivel: 'Ouro' },
                { nome: 'Rafael Oliveira', vendas: 145000, pontos: 1750, nivel: 'Ouro' },
                { nome: 'Carla Santos', vendas: 130000, pontos: 1600, nivel: 'Prata' },
                { nome: 'Bruno Costa', vendas: 120000, pontos: 1450, nivel: 'Prata' },
                { nome: 'Daniela Lima', vendas: 105000, pontos: 1300, nivel: 'Bronze' }
            ],
            evolucao: [
                { periodo: 'Jan', valor: 550000 },
                { periodo: 'Fev', valor: 580000 },
                { periodo: 'Mar', valor: 620000 },
                { periodo: 'Abr', valor: 650000 },
                { periodo: 'Mai', valor: 680000 },
                { periodo: 'Jun', valor: 720000 }
            ]
        }
    };
    
    // Retorna os detalhes da loja ou um objeto vazio se não encontrar
    return lojas[lojaId] || {};
}