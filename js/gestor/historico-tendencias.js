/**
 * Histórico e Tendências - Sistema de Gamificação para Vendas
 * Script para análise de histórico e tendências por gerentes e administradores
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones Feather
    feather.replace();
    
    // Verifica autenticação - apenas gerentes e admins podem acessar
    verificarAutenticacao(['gestor', 'admin']);
    
    // Inicializa o sistema de notificações
    inicializarNotificacoes();
    
    // Configura os links de navegação
    configurarNavegacao();
    
    // Configura os filtros
    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltros);
    
    // Configura o botão de exportar relatório
    document.getElementById('exportarRelatorio').addEventListener('click', exportarRelatorio);
    
    // Configura o botão de exportar tabela
    document.getElementById('exportarTabela').addEventListener('click', exportarTabela);
    
    // Configura as opções de período
    document.querySelectorAll('.periodo-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const dias = parseInt(this.getAttribute('data-periodo'));
            selecionarPeriodo(dias);
        });
    });
    
    // Configura o botão de aplicar período personalizado
    document.getElementById('aplicarPeriodoPersonalizado').addEventListener('click', aplicarPeriodoPersonalizado);
    
    // Configura os botões de tipo de gráfico
    document.querySelectorAll('.tipo-grafico').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tipo-grafico').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            atualizarTipoGrafico(this.getAttribute('data-tipo'));
        });
    });
    
    // Carrega os dados iniciais (últimos 30 dias)
    selecionarPeriodo(30);
});

/**
 * Verifica se o usuário está autenticado e tem permissão para acessar a página
 * @param {Array} perfisPermitidos - Array com os perfis que podem acessar a página
 */
function verificarAutenticacao(perfisPermitidos) {
    // const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // if (!usuarioLogado) {
    //     window.location.href = '../index.html';
    //     return;
    // }
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'gestor' && currentUser.role !== 'admin')) {
        window.location.href = '../../index.html';
        return;
    }
    
    // if (!perfisPermitidos.includes(usuarioLogado.perfil)) {
    //     alert('Você não tem permissão para acessar esta página');
    //     window.location.href = 'dashboard.html';
    // }
    
    // Exibe o nome do usuário logado
    console.log(currentUser);
    //document.querySelector('.navbar-brand').textContent = `Sistema de Gamificação | ${currentUser.nome}`;
}

/**
 * Inicializa o sistema de notificações
 */
function inicializarNotificacoes() {
    // Simulação de notificações
    const notificacoes = [
        { id: 1, titulo: 'Relatório mensal disponível', mensagem: 'O relatório mensal de desempenho está disponível para download', data: '2023-05-15', lida: false },
        { id: 2, titulo: 'Tendência identificada', mensagem: 'Identificamos uma tendência de aumento nas vendas da categoria X', data: '2023-05-14', lida: true },
        { id: 3, titulo: 'Alerta de queda', mensagem: 'A loja Centro apresentou queda de 15% nas vendas esta semana', data: '2023-05-13', lida: false }
    ];
    
    //atualizarNotificacoes(notificacoes);
}

/**
 * Configura os links de navegação
 */
function configurarNavegacao() {
    // Já configurado via HTML com links para as outras páginas
}

/**
 * Faz logout do sistema
 */
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../index.html';
}

/**
 * Seleciona um período de dias para análise
 * @param {number} dias - Número de dias para análise
 */
function selecionarPeriodo(dias) {
    // Calcula as datas de início e fim
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    
    // Formata as datas para o formato ISO (YYYY-MM-DD)
    const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
    const dataFimFormatada = dataFim.toISOString().split('T')[0];
    
    // Atualiza o texto do botão de período
    document.getElementById('periodoDropdown').innerHTML = `<i data-feather="calendar"></i> Últimos ${dias} dias`;
    feather.replace();
    
    // Carrega os dados para o período selecionado
    carregarDados(dataInicioFormatada, dataFimFormatada);
}

/**
 * Aplica um período personalizado
 */
function aplicarPeriodoPersonalizado() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    
    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione as datas de início e fim');
        return;
    }
    
    if (new Date(dataInicio) > new Date(dataFim)) {
        alert('A data de início não pode ser posterior à data de fim');
        return;
    }
    
    // Atualiza o texto do botão de período
    document.getElementById('periodoDropdown').innerHTML = `<i data-feather="calendar"></i> Período Personalizado`;
    feather.replace();
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('periodoPersonalizado'));
    modal.hide();
    
    // Carrega os dados para o período selecionado
    carregarDados(dataInicio, dataFim);
}

