/**
 * Gestão de Metas - Sistema de Gamificação
 * Script responsável por gerenciar as funcionalidades de gestão de metas
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
    
    // Carrega os dados das metas
    carregarDadosMetas();
    
    // Configura o botão de filtrar
    document.getElementById('filtrarMetas').addEventListener('click', function() {
        carregarDadosMetas();
    });
    
    // Configura o botão de exportar metas
    document.getElementById('exportarMetas').addEventListener('click', function() {
        exportarMetas();
    });
    
    // Configura o botão de salvar meta
    document.getElementById('salvarMeta').addEventListener('click', function() {
        salvarNovaMeta();
    });
    
    // Inicializa os gráficos
    inicializarGraficos();
});

/**
 * Carrega os dados das metas com base nos filtros selecionados
 */
function carregarDadosMetas() {
    // Obtém os valores dos filtros
    const periodo = document.getElementById('periodoMetas').value;
    const tipoMeta = document.getElementById('tipoMeta').value;
    const statusMeta = document.getElementById('statusMeta').value;
    const lojaFiltro = document.getElementById('lojaFiltro').value;
    
    // Simulação de dados - Em um ambiente real, estes dados viriam de uma API
    const metas = gerarDadosSimulados(periodo, tipoMeta, statusMeta, lojaFiltro);
    
    // Atualiza os cards de resumo
    atualizarResumoMetas(metas);
    
    // Atualiza a tabela de metas
    atualizarTabelaMetas(metas);
    
    // Atualiza os gráficos
    atualizarGraficos(metas);
}

/**
 * Atualiza os cards de resumo com base nos dados das metas
 * @param {Array} metas - Array com os dados das metas
 */
function atualizarResumoMetas(metas) {
    const totalMetas = metas.length;
    const metasAtingidas = metas.filter(meta => meta.status === 'concluida').length;
    const metasAndamento = metas.filter(meta => meta.status === 'ativa').length;
    const metasAtrasadas = metas.filter(meta => meta.status === 'atrasada').length;
    
    document.getElementById('totalMetas').textContent = totalMetas;
    document.getElementById('metasAtingidas').textContent = metasAtingidas;
    document.getElementById('metasAndamento').textContent = metasAndamento;
    document.getElementById('metasAtrasadas').textContent = metasAtrasadas;
}

/**
 * Atualiza a tabela de metas com os dados fornecidos
 * @param {Array} metas - Array com os dados das metas
 */
