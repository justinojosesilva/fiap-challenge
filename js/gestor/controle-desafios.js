/**
 * Controle de Desafios - Sistema de Gamificação para Vendas
 * Script para gerenciamento de desafios por gerentes e administradores
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones Feather
    feather.replace();
    
    // Verifica autenticação - apenas gerentes e admins podem acessar
    verificarAutenticacao(['gerente', 'admin']);
    
    // Inicializa o sistema de notificações
    inicializarNotificacoes();
    
    // Configura o botão de logout
    document.getElementById('logout').addEventListener('click', fazerLogout);
    
    // Configura os links de navegação
    configurarNavegacao();
    
    // Carrega os dados iniciais
    carregarDadosDesafios();
    
    // Configura os filtros
    document.getElementById('filtrarDesafios').addEventListener('click', carregarDadosDesafios);
    
    // Configura o botão de exportar
    document.getElementById('exportarDesafios').addEventListener('click', exportarDesafios);
    
    // Configura o botão de salvar desafio
    document.getElementById('salvarDesafio').addEventListener('click', salvarDesafio);
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
    // document.querySelector('.navbar-brand').textContent = `Sistema de Gamificação | ${usuarioLogado.nome}`;
}

/**
 * Inicializa o sistema de notificações
 */
function inicializarNotificacoes() {
    // Simulação de notificações
    const notificacoes = [
        { id: 1, titulo: 'Novo desafio criado', mensagem: 'O desafio "Vendas Premium" foi criado com sucesso', data: '2023-05-15', lida: false },
        { id: 2, titulo: 'Desafio concluído', mensagem: 'O desafio "Conhecimento de Produto" foi concluído por 75% dos participantes', data: '2023-05-14', lida: true },
        { id: 3, titulo: 'Alerta de desempenho', mensagem: 'O desafio "Vendas em Equipe" está com baixa participação', data: '2023-05-13', lida: false }
    ];
    
    atualizarNotificacoes(notificacoes);
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
 * Carrega os dados dos desafios com base nos filtros selecionados
 */
function carregarDadosDesafios() {
    // Obtém os valores dos filtros
    const periodo = document.getElementById('periodoDesafios').value;
    const categoria = document.getElementById('categoriaDesafio').value;
    const status = document.getElementById('statusDesafio').value;
    const dificuldade = document.getElementById('dificuldadeDesafio').value;
    
    // Simula a obtenção de dados do servidor
    const desafios = gerarDadosDesafios(periodo, categoria, status, dificuldade);
    
    // Atualiza os cards de resumo
    atualizarCardsResumo(desafios);
    
    // Atualiza a tabela de desafios
    atualizarTabelaDesafios(desafios);
    
    // Atualiza os gráficos
    atualizarGraficos(desafios);
}

/**
 * Atualiza os cards de resumo com base nos desafios filtrados
 * @param {Array} desafios - Array com os desafios filtrados
 */
function atualizarCardsResumo(desafios) {
    const totalDesafios = desafios.length;
    const desafiosAtivos = desafios.filter(d => d.status === 'ativo').length;
    
    // Calcula a taxa média de conclusão
    let taxaConclusaoTotal = 0;
    desafios.forEach(d => {
        taxaConclusaoTotal += d.taxaConclusao;
    });
    const taxaConclusaoMedia = totalDesafios > 0 ? Math.round(taxaConclusaoTotal / totalDesafios) : 0;
    
    // Calcula o total de pontos distribuídos
    let pontosTotal = 0;
    desafios.forEach(d => {
        pontosTotal += d.pontos * (d.participantes * (d.taxaConclusao / 100));
    });
    
    // Atualiza os elementos HTML
    document.getElementById('totalDesafios').textContent = totalDesafios;
    document.getElementById('desafiosAtivos').textContent = desafiosAtivos;
    document.getElementById('taxaConclusao').textContent = `${taxaConclusaoMedia}%`;
    document.getElementById('pontosDistribuidos').textContent = formatarNumero(pontosTotal);
}

/**
 * Atualiza a tabela de desafios com os dados filtrados
 * @param {Array} desafios - Array com os desafios filtrados
 */
function atualizarTabelaDesafios(desafios) {
    const tabela = document.getElementById('tabelaDesafios');
    tabela.innerHTML = '';
    
    desafios.forEach(desafio => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${desafio.id}</td>
            <td>${desafio.titulo}</td>
            <td>${formatarCategoria(desafio.categoria)}</td>
            <td>${formatarDificuldade(desafio.dificuldade)}</td>
            <td>${desafio.pontos}</td>
            <td>${desafio.participantes}</td>
            <td>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar ${getClasseTaxaConclusao(desafio.taxaConclusao)}" role="progressbar" style="width: ${desafio.taxaConclusao}%;" 
                        aria-valuenow="${desafio.taxaConclusao}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small>${desafio.taxaConclusao}%</small>
            </td>
            <td>${formatarData(desafio.dataFim)}</td>
            <td><span class="badge ${getClasseStatus(desafio.status)}">${formatarStatus(desafio.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-info btn-detalhes" data-id="${desafio.id}">
                    <i data-feather="eye"></i>
                </button>
                <button class="btn btn-sm btn-warning btn-editar" data-id="${desafio.id}">
                    <i data-feather="edit"></i>
                </button>
            </td>
        `;
        
        tabela.appendChild(tr);
    });
    
    // Reinicializa os ícones Feather nos botões
    feather.replace();
    
    // Configura os botões de detalhes
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', () => abrirDetalhesDesafio(btn.getAttribute('data-id')));
    });
    
    // Configura os botões de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => editarDesafio(btn.getAttribute('data-id')));
    });
}

/**
 * Atualiza os gráficos com base nos desafios filtrados
 * @param {Array} desafios - Array com os desafios filtrados
 */
function atualizarGraficos(desafios) {
    atualizarGraficoDesafiosPorCategoria(desafios);
    atualizarGraficoTaxaConclusao(desafios);
}

/**
 * Atualiza o gráfico de desafios por categoria
 * @param {Array} desafios - Array com os desafios filtrados
 */
function atualizarGraficoDesafiosPorCategoria(desafios) {
    // Conta desafios por categoria
    const categorias = {
        'vendas': 0,
        'cliente': 0,
        'produto': 0,
        'equipe': 0
    };
    
    desafios.forEach(desafio => {
        if (categorias[desafio.categoria] !== undefined) {
            categorias[desafio.categoria]++;
        }
    });
    
    // Prepara dados para o gráfico
    const dados = {
        labels: ['Vendas', 'Atendimento ao Cliente', 'Conhecimento de Produto', 'Trabalho em Equipe'],
        datasets: [{
            label: 'Quantidade de Desafios',
            data: [categorias.vendas, categorias.cliente, categorias.produto, categorias.equipe],
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
    };
    
    // Cria ou atualiza o gráfico
    const ctx = document.getElementById('graficoDesafiosCategoria').getContext('2d');
    
    if (window.graficoDesafiosCategoria) {
        window.graficoDesafiosCategoria.data = dados;
        window.graficoDesafiosCategoria.update();
    } else {
        window.graficoDesafiosCategoria = new Chart(ctx, {
            type: 'pie',
            data: dados,
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
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Atualiza o gráfico de taxa de conclusão por dificuldade
 * @param {Array} desafios - Array com os desafios filtrados
 */
function atualizarGraficoTaxaConclusao(desafios) {
    // Agrupa desafios por dificuldade e calcula média de conclusão
    const dificuldades = {
        'facil': { total: 0, soma: 0 },
        'medio': { total: 0, soma: 0 },
        'dificil': { total: 0, soma: 0 }
    };
    
    desafios.forEach(desafio => {
        if (dificuldades[desafio.dificuldade]) {
            dificuldades[desafio.dificuldade].total++;
            dificuldades[desafio.dificuldade].soma += desafio.taxaConclusao;
        }
    });
    
    // Calcula médias
    const mediaFacil = dificuldades.facil.total > 0 ? Math.round(dificuldades.facil.soma / dificuldades.facil.total) : 0;
    const mediaMedio = dificuldades.medio.total > 0 ? Math.round(dificuldades.medio.soma / dificuldades.medio.total) : 0;
    const mediaDificil = dificuldades.dificil.total > 0 ? Math.round(dificuldades.dificil.soma / dificuldades.dificil.total) : 0;
    
    // Prepara dados para o gráfico
    const dados = {
        labels: ['Fácil', 'Médio', 'Difícil'],
        datasets: [{
            label: 'Taxa Média de Conclusão (%)',
            data: [mediaFacil, mediaMedio, mediaDificil],
            backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Cria ou atualiza o gráfico
    const ctx = document.getElementById('graficoTaxaConclusao').getContext('2d');
    
    if (window.graficoTaxaConclusao) {
        window.graficoTaxaConclusao.data = dados;
        window.graficoTaxaConclusao.update();
    } else {
        window.graficoTaxaConclusao = new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Taxa de Conclusão (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Nível de Dificuldade'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

/**
 * Abre o modal de detalhes do desafio
 * @param {string} id - ID do desafio
 */
function abrirDetalhesDesafio(id) {
    // Simula a obtenção de dados do servidor
    const desafio = buscarDesafioPorId(id);
    
    if (!desafio) {
        alert('Desafio não encontrado');
        return;
    }
    
    // Preenche os dados no modal
    document.getElementById('detalheTituloDesafio').textContent = desafio.titulo;
    document.getElementById('detalheCategoriaDesafio').textContent = formatarCategoria(desafio.categoria);
    document.getElementById('detalheDescricaoDesafio').textContent = desafio.descricao;
    document.getElementById('detalheDificuldadeDesafio').textContent = formatarDificuldade(desafio.dificuldade);
    document.getElementById('detalhePontosDesafio').textContent = desafio.pontos;
    document.getElementById('detalheTipoParticipante').textContent = formatarTipoParticipante(desafio.tipoParticipante);
    document.getElementById('detalheInicioDesafio').textContent = formatarData(desafio.dataInicio);
    document.getElementById('detalheFimDesafio').textContent = formatarData(desafio.dataFim);
    document.getElementById('detalheCriteriosDesafio').textContent = desafio.criterios;
    document.getElementById('detalheRecompensaDesafio').textContent = desafio.recompensa || 'Não definida';
    document.getElementById('detalheStatusDesafio').innerHTML = `<span class="badge ${getClasseStatus(desafio.status)}">${formatarStatus(desafio.status)}</span>`;
    
    // Atualiza a barra de progresso
    const progressBar = document.getElementById('detalheProgressoDesafio');
    progressBar.style.width = `${desafio.taxaConclusao}%`;
    progressBar.textContent = `${desafio.taxaConclusao}%`;
    progressBar.className = `progress-bar ${getClasseTaxaConclusao(desafio.taxaConclusao)}`;
    
    // Preenche a tabela de participantes
    preencherTabelaParticipantes(desafio.id);
    
    // Configura o botão de editar
    document.getElementById('editarDesafio').setAttribute('data-id', desafio.id);
    document.getElementById('editarDesafio').addEventListener('click', function() {
        editarDesafio(desafio.id);
        $('#detalhesDesafio').modal('hide');
    });
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('detalhesDesafio'));
    modal.show();
}

/**
 * Preenche a tabela de participantes do desafio
 * @param {string} desafioId - ID do desafio
 */
function preencherTabelaParticipantes(desafioId) {
    // Simula a obtenção de dados do servidor
    const participantes = gerarParticipantesDesafio(desafioId);
    
    const tabela = document.getElementById('tabelaParticipantes');
    tabela.innerHTML = '';
    
    participantes.forEach(participante => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${participante.nome}</td>
            <td>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar ${getClasseTaxaConclusao(participante.progresso)}" role="progressbar" 
                        style="width: ${participante.progresso}%;" aria-valuenow="${participante.progresso}" 
                        aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small>${participante.progresso}%</small>
            </td>
            <td><span class="badge ${getClasseStatusParticipante(participante.status)}">${participante.status}</span></td>
        `;
        
        tabela.appendChild(tr);
    });
}

/**
 * Abre o modal para editar um desafio
 * @param {string} id - ID do desafio
 */
function editarDesafio(id) {
    // Simula a obtenção de dados do servidor
    const desafio = buscarDesafioPorId(id);
    
    if (!desafio) {
        alert('Desafio não encontrado');
        return;
    }
    
    // Preenche o formulário com os dados do desafio
    document.getElementById('tituloDesafio').value = desafio.titulo;
    document.getElementById('categoriaDesafioNovo').value = desafio.categoria;
    document.getElementById('descricaoDesafio').value = desafio.descricao;
    document.getElementById('dificuldadeDesafioNovo').value = desafio.dificuldade;
    document.getElementById('pontosDesafio').value = desafio.pontos;
    document.getElementById('tipoParticipante').value = desafio.tipoParticipante;
    document.getElementById('dataInicioDesafio').value = desafio.dataInicio;
    document.getElementById('dataFimDesafio').value = desafio.dataFim;
    document.getElementById('criteriosDesafio').value = desafio.criterios;
    document.getElementById('recompensaDesafio').value = desafio.recompensa || '';
    document.getElementById('metaQuantitativa').value = desafio.metaQuantitativa || '';
    document.getElementById('publicarDesafio').checked = desafio.status === 'ativo';
    
    // Atualiza o título do modal
    document.getElementById('novoDesafioLabel').textContent = 'Editar Desafio';
    
    // Configura o botão de salvar para atualizar o desafio
    const btnSalvar = document.getElementById('salvarDesafio');
    btnSalvar.setAttribute('data-id', id);
    btnSalvar.textContent = 'Atualizar Desafio';
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('novoDesafio'));
    modal.show();
}

/**
 * Salva um novo desafio ou atualiza um existente
 */
function salvarDesafio() {
    // Validação básica do formulário
    const titulo = document.getElementById('tituloDesafio').value;
    const categoria = document.getElementById('categoriaDesafioNovo').value;
    const descricao = document.getElementById('descricaoDesafio').value;
    
    if (!titulo || !categoria || !descricao) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    // Obtém o ID do desafio (se for edição)
    const btnSalvar = document.getElementById('salvarDesafio');
    const id = btnSalvar.getAttribute('data-id');
    
    // Simula o salvamento no servidor
    setTimeout(() => {
        // Fecha o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('novoDesafio'));
        modal.hide();
        
        // Limpa o formulário
        document.getElementById('formNovoDesafio').reset();
        
        // Reseta o botão de salvar
        btnSalvar.removeAttribute('data-id');
        btnSalvar.textContent = 'Salvar Desafio';
        document.getElementById('novoDesafioLabel').textContent = 'Novo Desafio';
        
        // Recarrega os dados
        carregarDadosDesafios();
        
        // Exibe mensagem de sucesso
        alert(id ? 'Desafio atualizado com sucesso!' : 'Desafio criado com sucesso!');
    }, 500);
}

/**
 * Exporta os desafios para CSV
 */
function exportarDesafios() {
    // Obtém os valores dos filtros
    const periodo = document.getElementById('periodoDesafios').value;
    const categoria = document.getElementById('categoriaDesafio').value;
    const status = document.getElementById('statusDesafio').value;
    const dificuldade = document.getElementById('dificuldadeDesafio').value;
    
    // Simula a obtenção de dados do servidor
    const desafios = gerarDadosDesafios(periodo, categoria, status, dificuldade);
    
    // Cria o conteúdo CSV
    let csv = 'ID,Título,Categoria,Dificuldade,Pontos,Participantes,Taxa de Conclusão,Prazo,Status\n';
    
    desafios.forEach(desafio => {
        csv += `${desafio.id},"${desafio.titulo}",${formatarCategoria(desafio.categoria)},${formatarDificuldade(desafio.dificuldade)},${desafio.pontos},${desafio.participantes},${desafio.taxaConclusao}%,${formatarData(desafio.dataFim)},${formatarStatus(desafio.status)}\n`;
    });
    
    // Cria um link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `desafios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Busca um desafio pelo ID
 * @param {string} id - ID do desafio
 * @returns {Object} Desafio encontrado ou null
 */
function buscarDesafioPorId(id) {
    // Simula a busca no servidor
    const desafios = gerarDadosDesafios('todos', 'todos', 'todos', 'todos');
    return desafios.find(d => d.id === id) || null;
}

/**
 * Formata a categoria do desafio
 * @param {string} categoria - Código da categoria
 * @returns {string} Nome formatado da categoria
 */
function formatarCategoria(categoria) {
    const categorias = {
        'vendas': 'Vendas',
        'cliente': 'Atendimento ao Cliente',
        'produto': 'Conhecimento de Produto',
        'equipe': 'Trabalho em Equipe'
    };
    
    return categorias[categoria] || categoria;
}

/**
 * Formata a dificuldade do desafio
 * @param {string} dificuldade - Código da dificuldade
 * @returns {string} Nome formatado da dificuldade
 */
function formatarDificuldade(dificuldade) {
    const dificuldades = {
        'facil': 'Fácil',
        'medio': 'Médio',
        'dificil': 'Difícil'
    };
    
    return dificuldades[dificuldade] || dificuldade;
}

/**
 * Formata o status do desafio
 * @param {string} status - Código do status
 * @returns {string} Nome formatado do status
 */
function formatarStatus(status) {
    const statusMap = {
        'ativo': 'Ativo',
        'concluido': 'Concluído',
        'pendente': 'Pendente',
        'rascunho': 'Rascunho'
    };
    
    return statusMap[status] || status;
}

/**
 * Formata o tipo de participante
 * @param {string} tipo - Código do tipo de participante
 * @returns {string} Nome formatado do tipo de participante
 */
function formatarTipoParticipante(tipo) {
    const tipos = {
        'individual': 'Individual',
        'equipe': 'Equipe',
        'loja': 'Loja'
    };
    
    return tipos[tipo] || tipo;
}

/**
 * Formata uma data para exibição
 * @param {string} data - Data no formato ISO
 * @returns {string} Data formatada
 */
function formatarData(data) {
    if (!data) return '-';
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', options);
}

/**
 * Formata um número para exibição
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado
 */
function formatarNumero(numero) {
    if (numero >= 1000) {
        return (numero / 1000).toFixed(1) + 'k';
    }
    return numero.toString();
}

/**
 * Retorna a classe CSS para o status do desafio
 * @param {string} status - Status do desafio
 * @returns {string} Classe CSS
 */
function getClasseStatus(status) {
    const classes = {
        'ativo': 'bg-success',
        'concluido': 'bg-primary',
        'pendente': 'bg-warning',
        'rascunho': 'bg-secondary'
    };
    
    return classes[status] || 'bg-secondary';
}

/**
 * Retorna a classe CSS para a taxa de conclusão
 * @param {number} taxa - Taxa de conclusão
 * @returns {string} Classe CSS
 */
function getClasseTaxaConclusao(taxa) {
    if (taxa >= 75) return 'bg-success';
    if (taxa >= 50) return 'bg-info';
    if (taxa >= 25) return 'bg-warning';
    return 'bg-danger';
}

/**
 * Retorna a classe CSS para o status do participante
 * @param {string} status - Status do participante
 * @returns {string} Classe CSS
 */
function getClasseStatusParticipante(status) {
    const classes = {
        'Concluído': 'bg-success',
        'Em andamento': 'bg-info',
        'Iniciado': 'bg-warning',
        'Não iniciado': 'bg-secondary'
    };
    
    return classes[status] || 'bg-secondary';
}

/**
 * Gera dados simulados de desafios
 * @param {string} periodo - Filtro de período
 * @param {string} categoria - Filtro de categoria
 * @param {string} status - Filtro de status
 * @param {string} dificuldade - Filtro de dificuldade
 * @returns {Array} Array com os desafios gerados
 */
function gerarDadosDesafios(periodo, categoria, status, dificuldade) {
    // Dados base de desafios
    const desafiosBase = [
        {
            id: 'D001',
            titulo: 'Vendas Premium',
            categoria: 'vendas',
            descricao: 'Realizar vendas de produtos premium com valor acima de R$ 1.000,00',
            dificuldade: 'medio',
            pontos: 500,
            participantes: 45,
            taxaConclusao: 72,
            dataInicio: '2023-05-01',
            dataFim: '2023-05-31',
            status: 'ativo',
            criterios: 'Vender pelo menos 5 produtos premium no período',
            recompensa: 'Bônus de 2% sobre as vendas premium',
            tipoParticipante: 'individual',
            metaQuantitativa: '5 produtos premium'
        },
        {
            id: 'D002',
            titulo: 'Conhecimento de Produto',
            categoria: 'produto',
            descricao: 'Completar o treinamento sobre a nova linha de produtos',
            dificuldade: 'facil',
            pontos: 200,
            participantes: 60,
            taxaConclusao: 85,
            dataInicio: '2023-04-15',
            dataFim: '2023-05-15',
            status: 'concluido',
            criterios: 'Completar todos os módulos do treinamento e obter nota mínima de 80% no teste final',
            recompensa: 'Certificado de especialista no produto',
            tipoParticipante: 'individual',
            metaQuantitativa: '80% de acerto no teste'
        },
        {
            id: 'D003',
            titulo: 'Satisfação do Cliente',
            categoria: 'cliente',
            descricao: 'Obter avaliações positivas dos clientes após o atendimento',
            dificuldade: 'medio',
            pontos: 300,
            participantes: 50,
            taxaConclusao: 65,
            dataInicio: '2023-05-10',
            dataFim: '2023-06-10',
            status: 'ativo',
            criterios: 'Obter pelo menos 20 avaliações com nota 4 ou 5 (escala de 1 a 5)',
            recompensa: 'Reconhecimento como "Atendente do Mês"',
            tipoParticipante: 'individual',
            metaQuantitativa: '20 avaliações positivas'
        },
        {
            id: 'D004',
            titulo: 'Vendas em Equipe',
            categoria: 'equipe',
            descricao: 'Atingir a meta coletiva de vendas da loja',
            dificuldade: 'dificil',
            pontos: 1000,
            participantes: 15,
            taxaConclusao: 40,
            dataInicio: '2023-05-01',
            dataFim: '2023-06-30',
            status: 'ativo',
            criterios: 'A loja deve atingir 120% da meta mensal de vendas',
            recompensa: 'Dia de folga para toda a equipe',
            tipoParticipante: 'equipe',
            metaQuantitativa: '120% da meta mensal'
        },
        {
            id: 'D005',
            titulo: 'Venda Cruzada',
            categoria: 'vendas',
            descricao: 'Realizar vendas cruzadas de acessórios junto com o produto principal',
            dificuldade: 'medio',
            pontos: 400,
            participantes: 40,
            taxaConclusao: 55,
            dataInicio: '2023-04-01',
            dataFim: '2023-04-30',
            status: 'concluido',
            criterios: 'Vender acessórios em pelo menos 50% das vendas de produtos principais',
            recompensa: 'Bônus de 1% sobre o valor dos acessórios vendidos',
            tipoParticipante: 'individual',
            metaQuantitativa: '50% de vendas com acessórios'
        },
        {
            id: 'D006',
            titulo: 'Treinamento de Novos Vendedores',
            categoria: 'equipe',
            descricao: 'Auxiliar no treinamento e integração de novos vendedores',
            dificuldade: 'facil',
            pontos: 250,
            participantes: 20,
            taxaConclusao: 90,
            dataInicio: '2023-06-01',
            dataFim: '2023-06-30',
            status: 'pendente',
            criterios: 'Acompanhar pelo menos 3 novos vendedores durante uma semana',
            recompensa: 'Reconhecimento como "Mentor Destaque"',
            tipoParticipante: 'individual',
            metaQuantitativa: '3 novos vendedores treinados'
        },
        {
            id: 'D007',
            titulo: 'Campanha Especial de Inverno',
            categoria: 'vendas',
            descricao: 'Promover e vender produtos da coleção de inverno',
            dificuldade: 'dificil',
            pontos: 800,
            participantes: 55,
            taxaConclusao: 30,
            dataInicio: '2023-06-15',
            dataFim: '2023-07-15',
            status: 'pendente',
            criterios: 'Vender pelo menos 15 produtos da coleção de inverno',
            recompensa: 'Peça da coleção exclusiva para colaboradores',
            tipoParticipante: 'individual',
            metaQuantitativa: '15 produtos da coleção'
        },
        {
            id: 'D008',
            titulo: 'Redução de Devoluções',
            categoria: 'cliente',
            descricao: 'Reduzir a taxa de devoluções de produtos vendidos',
            dificuldade: 'dificil',
            pontos: 600,
            participantes: 35,
            taxaConclusao: 45,
            dataInicio: '2023-05-01',
            dataFim: '2023-07-31',
            status: 'ativo',
            criterios: 'Manter a taxa de devoluções abaixo de 2% das vendas realizadas',
            recompensa: 'Bônus de 3% sobre o valor das vendas sem devolução',
            tipoParticipante: 'individual',
            metaQuantitativa: 'Taxa de devolução < 2%'
        },
        {
            id: 'D009',
            titulo: 'Especialista em Produto Premium',
            categoria: 'produto',
            descricao: 'Tornar-se especialista na linha premium de produtos',
            dificuldade: 'medio',
            pontos: 350,
            participantes: 25,
            taxaConclusao: 60,
            dataInicio: '2023-04-01',
            dataFim: '2023-05-15',
            status: 'concluido',
            criterios: 'Completar o treinamento avançado e realizar pelo menos 5 demonstrações do produto',
            recompensa: 'Acesso antecipado aos lançamentos da linha premium',
            tipoParticipante: 'individual',
            metaQuantitativa: '5 demonstrações realizadas'
        },
        {
            id: 'D010',
            titulo: 'Desafio de Loja',
            categoria: 'equipe',
            descricao: 'Competição entre lojas para atingir a maior taxa de conversão de visitas em vendas',
            dificuldade: 'dificil',
            pontos: 1200,
            participantes: 10,
            taxaConclusao: 20,
            dataInicio: '2023-06-01',
            dataFim: '2023-08-31',
            status: 'pendente',
            criterios: 'Ter a maior taxa de conversão entre todas as lojas da rede',
            recompensa: 'Bônus para todos os funcionários da loja vencedora',
            tipoParticipante: 'loja',
            metaQuantitativa: 'Maior taxa de conversão'
        },
        {
            id: 'D011',
            titulo: 'Captação de Leads',
            categoria: 'vendas',
            descricao: 'Captar novos leads para a base de clientes',
            dificuldade: 'facil',
            pontos: 150,
            participantes: 40,
            taxaConclusao: 75,
            dataInicio: '2023-05-15',
            dataFim: '2023-06-15',
            status: 'ativo',
            criterios: 'Cadastrar pelo menos 20 novos leads qualificados',
            recompensa: 'Bônus por lead que se converter em venda',
            tipoParticipante: 'individual',
            metaQuantitativa: '20 leads qualificados'
        },
        {
            id: 'D012',
            titulo: 'Inovação em Vendas',
            categoria: 'vendas',
            descricao: 'Propor e implementar uma nova abordagem de vendas',
            dificuldade: 'dificil',
            pontos: 700,
            participantes: 15,
            taxaConclusao: 35,
            dataInicio: '2023-04-01',
            dataFim: '2023-06-30',
            status: 'ativo',
            criterios: 'A abordagem proposta deve ser aprovada e implementada, gerando aumento mensurável nas vendas',
            recompensa: 'Participação em evento de inovação do setor',
            tipoParticipante: 'individual',
            metaQuantitativa: 'Aumento de 10% nas vendas'
        },
        {
            id: 'D013',
            titulo: 'Atendimento Digital',
            categoria: 'cliente',
            descricao: 'Realizar atendimentos eficientes pelos canais digitais',
            dificuldade: 'medio',
            pontos: 300,
            participantes: 30,
            taxaConclusao: 50,
            dataInicio: '2023-05-01',
            dataFim: '2023-06-15',
            status: 'ativo',
            criterios: 'Atender pelo menos 50 clientes pelos canais digitais com avaliação positiva',
            recompensa: 'Curso avançado de atendimento digital',
            tipoParticipante: 'individual',
            metaQuantitativa: '50 atendimentos digitais'
        },
        {
            id: 'D014',
            titulo: 'Organização de Vitrine',
            categoria: 'produto',
            descricao: 'Criar e manter vitrines atrativas que aumentem o fluxo de clientes',
            dificuldade: 'facil',
            pontos: 200,
            participantes: 20,
            taxaConclusao: 80,
            dataInicio: '2023-06-01',
            dataFim: '2023-06-30',
            status: 'pendente',
            criterios: 'A vitrine deve seguir o padrão visual da campanha atual e ser aprovada pelo gerente',
            recompensa: 'Participação no planejamento da próxima campanha',
            tipoParticipante: 'equipe',
            metaQuantitativa: 'Aumento de 15% no fluxo de clientes'
        },
        {
            id: 'D015',
            titulo: 'Fidelização de Clientes',
            categoria: 'cliente',
            descricao: 'Incentivar clientes a participarem do programa de fidelidade',
            dificuldade: 'medio',
            pontos: 400,
            participantes: 35,
            taxaConclusao: 60,
            dataInicio: '2023-05-15',
            dataFim: '2023-07-15',
            status: 'ativo',
            criterios: 'Cadastrar pelo menos 30 clientes no programa de fidelidade',
            recompensa: 'Bônus de 5% sobre as compras futuras desses clientes',
            tipoParticipante: 'individual',
            metaQuantitativa: '30 clientes cadastrados'
        }
    ];
    
    // Filtra os desafios de acordo com os parâmetros
    return desafiosBase.filter(desafio => {
        let incluir = true;
        
        if (periodo !== 'todos') {
            const hoje = new Date();
            const dataInicio = new Date(desafio.dataInicio);
            const dataFim = new Date(desafio.dataFim);
            
            if (periodo === 'atual' && (hoje < dataInicio || hoje > dataFim)) {
                incluir = false;
            } else if (periodo === 'proximo' && dataInicio <= hoje) {
                incluir = false;
            } else if (periodo === 'anterior' && dataFim >= hoje) {
                incluir = false;
            }
        }
        
        if (categoria !== 'todos' && desafio.categoria !== categoria) {
            incluir = false;
        }
        
        if (status !== 'todos' && desafio.status !== status) {
            incluir = false;
        }
        
        if (dificuldade !== 'todos' && desafio.dificuldade !== dificuldade) {
            incluir = false;
        }
        
        return incluir;
    });
}

/**
 * Gera dados simulados de participantes de um desafio
 * @param {string} desafioId - ID do desafio
 * @returns {Array} Array com os participantes gerados
 */
function gerarParticipantesDesafio(desafioId) {
    // Dados base de participantes por desafio
    const participantesPorDesafio = {
        'D001': [
            { nome: 'Ana Silva', progresso: 100, status: 'Concluído' },
            { nome: 'Carlos Oliveira', progresso: 85, status: 'Em andamento' },
            { nome: 'Mariana Santos', progresso: 70, status: 'Em andamento' },
            { nome: 'Roberto Almeida', progresso: 100, status: 'Concluído' },
            { nome: 'Juliana Costa', progresso: 50, status: 'Em andamento' }
        ],
        'D002': [
            { nome: 'Pedro Souza', progresso: 100, status: 'Concluído' },
            { nome: 'Fernanda Lima', progresso: 100, status: 'Concluído' },
            { nome: 'Ricardo Gomes', progresso: 90, status: 'Em andamento' },
            { nome: 'Camila Pereira', progresso: 100, status: 'Concluído' },
            { nome: 'Lucas Martins', progresso: 75, status: 'Em andamento' }
        ],
        'D003': [
            { nome: 'Daniela Ferreira', progresso: 80, status: 'Em andamento' },
            { nome: 'Gabriel Ribeiro', progresso: 60, status: 'Em andamento' },
            { nome: 'Patrícia Alves', progresso: 100, status: 'Concluído' },
            { nome: 'Marcelo Dias', progresso: 40, status: 'Em andamento' },
            { nome: 'Aline Cardoso', progresso: 20, status: 'Iniciado' }
        ],
        'D004': [
            { nome: 'Equipe Loja Centro', progresso: 65, status: 'Em andamento' },
            { nome: 'Equipe Loja Shopping', progresso: 45, status: 'Em andamento' },
            { nome: 'Equipe Loja Norte', progresso: 30, status: 'Iniciado' },
            { nome: 'Equipe Loja Sul', progresso: 20, status: 'Iniciado' },
            { nome: 'Equipe Loja Oeste', progresso: 10, status: 'Iniciado' }
        ]
    };
    
    // Retorna os participantes do desafio ou gera aleatoriamente se não existir
    if (participantesPorDesafio[desafioId]) {
        return participantesPorDesafio[desafioId];
    } else {
        // Gera participantes aleatórios
        const nomes = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Ricardo', 'Juliana', 'Marcos', 'Patrícia'];
        const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Ferreira', 'Costa', 'Ribeiro', 'Almeida', 'Pereira', 'Gomes'];
        const status = ['Concluído', 'Em andamento', 'Iniciado', 'Não iniciado'];
        
        const participantes = [];
        const numParticipantes = Math.floor(Math.random() * 3) + 3; // 3 a 5 participantes
        
        for (let i = 0; i < numParticipantes; i++) {
            const nome = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`;
            const progresso = Math.floor(Math.random() * 101); // 0 a 100
            let statusParticipante;
            
            if (progresso === 100) {
                statusParticipante = 'Concluído';
            } else if (progresso >= 50) {
                statusParticipante = 'Em andamento';
            } else if (progresso > 0) {
                statusParticipante = 'Iniciado';
            } else {
                statusParticipante = 'Não iniciado';
            }
            
            participantes.push({ nome, progresso, status: statusParticipante });
        }
        
        // Ordena por progresso (decrescente)
        return participantes.sort((a, b) => b.progresso - a.progresso);
    }
}