/**
 * Aplica os filtros selecionados
 */
function aplicarFiltros() {
    // Obtém os valores dos filtros
    const tipoAnalise = document.getElementById('tipoAnalise').value;
    const granularidade = document.getElementById('granularidade').value;
    const comparativo = document.getElementById('comparativo').value;
    const loja = document.getElementById('lojaFiltro').value;
    
    // Obtém as datas do período atual
    const periodoTexto = document.getElementById('periodoDropdown').textContent;
    let dataInicio, dataFim;
    
    if (periodoTexto.includes('Período Personalizado')) {
        dataInicio = document.getElementById('dataInicio').value;
        dataFim = document.getElementById('dataFim').value;
    } else {
        const dias = parseInt(periodoTexto.match(/\d+/)[0]);
        dataFim = new Date();
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - dias);
        dataInicio = dataInicio.toISOString().split('T')[0];
        dataFim = dataFim.toISOString().split('T')[0];
    }
    
    // Carrega os dados com os filtros aplicados
    carregarDados(dataInicio, dataFim, tipoAnalise, granularidade, comparativo, loja);
}

/**
 * Carrega os dados para o período e filtros selecionados
 * @param {string} dataInicio - Data de início no formato YYYY-MM-DD
 * @param {string} dataFim - Data de fim no formato YYYY-MM-DD
 * @param {string} tipoAnalise - Tipo de análise (vendas, desempenho, metas, desafios, recompensas)
 * @param {string} granularidade - Granularidade dos dados (diario, semanal, mensal, trimestral)
 * @param {string} comparativo - Tipo de comparativo (nenhum, periodo_anterior, mesmo_periodo_ano_anterior, meta)
 * @param {string} loja - ID da loja/franquia ou "todas"
 */
function carregarDados(dataInicio, dataFim, tipoAnalise, granularidade, comparativo, loja) {
    // Se não foram passados, usa os valores dos filtros
    tipoAnalise = tipoAnalise || document.getElementById('tipoAnalise').value;
    granularidade = granularidade || document.getElementById('granularidade').value;
    comparativo = comparativo || document.getElementById('comparativo').value;
    loja = loja || document.getElementById('lojaFiltro').value;
    
    // Simula a obtenção de dados do servidor
    const dados = gerarDadosHistorico(dataInicio, dataFim, tipoAnalise, granularidade, comparativo, loja);
    
    // Atualiza os indicadores principais
    atualizarIndicadoresPrincipais(dados);
    
    // Atualiza os gráficos
    atualizarGraficos(dados, tipoAnalise, comparativo);
    
    // Atualiza a tabela de dados
    atualizarTabelaDados(dados, tipoAnalise, granularidade);
    
    // Atualiza a análise de tendências
    atualizarAnaliseTendencias(dados, tipoAnalise);
}

/**
 * Atualiza os indicadores principais
 * @param {Object} dados - Dados do histórico
 */
function atualizarIndicadoresPrincipais(dados) {
    // Atualiza o total de vendas
    document.getElementById('totalVendas').textContent = formatarMoeda(dados.indicadores.totalVendas);
    document.getElementById('variacaoVendas').innerHTML = formatarVariacao(dados.indicadores.variacaoVendas);
    
    // Atualiza o ticket médio
    document.getElementById('ticketMedio').textContent = formatarMoeda(dados.indicadores.ticketMedio);
    document.getElementById('variacaoTicket').innerHTML = formatarVariacao(dados.indicadores.variacaoTicket);
    
    // Atualiza as metas atingidas
    document.getElementById('metasAtingidas').textContent = `${dados.indicadores.metasAtingidas}%`;
    document.getElementById('variacaoMetas').innerHTML = formatarVariacao(dados.indicadores.variacaoMetas);
    
    // Atualiza o engajamento
    document.getElementById('engajamento').textContent = `${dados.indicadores.engajamento}%`;
    document.getElementById('variacaoEngajamento').innerHTML = formatarVariacao(dados.indicadores.variacaoEngajamento);
}

/**
 * Atualiza os gráficos com os dados do histórico
 * @param {Object} dados - Dados do histórico
 * @param {string} tipoAnalise - Tipo de análise
 * @param {string} comparativo - Tipo de comparativo
 */
