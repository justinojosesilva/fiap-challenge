/**
 * Gestão de Recompensas - Sistema de Gamificação para Vendas
 * Script para gerenciamento de recompensas por gerentes e administradores
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
    
    // Configura o botão de exportar recompensas
    document.getElementById('exportarRecompensas').addEventListener('click', exportarRecompensas);
    
    // Configura o botão de salvar recompensa
    document.getElementById('salvarRecompensa').addEventListener('click', salvarRecompensa);
    
    // Configura o campo de disponibilidade para mostrar/esconder campos adicionais
    document.getElementById('disponibilidadeRecompensa').addEventListener('change', function() {
        const disponibilidade = this.value;
        
        // Esconde ambos os divs primeiro
        document.getElementById('divRegiao').style.display = 'none';
        document.getElementById('divLoja').style.display = 'none';
        
        // Mostra o div apropriado com base na seleção
        if (disponibilidade === 'regiao') {
            document.getElementById('divRegiao').style.display = 'block';
        } else if (disponibilidade === 'loja') {
            document.getElementById('divLoja').style.display = 'block';
        }
    });
    
    // Carrega os dados iniciais
    carregarDados();
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
    //document.querySelector('.navbar-brand').textContent = `Sistema de Gamificação | ${usuarioLogado.nome}`;
}

/**
 * Inicializa o sistema de notificações
 */
function inicializarNotificacoes() {
    // Simulação de notificações
    const notificacoes = [
        { id: 1, titulo: 'Nova recompensa disponível', mensagem: 'Uma nova recompensa foi adicionada ao catálogo', data: '2023-05-15', lida: false },
        { id: 2, titulo: 'Recompensa resgatada', mensagem: 'João Silva resgatou a recompensa "Vale-presente R$100"', data: '2023-05-14', lida: true },
        { id: 3, titulo: 'Estoque baixo', mensagem: 'A recompensa "Fone de ouvido" está com estoque baixo', data: '2023-05-13', lida: false }
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
 * Carrega os dados das recompensas
 * @param {Object} filtros - Filtros a serem aplicados
 */
function carregarDados(filtros = {}) {
    // Simula a obtenção de dados do servidor
    const dados = gerarDadosRecompensas(filtros);
    
    // Atualiza os cards de resumo
    atualizarCardsResumo(dados.resumo);
    
    // Atualiza a tabela de recompensas
    atualizarTabelaRecompensas(dados.recompensas);
    
    // Atualiza os gráficos
    atualizarGraficos(dados.graficos);
    
    // Atualiza as tabelas de análise
    atualizarTabelasAnalise(dados.analise);
}

/**
 * Aplica os filtros selecionados
 */
function aplicarFiltros() {
    const filtros = {
        categoria: document.getElementById('categoriaFiltro').value,
        status: document.getElementById('statusFiltro').value,
        pontos: document.getElementById('pontosFiltro').value,
        disponibilidade: document.getElementById('disponibilidadeFiltro').value
    };
    
    carregarDados(filtros);
}

/**
 * Atualiza os cards de resumo
 * @param {Object} resumo - Dados de resumo
 */
function atualizarCardsResumo(resumo) {
    document.getElementById('totalRecompensas').textContent = resumo.totalRecompensas;
    document.getElementById('recompensasResgatadas').textContent = resumo.recompensasResgatadas;
    document.getElementById('pontosDistribuidos').textContent = resumo.pontosDistribuidos.toLocaleString('pt-BR');
    document.getElementById('valorResgatado').textContent = formatarMoeda(resumo.valorResgatado);
    
    // Atualiza as variações
    document.getElementById('variacaoRecompensas').innerHTML = formatarVariacao(resumo.variacaoRecompensas);
    document.getElementById('variacaoResgatadas').innerHTML = formatarVariacao(resumo.variacaoResgatadas);
    document.getElementById('variacaoPontos').innerHTML = formatarVariacao(resumo.variacaoPontos);
    document.getElementById('variacaoValor').innerHTML = formatarVariacao(resumo.variacaoValor);
    
    // Reinicializa os ícones Feather
    feather.replace();
}

/**
 * Atualiza a tabela de recompensas
 * @param {Array} recompensas - Lista de recompensas
 */
function atualizarTabelaRecompensas(recompensas) {
    const tabela = document.getElementById('tabelaRecompensas');
    tabela.innerHTML = '';
    
    recompensas.forEach(recompensa => {
        const tr = document.createElement('tr');
        
        // ID
        const tdId = document.createElement('td');
        tdId.textContent = recompensa.id;
        tr.appendChild(tdId);
        
        // Nome
        const tdNome = document.createElement('td');
        tdNome.textContent = recompensa.nome;
        tr.appendChild(tdNome);
        
        // Categoria
        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = formatarCategoria(recompensa.categoria);
        tr.appendChild(tdCategoria);
        
        // Pontos
        const tdPontos = document.createElement('td');
        tdPontos.textContent = recompensa.pontos.toLocaleString('pt-BR');
        tr.appendChild(tdPontos);
        
        // Estoque
        const tdEstoque = document.createElement('td');
        tdEstoque.textContent = recompensa.estoque;
        tr.appendChild(tdEstoque);
        
        // Resgatados
        const tdResgatados = document.createElement('td');
        tdResgatados.textContent = recompensa.resgatados;
        tr.appendChild(tdResgatados);
        
        // Status
        const tdStatus = document.createElement('td');
        const badgeClass = recompensa.status === 'ativo' ? 'bg-success' : 
                          recompensa.status === 'inativo' ? 'bg-secondary' : 'bg-danger';
        tdStatus.innerHTML = `<span class="badge ${badgeClass}">${formatarStatus(recompensa.status)}</span>`;
        tr.appendChild(tdStatus);
        
        // Disponibilidade
        const tdDisponibilidade = document.createElement('td');
        tdDisponibilidade.textContent = formatarDisponibilidade(recompensa.disponibilidade);
        tr.appendChild(tdDisponibilidade);
        
        // Ações
        const tdAcoes = document.createElement('td');
        tdAcoes.innerHTML = `
            <button class="btn btn-sm btn-outline-primary btn-detalhes" data-id="${recompensa.id}">
                <i data-feather="eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary btn-editar" data-id="${recompensa.id}">
                <i data-feather="edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-desativar" data-id="${recompensa.id}">
                <i data-feather="x-circle"></i>
            </button>
        `;
        tr.appendChild(tdAcoes);
        
        tabela.appendChild(tr);
    });
    
    // Reinicializa os ícones Feather
    feather.replace();
    
    // Configura os botões de ações
    configurarBotoesAcoes();
}

/**
 * Configura os botões de ações da tabela
 */
function configurarBotoesAcoes() {
    // Configura os botões de detalhes
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            abrirDetalhesRecompensa(id);
        });
    });
    
    // Configura os botões de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            abrirEditarRecompensa(id);
        });
    });
    
    // Configura os botões de desativar
    document.querySelectorAll('.btn-desativar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            desativarRecompensa(id);
        });
    });
}