function atualizarTabelaMetas(metas) {
    const tbody = document.getElementById('tabelaMetas');
    tbody.innerHTML = '';
    
    metas.forEach(meta => {
        const tr = document.createElement('tr');
        
        // Calcula o progresso
        const progresso = Math.round((meta.valorAtual / meta.valorAlvo) * 100);
        
        // Determina a classe de status
        let statusClass = '';
        switch(meta.status) {
            case 'ativa':
                statusClass = 'warning';
                break;
            case 'concluida':
                statusClass = 'success';
                break;
            case 'atrasada':
                statusClass = 'danger';
                break;
            case 'rascunho':
                statusClass = 'secondary';
                break;
        }
        
        // Formata o valor alvo e atual com base no tipo
        let valorAlvoFormatado = meta.valorAlvo;
        let valorAtualFormatado = meta.valorAtual;
        
        if (meta.tipo === 'vendas') {
            valorAlvoFormatado = formatarMoeda(meta.valorAlvo);
            valorAtualFormatado = formatarMoeda(meta.valorAtual);
        } else if (meta.tipo === 'ticket') {
            valorAlvoFormatado = formatarMoeda(meta.valorAlvo);
            valorAtualFormatado = formatarMoeda(meta.valorAtual);
        } else if (meta.tipo === 'pontos' || meta.tipo === 'desafios') {
            valorAlvoFormatado = meta.valorAlvo.toLocaleString('pt-BR');
            valorAtualFormatado = meta.valorAtual.toLocaleString('pt-BR');
        }
        
        tr.innerHTML = `
            <td>${meta.id}</td>
            <td>${meta.titulo}</td>
            <td>${formatarTipoMeta(meta.tipo)}</td>
            <td>${meta.loja}</td>
            <td>${valorAlvoFormatado}</td>
            <td>${valorAtualFormatado}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar bg-${statusClass}" role="progressbar" style="width: ${progresso}%;" 
                        aria-valuenow="${progresso}" aria-valuemin="0" aria-valuemax="100">${progresso}%</div>
                </div>
            </td>
            <td>${formatarData(meta.dataFim)}</td>
            <td><span class="badge bg-${statusClass}">${formatarStatusMeta(meta.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-detalhes-meta" data-meta-id="${meta.id}">
                    <i data-feather="eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning btn-editar-meta" data-meta-id="${meta.id}">
                    <i data-feather="edit"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Reinicializa os ícones
    feather.replace();
    
    // Configura os botões de detalhes e edição
    configurarBotoesMetas();
}

/**
 * Configura os botões de detalhes e edição das metas
 */
function configurarBotoesMetas() {
    // Configura os botões de detalhes
    document.querySelectorAll('.btn-detalhes-meta').forEach(btn => {
        btn.addEventListener('click', function() {
            const metaId = this.getAttribute('data-meta-id');
            abrirModalDetalhesMeta(metaId);
        });
    });
    
    // Configura os botões de edição
    document.querySelectorAll('.btn-editar-meta').forEach(btn => {
        btn.addEventListener('click', function() {
            const metaId = this.getAttribute('data-meta-id');
            editarMeta(metaId);
        });
    });
}

/**
 * Abre o modal de detalhes da meta
 * @param {string} metaId - ID da meta para exibir detalhes
 */
function abrirModalDetalhesMeta(metaId) {
    // Simulação de dados - Em um ambiente real, estes dados viriam de uma API
    const meta = obterDetalhesMeta(metaId);
    
    // Preenche os dados do modal
    document.getElementById('detalheTitulo').textContent = meta.titulo;
    document.getElementById('detalheTipo').textContent = formatarTipoMeta(meta.tipo);
    document.getElementById('detalheLoja').textContent = meta.loja;
    
    // Formata o status
    const statusClass = meta.status === 'concluida' ? 'success' : 
                       meta.status === 'ativa' ? 'warning' : 
                       meta.status === 'atrasada' ? 'danger' : 'secondary';
    document.getElementById('detalheStatus').innerHTML = `<span class="badge bg-${statusClass}">${formatarStatusMeta(meta.status)}</span>`;
    
    // Formata o valor alvo e atual com base no tipo
    let valorAlvoFormatado = meta.valorAlvo;
    let valorAtualFormatado = meta.valorAtual;
    
    if (meta.tipo === 'vendas' || meta.tipo === 'ticket') {
        valorAlvoFormatado = formatarMoeda(meta.valorAlvo);
        valorAtualFormatado = formatarMoeda(meta.valorAtual);
    } else if (meta.tipo === 'pontos' || meta.tipo === 'desafios') {
        valorAlvoFormatado = meta.valorAlvo.toLocaleString('pt-BR');
        valorAtualFormatado = meta.valorAtual.toLocaleString('pt-BR');
    }
    
    document.getElementById('detalheAlvo').textContent = valorAlvoFormatado;
    document.getElementById('detalheAtual').textContent = valorAtualFormatado;
    
    // Atualiza a barra de progresso
    const progresso = Math.round((meta.valorAtual / meta.valorAlvo) * 100);
    const progressBar = document.getElementById('detalheProgresso');
    progressBar.style.width = `${progresso}%`;
    progressBar.textContent = `${progresso}%`;
    progressBar.classList.remove('bg-success', 'bg-warning', 'bg-danger');
    progressBar.classList.add(`bg-${statusClass}`);
    
    document.getElementById('detalheInicio').textContent = formatarData(meta.dataInicio);
    document.getElementById('detalheFim').textContent = formatarData(meta.dataFim);
    document.getElementById('detalheDescricao').textContent = meta.descricao || 'Sem descrição';
    document.getElementById('detalheRecompensa').textContent = meta.recompensa || 'Não definida';
    document.getElementById('detalhePontos').textContent = meta.pontos ? `${meta.pontos} pontos` : 'Não definido';
    
    // Cria o gráfico de histórico
    criarGraficoHistoricoMeta(meta.historico);
    
    // Configura o botão de editar
    document.getElementById('editarMeta').setAttribute('data-meta-id', meta.id);
    document.getElementById('editarMeta').addEventListener('click', function() {
        const metaId = this.getAttribute('data-meta-id');
        editarMeta(metaId);
        
        // Fecha o modal de detalhes
        const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('detalhesMeta'));
        modalDetalhes.hide();
    });
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('detalhesMeta'));
    modal.show();
}

/**
 * Cria o gráfico de histórico da meta
 * @param {Array} historico - Dados do histórico da meta
 */
function criarGraficoHistoricoMeta(historico) {
    const ctx = document.getElementById('graficoHistoricoMeta').getContext('2d');
    
    // Destrói o gráfico anterior se existir
    if (window.graficoHistoricoMeta) {
        window.graficoHistoricoMeta.destroy();
    }
    
    window.graficoHistoricoMeta = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historico.map(item => item.data),
            datasets: [{
                label: 'Valor',
                data: historico.map(item => item.valor),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
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
 * Inicializa os gráficos da página
 */
function inicializarGraficos() {
    // Gráfico de progresso por tipo
    const ctxTipo = document.getElementById('graficoProgressoTipo').getContext('2d');
    window.graficoProgressoTipo = new Chart(ctxTipo, {
        type: 'bar',
        data: {
            labels: ['Vendas', 'Ticket Médio', 'Desafios', 'Pontuação'],
            datasets: [{
                label: 'Progresso Médio (%)',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    
    // Gráfico de progresso por loja
    const ctxLoja = document.getElementById('graficoProgressoLoja').getContext('2d');
    window.graficoProgressoLoja = new Chart(ctxLoja, {
        type: 'bar',
        data: {
            labels: ['Shopping Norte', 'Shopping Sul', 'Loja Centro', 'Shopping Leste', 'Loja Oeste'],
            datasets: [{
                label: 'Progresso Médio (%)',
                data: [0, 0, 0, 0, 0],
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
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

/**
 * Atualiza os gráficos com os dados fornecidos
 * @param {Array} metas - Array com os dados das metas
 */
function atualizarGraficos(metas) {
    // Calcula o progresso médio por tipo
    const tiposMeta = ['vendas', 'ticket', 'desafios', 'pontos'];
    const progressoPorTipo = tiposMeta.map(tipo => {
        const metasTipo = metas.filter(meta => meta.tipo === tipo);
        if (metasTipo.length === 0) return 0;
        
        const somaProgresso = metasTipo.reduce((soma, meta) => {
            return soma + (meta.valorAtual / meta.valorAlvo) * 100;
        }, 0);
        
        return Math.round(somaProgresso / metasTipo.length);
    });
    
    // Atualiza o gráfico de progresso por tipo
    window.graficoProgressoTipo.data.datasets[0].data = progressoPorTipo;
    window.graficoProgressoTipo.update();
    
    // Calcula o progresso médio por loja
    const lojas = ['Shopping Norte', 'Shopping Sul', 'Loja Centro', 'Shopping Leste', 'Loja Oeste'];
    const progressoPorLoja = lojas.map(loja => {
        const metasLoja = metas.filter(meta => meta.loja === loja);
        if (metasLoja.length === 0) return 0;
        
        const somaProgresso = metasLoja.reduce((soma, meta) => {
            return soma + (meta.valorAtual / meta.valorAlvo) * 100;
        }, 0);
        
        return Math.round(somaProgresso / metasLoja.length);
    });
    
    // Atualiza o gráfico de progresso por loja
    window.graficoProgressoLoja.data.datasets[0].data = progressoPorLoja;
    window.graficoProgressoLoja.update();
}

/**
 * Salva uma nova meta
 */
function salvarNovaMeta() {
    // Obtém os valores do formulário
    const titulo = document.getElementById('tituloMeta').value;
    const tipo = document.getElementById('tipoMetaNova').value;
    const loja = document.getElementById('lojaMetaNova').value;
    const valorAlvo = parseFloat(document.getElementById('valorAlvo').value);
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const descricao = document.getElementById('descricaoMeta').value;
    const recompensa = document.getElementById('recompensaMeta').value;
    const pontos = document.getElementById('pontosMeta').value;
    const publicar = document.getElementById('publicarMeta').checked;
    
    // Validação básica
    if (!titulo || !tipo || !loja || isNaN(valorAlvo) || !dataInicio || !dataFim) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Simulação de salvamento - Em um ambiente real, estes dados seriam enviados para uma API
    alert('Meta salva com sucesso!');
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('novaMeta'));
    modal.hide();
    
    // Limpa o formulário
    document.getElementById('formNovaMeta').reset();
    
    // Recarrega os dados
    carregarDadosMetas();
}

/**
 * Edita uma meta existente
 * @param {string} metaId - ID da meta a ser editada
 */
function editarMeta(metaId) {
    // Simulação de dados - Em um ambiente real, estes dados viriam de uma API
    const meta = obterDetalhesMeta(metaId);
    
    // Preenche o formulário com os dados da meta
    document.getElementById('tituloMeta').value = meta.titulo;
    document.getElementById('tipoMetaNova').value = meta.tipo;
    document.getElementById('lojaMetaNova').value = meta.lojaId;
    document.getElementById('valorAlvo').value = meta.valorAlvo;
    document.getElementById('dataInicio').value = meta.dataInicio;
    document.getElementById('dataFim').value = meta.dataFim;
    document.getElementById('descricaoMeta').value = meta.descricao || '';
    document.getElementById('recompensaMeta').value = meta.recompensa || '';
    document.getElementById('pontosMeta').value = meta.pontos || '';
    document.getElementById('publicarMeta').checked = meta.status === 'ativa';
    
    // Atualiza o título do modal
    document.getElementById('novaMetaLabel').textContent = 'Editar Meta';
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('novaMeta'));
    modal.show();
}

/**
 * Exporta as metas atuais
 */
function exportarMetas() {
    // Simulação de exportação - Em um ambiente real, isso geraria um PDF ou Excel
    alert('Metas exportadas com sucesso!');
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
 * Formata uma data para o formato brasileiro
 * @param {string} data - Data no formato ISO (YYYY-MM-DD)
 * @returns {string} - Data formatada (DD/MM/YYYY)
 */
function formatarData(data) {
    if (!data) return '-';
    
    const partes = data.split('-');
    if (partes.length !== 3) return data;
    
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/**
 * Formata o tipo de meta para exibição
 * @param {string} tipo - Tipo da meta
 * @returns {string} - Tipo formatado
 */
function formatarTipoMeta(tipo) {
    switch(tipo) {
        case 'vendas':
            return 'Vendas';
        case 'ticket':
            return 'Ticket Médio';
        case 'desafios':
            return 'Desafios';
        case 'pontos':
            return 'Pontuação';
        default:
            return tipo;
    }
}

/**
 * Formata o status da meta para exibição
 * @param {string} status - Status da meta
 * @returns {string} - Status formatado
 */
function formatarStatusMeta(status) {
    switch(status) {
        case 'ativa':
            return 'Em Andamento';
        case 'concluida':
            return 'Concluída';
        case 'atrasada':
            return 'Atrasada';
        case 'rascunho':
            return 'Rascunho';
        default:
            return status;
    }
}

/**
 * Gera dados simulados para as metas
 * @param {string} periodo - Período selecionado
 * @param {string} tipoMeta - Tipo de meta selecionado
 * @param {string} statusMeta - Status selecionado
 * @param {string} lojaFiltro - Loja selecionada
 * @returns {Array} - Array com os dados simulados
 */
function gerarDadosSimulados(periodo, tipoMeta, statusMeta, lojaFiltro) {
    // Dados base que seriam obtidos de uma API em um ambiente real
    const metas = [
        { id: '1', titulo: 'Meta de Vendas Q2', tipo: 'vendas', lojaId: '1', loja: 'Shopping Norte', valorAlvo: 850000, valorAtual: 720000, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Meta de vendas para o segundo trimestre', recompensa: 'Bônus de 5%', pontos: 1000 },
        { id: '2', titulo: 'Meta de Ticket Médio', tipo: 'ticket', lojaId: '1', loja: 'Shopping Norte', valorAlvo: 350, valorAtual: 320, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Aumentar o ticket médio das vendas', recompensa: 'Bônus de 3%', pontos: 500 },
        { id: '3', titulo: 'Desafios Concluídos', tipo: 'desafios', lojaId: '1', loja: 'Shopping Norte', valorAlvo: 50, valorAtual: 45, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Completar desafios de vendas', recompensa: 'Dia de folga extra', pontos: 800 },
        { id: '4', titulo: 'Meta de Vendas Q1', tipo: 'vendas', lojaId: '1', loja: 'Shopping Norte', valorAlvo: 750000, valorAtual: 780000, dataInicio: '2023-01-01', dataFim: '2023-03-31', status: 'concluida', descricao: 'Meta de vendas para o primeiro trimestre', recompensa: 'Bônus de 5%', pontos: 1000 },
        { id: '5', titulo: 'Meta de Vendas Q2', tipo: 'vendas', lojaId: '2', loja: 'Shopping Sul', valorAlvo: 780000, valorAtual: 650000, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Meta de vendas para o segundo trimestre', recompensa: 'Bônus de 5%', pontos: 1000 },
        { id: '6', titulo: 'Meta de Ticket Médio', tipo: 'ticket', lojaId: '2', loja: 'Shopping Sul', valorAlvo: 320, valorAtual: 310, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Aumentar o ticket médio das vendas', recompensa: 'Bônus de 3%', pontos: 500 },
        { id: '7', titulo: 'Meta de Vendas Q1', tipo: 'vendas', lojaId: '2', loja: 'Shopping Sul', valorAlvo: 700000, valorAtual: 720000, dataInicio: '2023-01-01', dataFim: '2023-03-31', status: 'concluida', descricao: 'Meta de vendas para o primeiro trimestre', recompensa: 'Bônus de 5%', pontos: 1000 },
        { id: '8', titulo: 'Meta de Vendas Q2', tipo: 'vendas', lojaId: '3', loja: 'Loja Centro', valorAlvo: 720000, valorAtual: 580000, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'atrasada', descricao: 'Meta de vendas para o segundo trimestre', recompensa: 'Bônus de 5%', pontos: 1000 },
        { id: '9', titulo: 'Meta de Pontuação', tipo: 'pontos', lojaId: '3', loja: 'Loja Centro', valorAlvo: 8000, valorAtual: 7500, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Acumular pontos no sistema de gamificação', recompensa: 'Prêmio especial', pontos: 1200 },
        { id: '10', titulo: 'Meta de Vendas Q3', tipo: 'vendas', lojaId: 'todas', loja: 'Todas as Lojas', valorAlvo: 3500000, valorAtual: 0, dataInicio: '2023-07-01', dataFim: '2023-09-30', status: 'rascunho', descricao: 'Meta de vendas para o terceiro trimestre', recompensa: 'Bônus de 7%', pontos: 2000 },
        { id: '11', titulo: 'Meta de Vendas Q2', tipo: 'vendas', lojaId: '4', loja: 'Shopping Leste', valorAlvo: 650000, valorAtual: 520000, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Meta de vendas para o segundo trimestre', recompensa: 'Bônus de 5%', pontos: 1000 },
        { id: '12', titulo: 'Meta de Vendas Q2', tipo: 'vendas', lojaId: '5', loja: 'Loja Oeste', valorAlvo: 580000, valorAtual: 450000, dataInicio: '2023-04-01', dataFim: '2023-06-30', status: 'ativa', descricao: 'Meta de vendas para o segundo trimestre', recompensa: 'Bônus de 5%', pontos: 1000 }
    ];
    
    // Filtra por período
    let metasFiltradas = metas;
    if (periodo !== 'todos') {
        const hoje = new Date();
        const inicioAtual = new Date(hoje.getFullYear(), Math.floor(hoje.getMonth() / 3) * 3, 1);
        const fimAtual = new Date(inicioAtual);
        fimAtual.setMonth(fimAtual.getMonth() + 3);
        fimAtual.setDate(0);
        
        switch(periodo) {
            case 'atual':
                metasFiltradas = metasFiltradas.filter(meta => {
                    const dataInicio = new Date(meta.dataInicio);
                    const dataFim = new Date(meta.dataFim);
                    return dataInicio >= inicioAtual && dataFim <= fimAtual;
                });
                break;
            case 'proximo':
                const inicioProximo = new Date(fimAtual);
                inicioProximo.setDate(inicioProximo.getDate() + 1);
                const fimProximo = new Date(inicioProximo);
                fimProximo.setMonth(fimProximo.getMonth() + 3);
                fimProximo.setDate(0);
                
                metasFiltradas = metasFiltradas.filter(meta => {
                    const dataInicio = new Date(meta.dataInicio);
                    const dataFim = new Date(meta.dataFim);
                    return dataInicio >= inicioProximo && dataFim <= fimProximo;
                });
                break;
            case 'anterior':
                const inicioAnterior = new Date(inicioAtual);
                inicioAnterior.setMonth(inicioAnterior.getMonth() - 3);
                const fimAnterior = new Date(inicioAtual);
                fimAnterior.setDate(fimAnterior.getDate() - 1);
                
                metasFiltradas = metasFiltradas.filter(meta => {
                    const dataInicio = new Date(meta.dataInicio);
                    const dataFim = new Date(meta.dataFim);
                    return dataInicio >= inicioAnterior && dataFim <= fimAnterior;
                });
                break;
            case 'anual':
                const inicioAno = new Date(hoje.getFullYear(), 0, 1);
                const fimAno = new Date(hoje.getFullYear(), 11, 31);
                
                metasFiltradas = metasFiltradas.filter(meta => {
                    const dataInicio = new Date(meta.dataInicio);
                    const dataFim = new Date(meta.dataFim);
                    return dataInicio >= inicioAno && dataFim <= fimAno;
                });
                break;
        }
    }
    
    // Filtra por tipo de meta
    if (tipoMeta !== 'todos') {
        metasFiltradas = metasFiltradas.filter(meta => meta.tipo === tipoMeta);
    }
    
    // Filtra por status
    if (statusMeta !== 'todos') {
        metasFiltradas = metasFiltradas.filter(meta => meta.status === statusMeta);
    }
    
    // Filtra por loja
    if (lojaFiltro !== 'todas') {
        metasFiltradas = metasFiltradas.filter(meta => meta.lojaId === lojaFiltro || meta.lojaId === 'todas');
    }
    
    return metasFiltradas;
}

/**
 * Obtém os detalhes de uma meta específica
 * @param {string} metaId - ID da meta
 * @returns {Object} - Objeto com os detalhes da meta
 */
function obterDetalhesMeta(metaId) {
    // Dados base que seriam obtidos de uma API em um ambiente real
    const metas = {
        '1': {
            id: '1',
            titulo: 'Meta de Vendas Q2',
            tipo: 'vendas',
            lojaId: '1',
            loja: 'Shopping Norte',
            valorAlvo: 850000,
            valorAtual: 720000,
            dataInicio: '2023-04-01',
            dataFim: '2023-06-30',
            status: 'ativa',
            descricao: 'Meta de vendas para o segundo trimestre de 2023. Foco em aumentar o volume de vendas em 15% em relação ao mesmo período do ano anterior.',
            recompensa: 'Bônus de 5% para todos os vendedores da loja',
            pontos: 1000,
            historico: [
                { data: '01/04', valor: 0 },
                { data: '15/04', valor: 180000 },
                { data: '30/04', valor: 280000 },
                { data: '15/05', valor: 450000 },
                { data: '31/05', valor: 600000 },
                { data: '15/06', valor: 720000 }
            ]
        },
        '2': {
            id: '2',
            titulo: 'Meta de Ticket Médio',
            tipo: 'ticket',
            lojaId: '1',
            loja: 'Shopping Norte',
            valorAlvo: 350,
            valorAtual: 320,
            dataInicio: '2023-04-01',
            dataFim: '2023-06-30',
            status: 'ativa',
            descricao: 'Aumentar o ticket médio das vendas para R$ 350,00. Estratégias incluem venda de produtos complementares e promoções especiais para compras acima de determinado valor.',
            recompensa: 'Bônus de 3% para todos os vendedores da loja',
            pontos: 500,
            historico: [
                { data: '01/04', valor: 280 },
                { data: '15/04', valor: 290 },
                { data: '30/04', valor: 300 },
                { data: '15/05', valor: 310 },
                { data: '31/05', valor: 315 },
                { data: '15/06', valor: 320 }
            ]
        },
        '3': {
            id: '3',
            titulo: 'Desafios Concluídos',
            tipo: 'desafios',
            lojaId: '1',
            loja: 'Shopping Norte',
            valorAlvo: 50,
            valorAtual: 45,
            dataInicio: '2023-04-01',
            dataFim: '2023-06-30',
            status: 'ativa',
            descricao: 'Completar 50 desafios de vendas durante o trimestre. Os desafios incluem metas diárias, semanais e mensais para diferentes categorias de produtos.',
            recompensa: 'Dia de folga extra para cada vendedor',
            pontos: 800,
            historico: [
                { data: '01/04', valor: 0 },
                { data: '15/04', valor: 12 },
                { data: '30/04', valor: 20 },
                { data: '15/05', valor: 30 },
                { data: '31/05', valor: 38 },
                { data: '15/06', valor: 45 }
            ]
        }
    };
    
    // Retorna os detalhes da meta ou um objeto vazio se não encontrar
    return metas[metaId] || {};
}