function atualizarGraficos(dados, tipoAnalise, comparativo) {
    // Atualiza o título do gráfico principal
    const tituloGraficoPrincipal = document.getElementById('tituloGraficoPrincipal');
    tituloGraficoPrincipal.textContent = obterTituloGrafico(tipoAnalise);
    
    // Atualiza o gráfico principal
    atualizarGraficoPrincipal(dados.graficoPrincipal, tipoAnalise, comparativo);
    
    // Atualiza os gráficos secundários
    atualizarGraficoSecundario1(dados.graficoSecundario1, tipoAnalise);
    atualizarGraficoSecundario2(dados.graficoSecundario2, tipoAnalise);
}

/**
 * Atualiza o gráfico principal
 * @param {Object} dados - Dados do gráfico principal
 * @param {string} tipoAnalise - Tipo de análise
 * @param {string} comparativo - Tipo de comparativo
 */
function atualizarGraficoPrincipal(dados, tipoAnalise, comparativo) {
    // Obtém o tipo de gráfico selecionado
    const tipoGrafico = document.querySelector('.tipo-grafico.active').getAttribute('data-tipo');
    
    // Prepara os datasets
    const datasets = [{
        label: obterLabelGrafico(tipoAnalise),
        data: dados.valores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        fill: tipoGrafico === 'area'
    }];
    
    // Adiciona o dataset de comparativo, se necessário
    if (comparativo !== 'nenhum' && dados.valoresComparativo) {
        datasets.push({
            label: obterLabelComparativo(comparativo),
            data: dados.valoresComparativo,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: tipoGrafico === 'area'
        });
    }
    
    // Prepara os dados para o gráfico
    const dadosGrafico = {
        labels: dados.labels,
        datasets: datasets
    };
    
    // Configura as opções do gráfico
    const opcoes = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (tipoAnalise === 'vendas') {
                                label += formatarMoeda(context.parsed.y);
                            } else {
                                label += context.parsed.y;
                                if (tipoAnalise === 'metas' || tipoAnalise === 'desempenho' || tipoAnalise === 'engajamento') {
                                    label += '%';
                                }
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (tipoAnalise === 'vendas') {
                            return formatarMoeda(value);
                        } else {
                            if (tipoAnalise === 'metas' || tipoAnalise === 'desempenho' || tipoAnalise === 'engajamento') {
                                return value + '%';
                            }
                            return value;
                        }
                    }
                }
            }
        }
    };
    
    // Determina o tipo de gráfico a ser usado
    let tipo;
    switch (tipoGrafico) {
        case 'barra':
            tipo = 'bar';
            break;
        case 'area':
            tipo = 'line';
            break;
        default:
            tipo = 'line';
    }
    
    // Cria ou atualiza o gráfico
    const ctx = document.getElementById('graficoPrincipal').getContext('2d');
    
    if (window.graficoPrincipal) {
        window.graficoPrincipal.data = dadosGrafico;
        window.graficoPrincipal.options = opcoes;
        window.graficoPrincipal.config.type = tipo;
        window.graficoPrincipal.update();
    } else {
        window.graficoPrincipal = new Chart(ctx, {
            type: tipo,
            data: dadosGrafico,
            options: opcoes
        });
    }
}

/**
 * Atualiza o tipo de gráfico principal
 * @param {string} tipo - Tipo de gráfico (linha, barra, area)
 */
function atualizarTipoGrafico(tipo) {
    // Obtém os valores dos filtros atuais
    const tipoAnalise = document.getElementById('tipoAnalise').value;
    const comparativo = document.getElementById('comparativo').value;
    
    // Obtém os dados do gráfico atual
    const dados = window.graficoPrincipal.data;
    
    // Atualiza o gráfico com o novo tipo
    let chartType;
    switch (tipo) {
        case 'barra':
            chartType = 'bar';
            break;
        case 'area':
            chartType = 'line';
            // Ativa o preenchimento para gráfico de área
            dados.datasets.forEach(dataset => {
                dataset.fill = true;
            });
            break;
        default:
            chartType = 'line';
            // Desativa o preenchimento para gráfico de linha
            dados.datasets.forEach(dataset => {
                dataset.fill = false;
            });
    }
    
    window.graficoPrincipal.config.type = chartType;
    window.graficoPrincipal.update();
}

