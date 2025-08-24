/**
 * Dashboard Gestor - Sistema de Gamificação
 * Script responsável por gerenciar as funcionalidades do painel do gestor
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
       
    // Inicializa os dados do dashboard
    carregarDadosDashboard('mes'); // Carrega dados do mês atual por padrão
    
    // Configura os filtros de período
    document.querySelectorAll('.periodo-filtro').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const periodo = this.getAttribute('data-periodo');
            document.getElementById('periodoDropdown').innerHTML = `<i data-feather="calendar"></i> ${this.textContent}`;
            feather.replace();
            carregarDadosDashboard(periodo);
        });
    });
    
    // Configura o botão de exportar relatório
    document.getElementById('exportarRelatorio').addEventListener('click', function() {
        exportarRelatorio();
    });
});

/**
 * Carrega os dados do dashboard com base no período selecionado
 * @param {string} periodo - Período para filtrar os dados (dia, semana, mes, trimestre, ano)
 */
function carregarDadosDashboard(periodo) {
    // Simulação de dados - Em um ambiente real, estes dados viriam de uma API
    const dadosSimulados = gerarDadosSimulados(periodo);
    
    // Atualiza os cards principais
    atualizarCardsPrincipais(dadosSimulados);
    
    // Atualiza os gráficos
    criarGraficoVendasPorPeriodo(dadosSimulados.vendasPorPeriodo);
    criarGraficoProdutosMaisVendidos(dadosSimulados.produtosMaisVendidos);
    
    // Atualiza a tabela de top vendedores
    atualizarTabelaTopVendedores(dadosSimulados.topVendedores);
    
    // Atualiza os alertas e insights
    atualizarAlertasInsights(dadosSimulados.alertas);
}

/**
 * Atualiza os cards principais com os dados fornecidos
 * @param {Object} dados - Dados para atualizar os cards
 */
function atualizarCardsPrincipais(dados) {
    // Total de vendas
    document.getElementById('totalVendas').textContent = formatarMoeda(dados.totalVendas);
    const crescimentoVendas = document.getElementById('crescimentoVendas');
    crescimentoVendas.innerHTML = `<i data-feather="${dados.crescimentoVendas >= 0 ? 'arrow-up' : 'arrow-down'}"></i> ${Math.abs(dados.crescimentoVendas)}% vs período anterior`;
    crescimentoVendas.className = `card-text text-${dados.crescimentoVendas >= 0 ? 'success' : 'danger'}`;
    
    // Quantidade de vendas
    document.getElementById('qtdVendas').textContent = dados.qtdVendas;
    const crescimentoQtd = document.getElementById('crescimentoQtd');
    crescimentoQtd.innerHTML = `<i data-feather="${dados.crescimentoQtd >= 0 ? 'arrow-up' : 'arrow-down'}"></i> ${Math.abs(dados.crescimentoQtd)}% vs período anterior`;
    crescimentoQtd.className = `card-text text-${dados.crescimentoQtd >= 0 ? 'success' : 'danger'}`;
    
    // Ticket médio
    document.getElementById('ticketMedio').textContent = formatarMoeda(dados.ticketMedio);
    const crescimentoTicket = document.getElementById('crescimentoTicket');
    crescimentoTicket.innerHTML = `<i data-feather="${dados.crescimentoTicket >= 0 ? 'arrow-up' : 'arrow-down'}"></i> ${Math.abs(dados.crescimentoTicket)}% vs período anterior`;
    crescimentoTicket.className = `card-text text-${dados.crescimentoTicket >= 0 ? 'success' : 'danger'}`;
    
    // Pontuação média
    document.getElementById('pontuacaoMedia').textContent = dados.pontuacaoMedia;
    const crescimentoPontuacao = document.getElementById('crescimentoPontuacao');
    crescimentoPontuacao.innerHTML = `<i data-feather="${dados.crescimentoPontuacao >= 0 ? 'arrow-up' : 'arrow-down'}"></i> ${Math.abs(dados.crescimentoPontuacao)}% vs período anterior`;
    crescimentoPontuacao.className = `card-text text-${dados.crescimentoPontuacao >= 0 ? 'success' : 'danger'}`;
    
    // Reinicializa os ícones
    feather.replace();
}