/**
 * Abre o modal de detalhes da recompensa
 * @param {string} id - ID da recompensa
 */
function abrirDetalhesRecompensa(id) {
    // Busca os dados da recompensa
    const recompensa = buscarRecompensaPorId(id);
    
    if (!recompensa) {
        alert('Recompensa não encontrada');
        return;
    }
    
    // Preenche os dados no modal
    document.getElementById('detalhesNome').textContent = recompensa.nome;
    document.getElementById('detalhesDescricao').textContent = recompensa.descricao;
    document.getElementById('detalhesCategoria').textContent = formatarCategoria(recompensa.categoria);
    
    const statusBadgeClass = recompensa.status === 'ativo' ? 'bg-success' : 
                            recompensa.status === 'inativo' ? 'bg-secondary' : 'bg-danger';
    document.getElementById('detalhesStatus').innerHTML = `<span class="badge ${statusBadgeClass}">${formatarStatus(recompensa.status)}</span>`;
    
    document.getElementById('detalhesPontos').textContent = recompensa.pontos.toLocaleString('pt-BR') + ' pontos';
    document.getElementById('detalhesEstoque').textContent = recompensa.estoque + ' unidades';
    document.getElementById('detalhesValor').textContent = formatarMoeda(recompensa.valor);
    document.getElementById('detalhesDisponibilidade').textContent = formatarDisponibilidade(recompensa.disponibilidade);
    
    const periodo = recompensa.dataFim ? 
        `${formatarData(recompensa.dataInicio)} a ${formatarData(recompensa.dataFim)}` : 
        `A partir de ${formatarData(recompensa.dataInicio)}`;
    document.getElementById('detalhesPeriodo').textContent = periodo;
    
    // Define a imagem
    const imagem = document.getElementById('detalhesImagem');
    if (recompensa.imagem) {
        imagem.src = recompensa.imagem;
        imagem.style.display = 'block';
    } else {
        imagem.style.display = 'none';
    }
    
    // Configura os botões
    document.getElementById('detalhesEditar').addEventListener('click', function() {
        // Fecha o modal atual
        const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesRecompensa'));
        modalDetalhes.hide();
        
        // Abre o modal de edição
        abrirEditarRecompensa(id);
    });
    
    document.getElementById('detalhesDesativar').addEventListener('click', function() {
        // Fecha o modal atual
        const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesRecompensa'));
        modalDetalhes.hide();
        
        // Desativa a recompensa
        desativarRecompensa(id);
    });
    
    // Cria o gráfico de histórico de resgates
    criarGraficoHistoricoResgates(recompensa.historicoResgates);
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesRecompensa'));
    modal.show();
}