/**
 * Atualiza o primeiro gráfico secundário
 * @param {Object} dados - Dados do gráfico secundário 1
 * @param {string} tipoAnalise - Tipo de análise
 */
function atualizarGraficoSecundario1(dados, tipoAnalise) {
    // Atualiza o título do gráfico
    const titulo = document.getElementById('tituloGraficoSecundario1');
    titulo.textContent = dados.titulo;
    
    // Prepara os dados para o gráfico
    const dadosGrafico = {
        labels: dados.labels,
        datasets: [{
            label: obterLabelGrafico(tipoAnalise),
            data: dados.valores,
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Cria ou atualiza o gráfico
    const ctx = document.getElementById('graficoSecundario1').getContext('2d');
    
    if (window.graficoSecundario1) {
        window.graficoSecundario1.data = dadosGrafico;
        window.graficoSecundario1.update();
    } else {
        window.graficoSecundario1 = new Chart(ctx, {
            type: 'pie',
            data: dadosGrafico,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                
                                if (tipoAnalise === 'vendas') {
                                    return `${label}: ${formatarMoeda(value)} (${percentage}%)`;
                                } else {
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Atualiza o segundo gráfico secundário
 * @param {Object} dados - Dados do gráfico secundário 2
 * @param {string} tipoAnalise - Tipo de análise
 */
function atualizarGraficoSecundario2(dados, tipoAnalise) {
    // Atualiza o título do gráfico
    const titulo = document.getElementById('tituloGraficoSecundario2');
    titulo.textContent = dados.titulo;
    
    // Prepara os dados para o gráfico
    const dadosGrafico = {
        labels: dados.labels,
        datasets: [{
            label: obterLabelGrafico(tipoAnalise),
            data: dados.valores,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    
    // Cria ou atualiza o gráfico
    const ctx = document.getElementById('graficoSecundario2').getContext('2d');
    
    if (window.graficoSecundario2) {
        window.graficoSecundario2.data = dadosGrafico;
        window.graficoSecundario2.update();
    } else {
        window.graficoSecundario2 = new Chart(ctx, {
            type: 'bar',
            data: dadosGrafico,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    if (tipoAnalise === 'vendas') {
                                        label += formatarMoeda(context.parsed.y);
                                    } else {
                                        label += context.parsed.y;
                                        if (tipoAnalise === 'metas' || tipoAnalise === 'desempenho' || tipoAnalise === 'engajamento') {
                                            label += '%';
                                        }
                                    }
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (tipoAnalise === 'vendas') {
                                    return formatarMoeda(value);
                                } else {
                                    if (tipoAnalise === 'metas' || tipoAnalise === 'desempenho' || tipoAnalise === 'engajamento') {
                                        return value + '%';
                                    }
                                    return value;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Atualiza a tabela de dados
 * @param {Object} dados - Dados do histórico
 * @param {string} tipoAnalise - Tipo de análise
 * @param {string} granularidade - Granularidade dos dados
 */
function atualizarTabelaDados(dados, tipoAnalise, granularidade) {
    // Atualiza o título da tabela
    document.getElementById('tituloTabela').textContent = `Dados Detalhados - ${obterTituloGrafico(tipoAnalise)}`;
    
    // Atualiza o cabeçalho da tabela
    const cabecalho = document.getElementById('cabecalhoTabela');
    cabecalho.innerHTML = '';
    
    const tr = document.createElement('tr');
    dados.tabela.colunas.forEach(coluna => {
        const th = document.createElement('th');
        th.textContent = coluna;
        tr.appendChild(th);
    });
    
    cabecalho.appendChild(tr);
    
    // Atualiza o corpo da tabela
    const corpo = document.getElementById('corpoTabela');
    corpo.innerHTML = '';
    
    dados.tabela.dados.forEach(linha => {
        const tr = document.createElement('tr');
        
        linha.forEach((valor, index) => {
            const td = document.createElement('td');
            
            // Formata o valor de acordo com o tipo de coluna
            if (index === 0) {
                // Primeira coluna (período)
                td.textContent = formatarPeriodo(valor, granularidade);
            } else if (dados.tabela.colunas[index].includes('Valor') || dados.tabela.colunas[index].includes('Vendas') || dados.tabela.colunas[index].includes('Ticket')) {
                // Colunas de valores monetários
                td.textContent = formatarMoeda(valor);
            } else if (dados.tabela.colunas[index].includes('%') || dados.tabela.colunas[index].includes('Taxa') || dados.tabela.colunas[index].includes('Percentual')) {
                // Colunas de percentuais
                td.textContent = `${valor}%`;
            } else {
                // Outras colunas
                td.textContent = valor;
            }
            
            tr.appendChild(td);
        });
        
        corpo.appendChild(tr);
    });
}

/**
 * Atualiza a análise de tendências
 * @param {Object} dados - Dados do histórico
 * @param {string} tipoAnalise - Tipo de análise
 */
function atualizarAnaliseTendencias(dados, tipoAnalise) {
    // Atualiza a previsão para o próximo período
    const previsao = document.getElementById('previsaoProximoPeriodo');
    previsao.innerHTML = '';
    
    const previsaoTitulo = document.createElement('h6');
    previsaoTitulo.textContent = 'Previsão para o Próximo Período';
    
    const previsaoValor = document.createElement('p');
    previsaoValor.className = 'display-6';
    
    if (tipoAnalise === 'vendas') {
        previsaoValor.textContent = formatarMoeda(dados.tendencias.previsao.valor);
    } else if (tipoAnalise === 'metas' || tipoAnalise === 'desempenho' || tipoAnalise === 'engajamento') {
        previsaoValor.textContent = `${dados.tendencias.previsao.valor}%`;
    } else {
        previsaoValor.textContent = dados.tendencias.previsao.valor;
    }
    
    const previsaoVariacao = document.createElement('p');
    previsaoVariacao.innerHTML = formatarVariacao(dados.tendencias.previsao.variacao);
    
    previsao.appendChild(previsaoValor);
    previsao.appendChild(previsaoVariacao);
    
    // Atualiza os insights principais
    const listaInsights = document.getElementById('listaInsights');
    listaInsights.innerHTML = '';
    
    dados.tendencias.insights.forEach(insight => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `<strong>${insight.titulo}:</strong> ${insight.descricao}`;
        listaInsights.appendChild(li);
    });
    
    // Atualiza as recomendações
    const listaRecomendacoes = document.getElementById('listaRecomendacoes');
    listaRecomendacoes.innerHTML = '';
    
    dados.tendencias.recomendacoes.forEach(recomendacao => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `<strong>${recomendacao.titulo}:</strong> ${recomendacao.descricao}`;
        listaRecomendacoes.appendChild(li);
    });
}

/**
 * Exporta o relatório completo
 */
function exportarRelatorio() {
    alert('Relatório exportado com sucesso!');
    // Aqui seria implementada a exportação real do relatório
}

/**
 * Exporta a tabela de dados para CSV
 */
function exportarTabela() {
    // Obtém os dados da tabela
    const cabecalho = [];
    document.querySelectorAll('#cabecalhoTabela th').forEach(th => {
        cabecalho.push(th.textContent);
    });
    
    const linhas = [];
    document.querySelectorAll('#corpoTabela tr').forEach(tr => {
        const linha = [];
        tr.querySelectorAll('td').forEach(td => {
            linha.push(td.textContent);
        });
        linhas.push(linha);
    });
    
    // Cria o conteúdo CSV
    let csv = cabecalho.join(',') + '\n';
    linhas.forEach(linha => {
        csv += linha.join(',') + '\n';
    });
    
    // Cria um link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Obtém o título do gráfico com base no tipo de análise
 * @param {string} tipoAnalise - Tipo de análise
 * @returns {string} Título do gráfico
 */
function obterTituloGrafico(tipoAnalise) {
    switch (tipoAnalise) {
        case 'vendas':
            return 'Evolução de Vendas';
        case 'desempenho':
            return 'Evolução de Desempenho';
        case 'metas':
            return 'Evolução de Metas';
        case 'desafios':
            return 'Evolução de Desafios';
        case 'recompensas':
            return 'Evolução de Recompensas';
        default:
            return 'Evolução';
    }
}

/**
 * Obtém o label do gráfico com base no tipo de análise
 * @param {string} tipoAnalise - Tipo de análise
 * @returns {string} Label do gráfico
 */
function obterLabelGrafico(tipoAnalise) {
    switch (tipoAnalise) {
        case 'vendas':
            return 'Valor de Vendas';
        case 'desempenho':
            return 'Taxa de Desempenho';
        case 'metas':
            return 'Percentual de Metas Atingidas';
        case 'desafios':
            return 'Quantidade de Desafios';
        case 'recompensas':
            return 'Valor de Recompensas';
        default:
            return 'Valor';
    }
}

/**
 * Obtém o label do comparativo
 * @param {string} comparativo - Tipo de comparativo
 * @returns {string} Label do comparativo
 */
function obterLabelComparativo(comparativo) {
    switch (comparativo) {
        case 'periodo_anterior':
            return 'Período Anterior';
        case 'mesmo_periodo_ano_anterior':
            return 'Mesmo Período Ano Anterior';
        case 'meta':
            return 'Meta';
        default:
            return 'Comparativo';
    }
}

/**
 * Formata um valor monetário
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado como moeda
 */
function formatarMoeda(valor) {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formata uma variação percentual
 * @param {number} variacao - Variação percentual
 * @returns {string} Variação formatada com ícone
 */
function formatarVariacao(variacao) {
    if (variacao > 0) {
        return `<i data-feather="arrow-up" class="text-success"></i> ${variacao}%`;
    } else if (variacao < 0) {
        return `<i data-feather="arrow-down" class="text-danger"></i> ${Math.abs(variacao)}%`;
    } else {
        return `<i data-feather="minus" class="text-secondary"></i> ${variacao}%`;
    }
}

/**
 * Formata um período com base na granularidade
 * @param {string} periodo - Período a ser formatado
 * @param {string} granularidade - Granularidade dos dados
 * @returns {string} Período formatado
 */
function formatarPeriodo(periodo, granularidade) {
    // Se o período já estiver formatado, retorna como está
    if (typeof periodo === 'string' && periodo.includes('/')) {
        return periodo;
    }
    
    // Converte para data
    const data = new Date(periodo);
    
    // Formata de acordo com a granularidade
    switch (granularidade) {
        case 'diario':
            return data.toLocaleDateString('pt-BR');
        case 'semanal':
            const dataFimSemana = new Date(data);
            dataFimSemana.setDate(data.getDate() + 6);
            return `${data.toLocaleDateString('pt-BR')} - ${dataFimSemana.toLocaleDateString('pt-BR')}`;
        case 'mensal':
            return `${data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
        case 'trimestral':
            const trimestre = Math.floor(data.getMonth() / 3) + 1;
            return `${trimestre}º Trimestre/${data.getFullYear()}`;
        default:
            return periodo;
    }
}

/**
 * Gera dados simulados para o histórico
 * @param {string} dataInicio - Data de início no formato YYYY-MM-DD
 * @param {string} dataFim - Data de fim no formato YYYY-MM-DD
 * @param {string} tipoAnalise - Tipo de análise
 * @param {string} granularidade - Granularidade dos dados
 * @param {string} comparativo - Tipo de comparativo
 * @param {string} loja - ID da loja/franquia ou "todas"
 * @returns {Object} Dados simulados do histórico
 */
function gerarDadosHistorico(dataInicio, dataFim, tipoAnalise, granularidade, comparativo, loja) {
    // Converte as datas para objetos Date
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    // Calcula a diferença em dias
    const diferencaDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determina o número de pontos de dados com base na granularidade
    let numPontos;
    let incremento;
    let formatoData;
    
    switch (granularidade) {
        case 'diario':
            numPontos = diferencaDias;
            incremento = 1;
            formatoData = { day: '2-digit', month: '2-digit' };
            break;
        case 'semanal':
            numPontos = Math.ceil(diferencaDias / 7);
            incremento = 7;
            formatoData = { day: '2-digit', month: '2-digit' };
            break;
        case 'mensal':
            numPontos = Math.ceil(diferencaDias / 30);
            incremento = 30;
            formatoData = { month: 'short' };
            break;
        case 'trimestral':
            numPontos = Math.ceil(diferencaDias / 90);
            incremento = 90;
            formatoData = { month: 'short' };
            break;
        default:
            numPontos = Math.ceil(diferencaDias / 7);
            incremento = 7;
            formatoData = { day: '2-digit', month: '2-digit' };
    }
    
    // Gera os labels (datas) para os gráficos
    const labels = [];
    const dataAtual = new Date(inicio);
    
    for (let i = 0; i < numPontos; i++) {
        if (i > 0) {
            dataAtual.setDate(dataAtual.getDate() + incremento);
        }
        
        if (granularidade === 'trimestral') {
            const trimestre = Math.floor(dataAtual.getMonth() / 3) + 1;
            labels.push(`T${trimestre}/${dataAtual.getFullYear()}`);
        } else {
            labels.push(dataAtual.toLocaleDateString('pt-BR', formatoData));
        }
    }
    
    // Gera valores simulados para o gráfico principal
    const valores = [];
    const valoresComparativo = comparativo !== 'nenhum' ? [] : null;
    
    // Base para os valores, dependendo do tipo de análise
    let baseValor;
    let variacaoMaxima;
    
    switch (tipoAnalise) {
        case 'vendas':
            baseValor = 50000;
            variacaoMaxima = 10000;
            break;
        case 'desempenho':
            baseValor = 75;
            variacaoMaxima = 15;
            break;
        case 'metas':
            baseValor = 65;
            variacaoMaxima = 20;
            break;
        case 'desafios':
            baseValor = 10;
            variacaoMaxima = 5;
            break;
        case 'recompensas':
            baseValor = 5000;
            variacaoMaxima = 2000;
            break;
        default:
            baseValor = 1000;
            variacaoMaxima = 200;
    }
    
    // Gera valores com tendência de crescimento
    let valorAtual = baseValor;
    let tendencia = 0.05; // 5% de crescimento médio
    
    for (let i = 0; i < numPontos; i++) {
        // Adiciona variação aleatória à tendência
        const variacao = (Math.random() * 2 - 1) * variacaoMaxima;
        valorAtual = Math.max(0, valorAtual * (1 + tendencia) + variacao);
        valores.push(Math.round(valorAtual * 100) / 100);
        
        // Gera valores para o comparativo, se necessário
        if (valoresComparativo) {
            let valorComparativo;
            
            switch (comparativo) {
                case 'periodo_anterior':
                    valorComparativo = Math.round((valorAtual * 0.9 + (Math.random() * 2 - 1) * variacaoMaxima) * 100) / 100;
                    break;
                case 'mesmo_periodo_ano_anterior':
                    valorComparativo = Math.round((valorAtual * 0.8 + (Math.random() * 2 - 1) * variacaoMaxima) * 100) / 100;
                    break;
                case 'meta':
                    valorComparativo = Math.round((valorAtual * 1.1 + (Math.random() * 2 - 1) * variacaoMaxima * 0.5) * 100) / 100;
                    break;
                default:
                    valorComparativo = Math.round((valorAtual * 0.9 + (Math.random() * 2 - 1) * variacaoMaxima) * 100) / 100;
            }
            
            valoresComparativo.push(Math.max(0, valorComparativo));
        }
    }
    
    // Gera dados para o primeiro gráfico secundário (distribuição por categoria)
    const categorias = ['Categoria A', 'Categoria B', 'Categoria C', 'Categoria D', 'Outros'];
    const valoresCategorias = [];
    
    for (let i = 0; i < categorias.length; i++) {
        valoresCategorias.push(Math.round(baseValor * (0.5 + Math.random())));
    }
    
    // Gera dados para o segundo gráfico secundário (comparativo por loja)
    const lojas = ['Loja Centro', 'Loja Shopping', 'Loja Norte', 'Loja Sul', 'Loja Oeste'];
    const valoresLojas = [];
    
    for (let i = 0; i < lojas.length; i++) {
        valoresLojas.push(Math.round(baseValor * (0.5 + Math.random())));
    }
    
    // Gera dados para a tabela
    const colunas = [];
    const dadosTabela = [];
    
    // Define as colunas da tabela com base no tipo de análise
    switch (tipoAnalise) {
        case 'vendas':
            colunas.push('Período', 'Valor de Vendas', 'Quantidade', 'Ticket Médio', 'Variação (%)');
            break;
        case 'desempenho':
            colunas.push('Período', 'Taxa de Desempenho (%)', 'Vendedores Ativos', 'Média por Vendedor', 'Variação (%)');
            break;
        case 'metas':
            colunas.push('Período', 'Metas Atingidas (%)', 'Total de Metas', 'Metas Concluídas', 'Variação (%)');
            break;
        case 'desafios':
            colunas.push('Período', 'Desafios Ativos', 'Taxa de Conclusão (%)', 'Participantes', 'Variação (%)');
            break;
        case 'recompensas':
            colunas.push('Período', 'Valor de Recompensas', 'Quantidade', 'Média por Vendedor', 'Variação (%)');
            break;
        default:
            colunas.push('Período', 'Valor', 'Quantidade', 'Média', 'Variação (%)');
    }
    
    // Gera os dados da tabela
    for (let i = 0; i < numPontos; i++) {
        const linha = [labels[i]];
        
        // Valor principal (já gerado para o gráfico)
        linha.push(valores[i]);
        
        // Quantidade (simulada)
        const quantidade = Math.round(valores[i] / (tipoAnalise === 'vendas' ? 500 : 10));
        linha.push(quantidade);
        
        // Média
        const media = Math.round((valores[i] / quantidade) * 100) / 100;
        linha.push(media);
        
        // Variação
        const variacaoPercentual = i > 0 ? Math.round(((valores[i] - valores[i-1]) / valores[i-1]) * 100) : 0;
        linha.push(variacaoPercentual);
        
        dadosTabela.push(linha);
    }
    
    // Gera dados para os indicadores principais
    const totalVendas = tipoAnalise === 'vendas' ? 
        valores.reduce((a, b) => a + b, 0) : 
        Math.round(baseValor * numPontos * (0.8 + Math.random() * 0.4));
    
    const ticketMedio = tipoAnalise === 'vendas' ? 
        Math.round(totalVendas / (numPontos * 100)) : 
        Math.round(baseValor / 10);
    
    const metasAtingidas = tipoAnalise === 'metas' ? 
        Math.round(valores.reduce((a, b) => a + b, 0) / valores.length) : 
        Math.round(65 + Math.random() * 20);
    
    const engajamento = Math.round(70 + Math.random() * 20);
    
    // Gera dados para a análise de tendências
    const previsaoValor = Math.round(valores[valores.length - 1] * (1 + tendencia + (Math.random() * 0.1 - 0.05)) * 100) / 100;
    const previsaoVariacao = Math.round(((previsaoValor - valores[valores.length - 1]) / valores[valores.length - 1]) * 100);
    
    const insights = [
        {
            titulo: 'Tendência de Crescimento',
            descricao: `Observamos uma tendência de crescimento de ${Math.round(tendencia * 100)}% ao período, indicando uma evolução positiva.`
        },
        {
            titulo: 'Sazonalidade',
            descricao: 'Identificamos um padrão sazonal com picos no meio do período analisado, sugerindo influência de campanhas ou eventos específicos.'
        },
        {
            titulo: 'Comparativo',
            descricao: `Em comparação com ${comparativo === 'periodo_anterior' ? 'o período anterior' : 'o mesmo período do ano anterior'}, houve um aumento de desempenho em ${Math.round(10 + Math.random() * 15)}%.`
        }
    ];
    
    const recomendacoes = [
        {
            titulo: 'Foco em Categorias',
            descricao: 'Recomendamos aumentar o foco na Categoria B, que apresenta o maior potencial de crescimento com base na análise de tendências.'
        },
        {
            titulo: 'Otimização de Desempenho',
            descricao: 'A Loja Norte apresenta desempenho abaixo da média. Sugerimos uma análise detalhada e implementação de ações corretivas.'
        },
        {
            titulo: 'Ajuste de Metas',
            descricao: 'Com base na previsão para o próximo período, recomendamos um ajuste de metas em +10% para alinhar com a tendência de crescimento observada.'
        }
    ];
    
    // Retorna os dados completos
    return {
        indicadores: {
            totalVendas: totalVendas,
            variacaoVendas: Math.round((valores[valores.length - 1] - valores[0]) / valores[0] * 100),
            ticketMedio: ticketMedio,
            variacaoTicket: Math.round((-5 + Math.random() * 15)),
            metasAtingidas: metasAtingidas,
            variacaoMetas: Math.round((-2 + Math.random() * 10)),
            engajamento: engajamento,
            variacaoEngajamento: Math.round((-3 + Math.random() * 12))
        },
        graficoPrincipal: {
            labels: labels,
            valores: valores,
            valoresComparativo: valoresComparativo
        },
        graficoSecundario1: {
            titulo: 'Distribuição por Categoria',
            labels: categorias,
            valores: valoresCategorias
        },
        graficoSecundario2: {
            titulo: 'Comparativo por Loja',
            labels: lojas,
            valores: valoresLojas
        },
        tabela: {
            colunas: colunas,
            dados: dadosTabela
        },
        tendencias: {
            previsao: {
                valor: previsaoValor,
                variacao: previsaoVariacao
            },
            insights: insights,
            recomendacoes: recomendacoes
        }
    };
}