/**
 * Cria o gráfico de vendas por período
 * @param {Array} dados - Dados para o gráfico de vendas por período
 */
function criarGraficoVendasPorPeriodo(dados) {
    const ctx = document.getElementById('vendasPorPeriodo').getContext('2d');
    
    // Destrói o gráfico anterior se existir
    if (window.graficoVendasPorPeriodo) {
        window.graficoVendasPorPeriodo.destroy();
    }
    
    window.graficoVendasPorPeriodo = new Chart(ctx, {
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
                            return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                        }
                    }
                }
            }
        }
    });
}

/**
 * Cria o gráfico de produtos mais vendidos
 * @param {Array} dados - Dados para o gráfico de produtos mais vendidos
 */
function criarGraficoProdutosMaisVendidos(dados) {
    const ctx = document.getElementById('produtosMaisVendidos').getContext('2d');
    
    // Destrói o gráfico anterior se existir
    if (window.graficoProdutosMaisVendidos) {
        window.graficoProdutosMaisVendidos.destroy();
    }
    
    window.graficoProdutosMaisVendidos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.map(item => item.produto),
            datasets: [{
                data: dados.map(item => item.quantidade),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Atualiza a tabela de top vendedores
 * @param {Array} vendedores - Lista de vendedores para exibir na tabela
 */
function atualizarTabelaTopVendedores(vendedores) {
    const tbody = document.getElementById('topVendedores');
    tbody.innerHTML = '';
    
    vendedores.forEach((vendedor, index) => {
        const tr = document.createElement('tr');
        
        // Determina o status com base na meta
        const statusClass = vendedor.status === 'Acima da meta' ? 'success' : 
                           vendedor.status === 'Na meta' ? 'warning' : 'danger';
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${vendedor.nome}</td>
            <td>${vendedor.loja}</td>
            <td>${formatarMoeda(vendedor.vendas)}</td>
            <td>${vendedor.qtdVendas}</td>
            <td>${vendedor.pontos}</td>
            <td>${vendedor.nivel}</td>
            <td><span class="badge bg-${statusClass}">${vendedor.status}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Atualiza os alertas e insights
 * @param {Array} alertas - Lista de alertas e insights para exibir
 */
function atualizarAlertasInsights(alertas) {
    const container = document.getElementById('alertasContainer');
    container.innerHTML = '';
    
    alertas.forEach(alerta => {
        const alertaEl = document.createElement('div');
        alertaEl.className = `alert alert-${alerta.tipo} d-flex align-items-center`;
        
        let icone = 'info';
        if (alerta.tipo === 'warning') icone = 'alert-triangle';
        if (alerta.tipo === 'danger') icone = 'alert-octagon';
        if (alerta.tipo === 'success') icone = 'check-circle';
        
        alertaEl.innerHTML = `
            <i data-feather="${icone}" class="me-2"></i>
            <div>${alerta.mensagem}</div>
        `;
        
        container.appendChild(alertaEl);
    });
    
    // Reinicializa os ícones
    feather.replace();
}

/**
 * Exporta o relatório atual
 */
function exportarRelatorio() {
    // Simulação de exportação - Em um ambiente real, isso geraria um PDF ou Excel
    alert('Relatório exportado com sucesso!');
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
 * Gera dados simulados para o dashboard
 * @param {string} periodo - Período para gerar os dados
 * @returns {Object} - Objeto com todos os dados simulados
 */
function gerarDadosSimulados(periodo) {
    // Dados base que seriam obtidos de uma API em um ambiente real
    const dadosBase = {
        dia: {
            totalVendas: 12500,
            qtdVendas: 45,
            crescimentoVendas: 5,
            crescimentoQtd: 8,
            crescimentoTicket: -2,
            crescimentoPontuacao: 10
        },
        semana: {
            totalVendas: 87500,
            qtdVendas: 320,
            crescimentoVendas: 12,
            crescimentoQtd: 15,
            crescimentoTicket: 3,
            crescimentoPontuacao: 8
        },
        mes: {
            totalVendas: 375000,
            qtdVendas: 1250,
            crescimentoVendas: 8,
            crescimentoQtd: 5,
            crescimentoTicket: 2,
            crescimentoPontuacao: 15
        },
        trimestre: {
            totalVendas: 1125000,
            qtdVendas: 3750,
            crescimentoVendas: 15,
            crescimentoQtd: 12,
            crescimentoTicket: 5,
            crescimentoPontuacao: 20
        },
        ano: {
            totalVendas: 4500000,
            qtdVendas: 15000,
            crescimentoVendas: 25,
            crescimentoQtd: 20,
            crescimentoTicket: 8,
            crescimentoPontuacao: 30
        }
    };
    
    // Seleciona os dados base de acordo com o período
    const dados = dadosBase[periodo];
    
    // Calcula o ticket médio
    dados.ticketMedio = dados.totalVendas / dados.qtdVendas;
    
    // Pontuação média dos vendedores
    dados.pontuacaoMedia = Math.floor(Math.random() * 500) + 500;
    
    // Gera dados para o gráfico de vendas por período
    dados.vendasPorPeriodo = gerarDadosVendasPorPeriodo(periodo);
    
    // Gera dados para o gráfico de produtos mais vendidos
    dados.produtosMaisVendidos = [
        { produto: 'Smartphone XYZ', quantidade: 350 },
        { produto: 'Notebook ABC', quantidade: 280 },
        { produto: 'Smart TV 4K', quantidade: 220 },
        { produto: 'Fone Bluetooth', quantidade: 180 },
        { produto: 'Tablet Premium', quantidade: 150 }
    ];
    
    // Gera dados para a tabela de top vendedores
    dados.topVendedores = [
        { nome: 'Carlos Silva', loja: 'Shopping Center Norte', vendas: 85000, qtdVendas: 320, pontos: 950, nivel: 'Diamante', status: 'Acima da meta' },
        { nome: 'Ana Oliveira', loja: 'Shopping Ibirapuera', vendas: 78000, qtdVendas: 290, pontos: 880, nivel: 'Diamante', status: 'Acima da meta' },
        { nome: 'Roberto Santos', loja: 'Shopping Eldorado', vendas: 65000, qtdVendas: 250, pontos: 750, nivel: 'Ouro', status: 'Na meta' },
        { nome: 'Juliana Costa', loja: 'Shopping Morumbi', vendas: 62000, qtdVendas: 230, pontos: 720, nivel: 'Ouro', status: 'Na meta' },
        { nome: 'Fernando Lima', loja: 'Shopping Anália Franco', vendas: 45000, qtdVendas: 180, pontos: 550, nivel: 'Prata', status: 'Abaixo da meta' }
    ];
    
    // Gera alertas e insights
    dados.alertas = [
        { tipo: 'success', mensagem: 'Vendas de smartphones aumentaram 20% este mês!' },
        { tipo: 'info', mensagem: 'A loja Shopping Center Norte está liderando em vendas pelo terceiro mês consecutivo.' },
        { tipo: 'warning', mensagem: 'A loja Shopping Anália Franco está 15% abaixo da meta mensal.' },
        { tipo: 'danger', mensagem: 'Estoque de Notebook ABC está em nível crítico (apenas 5 unidades).' }
    ];
    
    return dados;
}

/**
 * Gera dados para o gráfico de vendas por período
 * @param {string} periodo - Período para gerar os dados
 * @returns {Array} - Array com os dados de vendas por período
 */
function gerarDadosVendasPorPeriodo(periodo) {
    let dados = [];
    let periodos = [];
    
    // Define os períodos com base no filtro selecionado
    switch (periodo) {
        case 'dia':
            periodos = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
            break;
        case 'semana':
            periodos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
            break;
        case 'mes':
            periodos = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
            break;
        case 'trimestre':
            periodos = ['Janeiro', 'Fevereiro', 'Março'];
            break;
        case 'ano':
            periodos = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            break;
    }
    
    // Gera valores aleatórios para cada período
    periodos.forEach(p => {
        dados.push({
            periodo: p,
            valor: Math.floor(Math.random() * 50000) + 10000
        });
    });
    
    return dados;
}