/**
 * Cria o gráfico de histórico de resgates
 * @param {Object} historicoResgates - Dados do histórico de resgates
 */
function criarGraficoHistoricoResgates(historicoResgates) {
    const ctx = document.getElementById('graficoHistoricoResgates').getContext('2d');
    
    // Destrói o gráfico anterior, se existir
    if (window.graficoHistoricoResgates) {
        window.graficoHistoricoResgates.destroy();
    }
    
    // Cria o novo gráfico
    window.graficoHistoricoResgates = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicoResgates.labels,
            datasets: [{
                label: 'Resgates',
                data: historicoResgates.valores,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Abre o modal para editar uma recompensa
 * @param {string} id - ID da recompensa
 */
function abrirEditarRecompensa(id) {
    // Busca os dados da recompensa
    const recompensa = buscarRecompensaPorId(id);
    
    if (!recompensa) {
        alert('Recompensa não encontrada');
        return;
    }
    
    // Preenche o formulário com os dados da recompensa
    document.getElementById('recompensaId').value = recompensa.id;
    document.getElementById('nomeRecompensa').value = recompensa.nome;
    document.getElementById('categoriaRecompensa').value = recompensa.categoria;
    document.getElementById('descricaoRecompensa').value = recompensa.descricao;
    document.getElementById('pontosRecompensa').value = recompensa.pontos;
    document.getElementById('estoqueRecompensa').value = recompensa.estoque;
    document.getElementById('valorRecompensa').value = recompensa.valor;
    document.getElementById('disponibilidadeRecompensa').value = recompensa.disponibilidade;
    document.getElementById('statusRecompensa').value = recompensa.status;
    document.getElementById('dataInicioRecompensa').value = recompensa.dataInicio;
    document.getElementById('dataFimRecompensa').value = recompensa.dataFim || '';
    document.getElementById('imagemRecompensa').value = recompensa.imagem || '';
    
    // Mostra/esconde os campos adicionais de disponibilidade
    document.getElementById('divRegiao').style.display = 'none';
    document.getElementById('divLoja').style.display = 'none';
    
    if (recompensa.disponibilidade === 'regiao') {
        document.getElementById('divRegiao').style.display = 'block';
        document.getElementById('regiaoRecompensa').value = recompensa.regiao || '';
    } else if (recompensa.disponibilidade === 'loja') {
        document.getElementById('divLoja').style.display = 'block';
        document.getElementById('lojaRecompensa').value = recompensa.loja || '';
    }
    
    // Atualiza o título do modal
    document.getElementById('modalNovaRecompensaLabel').textContent = 'Editar Recompensa';
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalNovaRecompensa'));
    modal.show();
}

/**
 * Desativa uma recompensa
 * @param {string} id - ID da recompensa
 */
function desativarRecompensa(id) {
    if (confirm('Tem certeza que deseja desativar esta recompensa?')) {
        // Aqui seria feita a chamada para a API para desativar a recompensa
        alert('Recompensa desativada com sucesso!');
        
        // Recarrega os dados
        carregarDados();
    }
}

/**
 * Salva uma recompensa (nova ou editada)
 */
function salvarRecompensa() {
    // Valida o formulário
    const form = document.getElementById('formRecompensa');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Obtém os dados do formulário
    const id = document.getElementById('recompensaId').value;
    const nome = document.getElementById('nomeRecompensa').value;
    const categoria = document.getElementById('categoriaRecompensa').value;
    const descricao = document.getElementById('descricaoRecompensa').value;
    const pontos = parseInt(document.getElementById('pontosRecompensa').value);
    const estoque = parseInt(document.getElementById('estoqueRecompensa').value);
    const valor = parseFloat(document.getElementById('valorRecompensa').value);
    const disponibilidade = document.getElementById('disponibilidadeRecompensa').value;
    const status = document.getElementById('statusRecompensa').value;
    const dataInicio = document.getElementById('dataInicioRecompensa').value;
    const dataFim = document.getElementById('dataFimRecompensa').value || null;
    const imagem = document.getElementById('imagemRecompensa').value || null;
    
    // Dados adicionais de disponibilidade
    let regiao = null;
    let loja = null;
    
    if (disponibilidade === 'regiao') {
        regiao = document.getElementById('regiaoRecompensa').value;
        if (!regiao) {
            alert('Por favor, selecione uma região');
            return;
        }
    } else if (disponibilidade === 'loja') {
        loja = document.getElementById('lojaRecompensa').value;
        if (!loja) {
            alert('Por favor, selecione uma loja');
            return;
        }
    }
    
    // Cria o objeto com os dados da recompensa
    const recompensa = {
        id: id || gerarId(),
        nome,
        categoria,
        descricao,
        pontos,
        estoque,
        valor,
        disponibilidade,
        status,
        dataInicio,
        dataFim,
        imagem,
        regiao,
        loja,
        resgatados: id ? buscarRecompensaPorId(id).resgatados : 0,
        historicoResgates: id ? buscarRecompensaPorId(id).historicoResgates : {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            valores: [0, 0, 0, 0, 0, 0]
        }
    };
    
    // Aqui seria feita a chamada para a API para salvar a recompensa
    console.log('Salvando recompensa:', recompensa);
    
    // Simula o salvamento
    alert(`Recompensa ${id ? 'atualizada' : 'cadastrada'} com sucesso!`);
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovaRecompensa'));
    modal.hide();
    
    // Limpa o formulário
    document.getElementById('formRecompensa').reset();
    document.getElementById('recompensaId').value = '';
    document.getElementById('modalNovaRecompensaLabel').textContent = 'Nova Recompensa';
    
    // Recarrega os dados
    carregarDados();
}

/**
 * Atualiza os gráficos
 * @param {Object} dados - Dados para os gráficos
 */
function atualizarGraficos(dados) {
    // Gráfico de recompensas por categoria
    atualizarGraficoCategoria(dados.categorias);
    
    // Gráfico de resgates por período
    atualizarGraficoResgates(dados.resgates);
}

/**
 * Atualiza o gráfico de recompensas por categoria
 * @param {Object} dados - Dados para o gráfico de categorias
 */
function atualizarGraficoCategoria(dados) {
    const ctx = document.getElementById('graficoCategoria').getContext('2d');
    
    // Destrói o gráfico anterior, se existir
    if (window.graficoCategoria) {
        window.graficoCategoria.destroy();
    }
    
    // Cria o novo gráfico
    window.graficoCategoria = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: dados.labels,
            datasets: [{
                data: dados.valores,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Atualiza o gráfico de resgates por período
 * @param {Object} dados - Dados para o gráfico de resgates
 */
function atualizarGraficoResgates(dados) {
    const ctx = document.getElementById('graficoResgates').getContext('2d');
    
    // Destrói o gráfico anterior, se existir
    if (window.graficoResgates) {
        window.graficoResgates.destroy();
    }
    
    // Cria o novo gráfico
    window.graficoResgates = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dados.labels,
            datasets: [{
                label: 'Quantidade de Resgates',
                data: dados.valores,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Atualiza as tabelas de análise
 * @param {Object} analise - Dados para as tabelas de análise
 */
function atualizarTabelasAnalise(analise) {
    // Tabela de recompensas mais populares
    const tabelaPopulares = document.getElementById('tabelaPopulares');
    tabelaPopulares.innerHTML = '';
    
    analise.maisPopulares.forEach(recompensa => {
        const tr = document.createElement('tr');
        
        // Nome
        const tdNome = document.createElement('td');
        tdNome.textContent = recompensa.nome;
        tr.appendChild(tdNome);
        
        // Categoria
        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = formatarCategoria(recompensa.categoria);
        tr.appendChild(tdCategoria);
        
        // Resgates
        const tdResgates = document.createElement('td');
        tdResgates.textContent = recompensa.resgates;
        tr.appendChild(tdResgates);
        
        // Popularidade
        const tdPopularidade = document.createElement('td');
        tdPopularidade.innerHTML = `<div class="progress">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${recompensa.popularidade}%"
                aria-valuenow="${recompensa.popularidade}" aria-valuemin="0" aria-valuemax="100">
                ${recompensa.popularidade}%
            </div>
        </div>`;
        tr.appendChild(tdPopularidade);
        
        tabelaPopulares.appendChild(tr);
    });
    
    // Tabela de recompensas menos procuradas
    const tabelaMenosProcuradas = document.getElementById('tabelaMenosProcuradas');
    tabelaMenosProcuradas.innerHTML = '';
    
    analise.menosProcuradas.forEach(recompensa => {
        const tr = document.createElement('tr');
        
        // Nome
        const tdNome = document.createElement('td');
        tdNome.textContent = recompensa.nome;
        tr.appendChild(tdNome);
        
        // Categoria
        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = formatarCategoria(recompensa.categoria);
        tr.appendChild(tdCategoria);
        
        // Resgates
        const tdResgates = document.createElement('td');
        tdResgates.textContent = recompensa.resgates;
        tr.appendChild(tdResgates);
        
        // Popularidade
        const tdPopularidade = document.createElement('td');
        tdPopularidade.innerHTML = `<div class="progress">
            <div class="progress-bar bg-danger" role="progressbar" style="width: ${recompensa.popularidade}%"
                aria-valuenow="${recompensa.popularidade}" aria-valuemin="0" aria-valuemax="100">
                ${recompensa.popularidade}%
            </div>
        </div>`;
        tr.appendChild(tdPopularidade);
        
        tabelaMenosProcuradas.appendChild(tr);
    });
}

/**
 * Exporta as recompensas para CSV
 */
function exportarRecompensas() {
    // Obtém todas as recompensas
    const recompensas = gerarDadosRecompensas().recompensas;
    
    // Cria o cabeçalho do CSV
    let csv = 'ID,Nome,Categoria,Pontos,Estoque,Resgatados,Status,Disponibilidade,Valor\n';
    
    // Adiciona os dados de cada recompensa
    recompensas.forEach(recompensa => {
        csv += `${recompensa.id},`;
        csv += `"${recompensa.nome}",`;
        csv += `${formatarCategoria(recompensa.categoria)},`;
        csv += `${recompensa.pontos},`;
        csv += `${recompensa.estoque},`;
        csv += `${recompensa.resgatados},`;
        csv += `${formatarStatus(recompensa.status)},`;
        csv += `${formatarDisponibilidade(recompensa.disponibilidade)},`;
        csv += `${recompensa.valor}\n`;
    });
    
    // Cria um link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'recompensas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Busca uma recompensa pelo ID
 * @param {string} id - ID da recompensa
 * @returns {Object|null} Recompensa encontrada ou null
 */
function buscarRecompensaPorId(id) {
    const recompensas = gerarDadosRecompensas().recompensas;
    return recompensas.find(r => r.id === id) || null;
}

/**
 * Formata uma categoria
 * @param {string} categoria - Código da categoria
 * @returns {string} Nome formatado da categoria
 */
function formatarCategoria(categoria) {
    switch (categoria) {
        case 'vale-presente':
            return 'Vale-presente';
        case 'produto':
            return 'Produto';
        case 'experiencia':
            return 'Experiência';
        case 'beneficio':
            return 'Benefício';
        default:
            return categoria;
    }
}

/**
 * Formata um status
 * @param {string} status - Código do status
 * @returns {string} Nome formatado do status
 */
function formatarStatus(status) {
    switch (status) {
        case 'ativo':
            return 'Ativo';
        case 'inativo':
            return 'Inativo';
        case 'esgotado':
            return 'Esgotado';
        default:
            return status;
    }
}

/**
 * Formata uma disponibilidade
 * @param {string} disponibilidade - Código da disponibilidade
 * @returns {string} Nome formatado da disponibilidade
 */
function formatarDisponibilidade(disponibilidade) {
    switch (disponibilidade) {
        case 'nacional':
            return 'Nacional';
        case 'regiao':
            return 'Regional';
        case 'loja':
            return 'Loja específica';
        default:
            return disponibilidade;
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
 * Formata uma data
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada
 */
function formatarData(data) {
    if (!data) return '';
    
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/**
 * Formata uma variação percentual
 * @param {number} variacao - Variação percentual
 * @returns {string} Variação formatada com ícone
 */
function formatarVariacao(variacao) {
    if (variacao > 0) {
        return `<i data-feather="arrow-up" class="text-success"></i> ${variacao}% em relação ao mês anterior`;
    } else if (variacao < 0) {
        return `<i data-feather="arrow-down" class="text-danger"></i> ${Math.abs(variacao)}% em relação ao mês anterior`;
    } else {
        return `<i data-feather="minus" class="text-secondary"></i> ${variacao}% em relação ao mês anterior`;
    }
}

/**
 * Gera um ID único
 * @returns {string} ID gerado
 */
function gerarId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Gera dados simulados de recompensas
 * @param {Object} filtros - Filtros a serem aplicados
 * @returns {Object} Dados simulados
 */
function gerarDadosRecompensas(filtros = {}) {
    // Recompensas simuladas
    let recompensas = [
        {
            id: '1',
            nome: 'Vale-presente R$100',
            categoria: 'vale-presente',
            descricao: 'Vale-presente no valor de R$100 para utilização em lojas parceiras.',
            pontos: 2000,
            estoque: 50,
            resgatados: 35,
            status: 'ativo',
            disponibilidade: 'nacional',
            valor: 100,
            dataInicio: '2023-01-01',
            dataFim: '2023-12-31',
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [5, 7, 4, 8, 6, 5]
            }
        },
        {
            id: '2',
            nome: 'Fone de ouvido Bluetooth',
            categoria: 'produto',
            descricao: 'Fone de ouvido sem fio com tecnologia Bluetooth 5.0 e bateria de longa duração.',
            pontos: 5000,
            estoque: 10,
            resgatados: 8,
            status: 'ativo',
            disponibilidade: 'nacional',
            valor: 250,
            dataInicio: '2023-02-15',
            dataFim: null,
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [0, 2, 1, 3, 1, 1]
            }
        },
        {
            id: '3',
            nome: 'Dia de folga',
            categoria: 'beneficio',
            descricao: 'Um dia de folga adicional para ser utilizado conforme disponibilidade.',
            pontos: 10000,
            estoque: 20,
            resgatados: 5,
            status: 'ativo',
            disponibilidade: 'nacional',
            valor: 500,
            dataInicio: '2023-03-01',
            dataFim: null,
            imagem: null,
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [0, 0, 1, 2, 1, 1]
            }
        },
        {
            id: '4',
            nome: 'Jantar para dois',
            categoria: 'experiencia',
            descricao: 'Jantar para duas pessoas em restaurante parceiro, incluindo entrada, prato principal e sobremesa.',
            pontos: 7500,
            estoque: 15,
            resgatados: 12,
            status: 'ativo',
            disponibilidade: 'regiao',
            regiao: 'sudeste',
            valor: 350,
            dataInicio: '2023-01-15',
            dataFim: '2023-12-31',
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [2, 3, 2, 1, 2, 2]
            }
        },
        {
            id: '5',
            nome: 'Smartwatch',
            categoria: 'produto',
            descricao: 'Relógio inteligente com monitor cardíaco, contador de passos e notificações.',
            pontos: 12000,
            estoque: 5,
            resgatados: 5,
            status: 'esgotado',
            disponibilidade: 'nacional',
            valor: 600,
            dataInicio: '2023-02-01',
            dataFim: null,
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [0, 1, 1, 1, 1, 1]
            }
        },
        {
            id: '6',
            nome: 'Curso online',
            categoria: 'beneficio',
            descricao: 'Acesso a um curso online de sua escolha em plataforma parceira.',
            pontos: 8000,
            estoque: 30,
            resgatados: 18,
            status: 'ativo',
            disponibilidade: 'nacional',
            valor: 400,
            dataInicio: '2023-01-01',
            dataFim: null,
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [3, 4, 3, 2, 3, 3]
            }
        },
        {
            id: '7',
            nome: 'Vale-presente R$50',
            categoria: 'vale-presente',
            descricao: 'Vale-presente no valor de R$50 para utilização em lojas parceiras.',
            pontos: 1000,
            estoque: 100,
            resgatados: 75,
            status: 'ativo',
            disponibilidade: 'nacional',
            valor: 50,
            dataInicio: '2023-01-01',
            dataFim: '2023-12-31',
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [10, 15, 12, 14, 13, 11]
            }
        },
        {
            id: '8',
            nome: 'Ingresso para cinema',
            categoria: 'experiencia',
            descricao: 'Ingresso para sessão de cinema em rede parceira, válido para qualquer filme em cartaz.',
            pontos: 1500,
            estoque: 50,
            resgatados: 42,
            status: 'ativo',
            disponibilidade: 'loja',
            loja: '1',
            valor: 75,
            dataInicio: '2023-01-15',
            dataFim: '2023-12-31',
            imagem: 'https://via.placeholder.com/150',
            historicoResgates: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                valores: [6, 8, 7, 9, 7, 5]
            }
        }
    ];
    
    // Aplica os filtros
    if (filtros.categoria && filtros.categoria !== 'todas') {
        recompensas = recompensas.filter(r => r.categoria === filtros.categoria);
    }
    
    if (filtros.status && filtros.status !== 'todos') {
        recompensas = recompensas.filter(r => r.status === filtros.status);
    }
    
    if (filtros.pontos && filtros.pontos !== 'todos') {
        switch (filtros.pontos) {
            case 'baixo':
                recompensas = recompensas.filter(r => r.pontos <= 1000);
                break;
            case 'medio':
                recompensas = recompensas.filter(r => r.pontos > 1000 && r.pontos <= 5000);
                break;
            case 'alto':
                recompensas = recompensas.filter(r => r.pontos > 5000);
                break;
        }
    }
    
    if (filtros.disponibilidade && filtros.disponibilidade !== 'todas') {
        recompensas = recompensas.filter(r => r.disponibilidade === filtros.disponibilidade);
    }
    
    // Calcula o total de resgates
    const totalResgates = recompensas.reduce((total, r) => total + r.resgatados, 0);
    
    // Calcula o total de pontos distribuídos
    const pontosDistribuidos = recompensas.reduce((total, r) => total + (r.pontos * r.resgatados), 0);
    
    // Calcula o valor total resgatado
    const valorResgatado = recompensas.reduce((total, r) => total + (r.valor * r.resgatados), 0);
    
    // Dados para o gráfico de categorias
    const categorias = {
        labels: ['Vale-presente', 'Produto', 'Experiência', 'Benefício'],
        valores: [
            recompensas.filter(r => r.categoria === 'vale-presente').length,
            recompensas.filter(r => r.categoria === 'produto').length,
            recompensas.filter(r => r.categoria === 'experiencia').length,
            recompensas.filter(r => r.categoria === 'beneficio').length
        ]
    };
    
    // Dados para o gráfico de resgates
    const resgates = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        valores: [26, 40, 31, 40, 34, 29]
    };
    
    // Dados para a análise de recompensas
    const maisPopulares = recompensas
        .sort((a, b) => b.resgatados - a.resgatados)
        .slice(0, 5)
        .map(r => ({
            nome: r.nome,
            categoria: r.categoria,
            resgates: r.resgatados,
            popularidade: Math.round((r.resgatados / (r.resgatados + r.estoque)) * 100)
        }));
    
    const menosProcuradas = recompensas
        .filter(r => r.status === 'ativo') // Apenas recompensas ativas
        .sort((a, b) => a.resgatados - b.resgatados)
        .slice(0, 5)
        .map(r => ({
            nome: r.nome,
            categoria: r.categoria,
            resgates: r.resgatados,
            popularidade: Math.round((r.resgatados / (r.resgatados + r.estoque)) * 100)
        }));
    
    // Retorna os dados completos
    return {
        resumo: {
            totalRecompensas: recompensas.length,
            recompensasResgatadas: totalResgates,
            pontosDistribuidos: pontosDistribuidos,
            valorResgatado: valorResgatado,
            variacaoRecompensas: 8,
            variacaoResgatadas: 12,
            variacaoPontos: 15,
            variacaoValor: 10
        },
        recompensas: recompensas,
        graficos: {
            categorias: categorias,
            resgates: resgates
        },
        analise: {
            maisPopulares: maisPopulares,
            menosProcuradas: menosProcuradas
        }
    };
}