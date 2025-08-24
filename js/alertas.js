/**
 * Alertas Inteligentes - Sistema de Gamificação para Vendas
 * Script para gerenciamento de alertas para gerentes e administradores
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
    
    // Carrega os alertas
    carregarAlertas();
    
    // Configura os filtros de alertas
    configurarFiltros();
    
    // Configura o botão de marcar todos como lidos
    document.getElementById('marcarTodosLidos').addEventListener('click', marcarTodosComoLidos);
    
    // Configura o botão de salvar configurações
    document.getElementById('salvarConfiguracoes').addEventListener('click', salvarConfiguracoes);
    
    // Configura os switches de configuração
    configurarSwitches();
});

/**
 * Verifica se o usuário está autenticado e tem permissão para acessar a página
 * @param {Array} perfisPermitidos - Array com os perfis que podem acessar a página
 */
function verificarAutenticacao(perfisPermitidos) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    
    if (!perfisPermitidos.includes(usuarioLogado.perfil)) {
        alert('Você não tem permissão para acessar esta página');
        window.location.href = 'dashboard.html';
    }
    
    // Exibe o nome do usuário logado
    document.querySelector('.navbar-brand').textContent = `Sistema de Gamificação | ${usuarioLogado.nome}`;
}

/**
 * Inicializa o sistema de notificações
 */
function inicializarNotificacoes() {
    // Simulação de notificações
    const notificacoes = [
        { id: 1, titulo: 'Meta próxima do prazo', mensagem: 'A meta "Vendas Q2" vence em 3 dias', data: '2023-05-15', lida: false },
        { id: 2, titulo: 'Novo desafio disponível', mensagem: 'Um novo desafio foi criado: "Campeão de Vendas"', data: '2023-05-14', lida: true },
        { id: 3, titulo: 'Alerta de desempenho', mensagem: 'A loja Centro está com desempenho abaixo da meta', data: '2023-05-13', lida: false }
    ];
    
    atualizarNotificacoes(notificacoes);
}

/**
 * Faz logout do sistema
 */
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../index.html';
}

/**
 * Carrega os alertas do sistema
 * @param {string} filtro - Filtro a ser aplicado (opcional)
 */
function carregarAlertas(filtro = 'all') {
    // Simula a obtenção de dados do servidor
    const alertas = gerarDadosAlertas();
    
    // Filtra os alertas conforme necessário
    let alertasFiltrados = alertas;
    
    if (filtro !== 'all') {
        if (filtro === 'unread') {
            alertasFiltrados = alertas.filter(alerta => !alerta.lido);
        } else if (filtro === 'read') {
            alertasFiltrados = alertas.filter(alerta => alerta.lido);
        } else {
            alertasFiltrados = alertas.filter(alerta => alerta.prioridade === filtro);
        }
    }
    
    // Atualiza os cards de resumo
    atualizarCardsResumo(alertas);
    
    // Atualiza a lista de alertas
    atualizarListaAlertas(alertasFiltrados);
}

/**
 * Atualiza os cards de resumo
 * @param {Array} alertas - Lista de alertas
 */
function atualizarCardsResumo(alertas) {
    const totalAlertas = alertas.length;
    const alertasAlta = alertas.filter(alerta => alerta.prioridade === 'high').length;
    const alertasNaoLidos = alertas.filter(alerta => !alerta.lido).length;
    const alertasResolvidos = alertas.filter(alerta => alerta.resolvido).length;
    
    document.getElementById('totalAlertas').textContent = totalAlertas;
    document.getElementById('alertasAlta').textContent = alertasAlta;
    document.getElementById('alertasNaoLidos').textContent = alertasNaoLidos;
    document.getElementById('alertasResolvidos').textContent = alertasResolvidos;
}

/**
 * Atualiza a lista de alertas
 * @param {Array} alertas - Lista de alertas
 */
function atualizarListaAlertas(alertas) {
    const listaAlertas = document.getElementById('listaAlertas');
    listaAlertas.innerHTML = '';
    
    if (alertas.length === 0) {
        listaAlertas.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum alerta encontrado.</div></div>';
        return;
    }
    
    alertas.forEach(alerta => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-3';
        
        const card = document.createElement('div');
        card.className = `card alert-card ${alerta.prioridade} ${alerta.lido ? 'bg-light' : ''}`;
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // Cabeçalho do alerta
        const headerRow = document.createElement('div');
        headerRow.className = 'd-flex justify-content-between align-items-start mb-3';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = `alert-icon ${alerta.prioridade}`;
        iconDiv.innerHTML = `<i data-feather="${getIconForAlertType(alerta.tipo)}"></i>`;
        
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'd-flex flex-column align-items-end';
        
        const badge = document.createElement('span');
        badge.className = `alert-badge ${alerta.prioridade}`;
        badge.textContent = formatarPrioridade(alerta.prioridade);
        
        const time = document.createElement('span');
        time.className = 'alert-time mt-1';
        time.textContent = formatarData(alerta.data);
        
        badgeDiv.appendChild(badge);
        badgeDiv.appendChild(time);
        
        headerRow.appendChild(iconDiv);
        headerRow.appendChild(badgeDiv);
        
        // Conteúdo do alerta
        const title = document.createElement('h5');
        title.className = 'alert-title';
        title.textContent = alerta.titulo;
        
        const message = document.createElement('p');
        message.className = 'alert-message';
        message.textContent = alerta.mensagem;
        
        // Metadados do alerta
        const metaDiv = document.createElement('div');
        metaDiv.className = 'alert-meta';
        
        const category = document.createElement('span');
        category.className = 'badge bg-secondary';
        category.textContent = formatarCategoria(alerta.categoria);
        
        metaDiv.appendChild(category);
        
        if (!alerta.lido) {
            const unread = document.createElement('span');
            unread.className = 'badge bg-primary';
            unread.textContent = 'Não lido';
            metaDiv.appendChild(unread);
        }
        
        // Ações do alerta
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'alert-actions mt-3';
        
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-sm btn-outline-primary';
        detailsBtn.innerHTML = '<i data-feather="eye"></i> Detalhes';
        detailsBtn.setAttribute('data-id', alerta.id);
        detailsBtn.addEventListener('click', function() {
            abrirDetalhesAlerta(alerta.id);
        });
        
        const markReadBtn = document.createElement('button');
        markReadBtn.className = 'btn btn-sm btn-outline-secondary';
        markReadBtn.innerHTML = alerta.lido ? 
            '<i data-feather="check-circle"></i> Lido' : 
            '<i data-feather="circle"></i> Marcar como lido';
        markReadBtn.setAttribute('data-id', alerta.id);
        markReadBtn.addEventListener('click', function() {
            marcarComoLido(alerta.id);
        });
        
        actionsDiv.appendChild(detailsBtn);
        actionsDiv.appendChild(markReadBtn);
        
        // Adiciona todos os elementos ao card
        cardBody.appendChild(headerRow);
        cardBody.appendChild(title);
        cardBody.appendChild(message);
        cardBody.appendChild(metaDiv);
        cardBody.appendChild(actionsDiv);
        
        card.appendChild(cardBody);
        col.appendChild(card);
        listaAlertas.appendChild(col);
    });
    
    // Reinicializa os ícones Feather
    feather.replace();
}

/**
 * Configura os filtros de alertas
 */
function configurarFiltros() {
    const filtros = document.querySelectorAll('.dropdown-menu a[data-filter]');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filtroSelecionado = this.getAttribute('data-filter');
            carregarAlertas(filtroSelecionado);
            
            // Atualiza o texto do botão de filtro
            const textoFiltro = this.textContent;
            document.getElementById('dropdownFiltro').innerHTML = `<i data-feather="filter"></i> ${textoFiltro}`;
            feather.replace();
        });
    });
}

/**
 * Configura os switches de configuração
 */
function configurarSwitches() {
    const switches = document.querySelectorAll('.form-check-input[type="checkbox"]');
    
    switches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const id = this.id;
            const checked = this.checked;
            
            console.log(`Switch ${id} alterado para ${checked}`);
            
            // Aqui seria feita a chamada para a API para salvar a configuração
            // Por enquanto, apenas exibe uma mensagem no console
        });
    });
}

/**
 * Abre o modal de detalhes do alerta
 * @param {string} id - ID do alerta
 */
function abrirDetalhesAlerta(id) {
    // Busca os dados do alerta
    const alerta = buscarAlertaPorId(id);
    
    if (!alerta) {
        alert('Alerta não encontrado');
        return;
    }
    
    // Preenche os dados no modal
    document.getElementById('detalhesTitulo').textContent = alerta.titulo;
    document.getElementById('detalhesMensagem').textContent = alerta.mensagem;
    
    const badgeClass = `alert-badge ${alerta.prioridade}`;
    document.getElementById('detalhesPrioridade').className = badgeClass;
    document.getElementById('detalhesPrioridade').textContent = formatarPrioridade(alerta.prioridade);
    
    document.getElementById('detalhesData').textContent = formatarDataHora(alerta.data);
    document.getElementById('detalhesCategoria').textContent = formatarCategoria(alerta.categoria);
    document.getElementById('detalhesOrigem').textContent = alerta.origem;
    document.getElementById('detalhesId').textContent = alerta.id;
    document.getElementById('detalhesStatus').textContent = alerta.resolvido ? 'Resolvido' : 'Não resolvido';
    
    // Conteúdo específico do alerta
    const detalhesConteudo = document.getElementById('detalhesConteudo');
    detalhesConteudo.innerHTML = '';
    
    if (alerta.tipo === 'desempenho') {
        detalhesConteudo.innerHTML = criarConteudoDesempenho(alerta);
    } else if (alerta.tipo === 'meta') {
        detalhesConteudo.innerHTML = criarConteudoMeta(alerta);
    } else if (alerta.tipo === 'desafio') {
        detalhesConteudo.innerHTML = criarConteudoDesafio(alerta);
    } else if (alerta.tipo === 'recompensa') {
        detalhesConteudo.innerHTML = criarConteudoRecompensa(alerta);
    } else if (alerta.tipo === 'equipe') {
        detalhesConteudo.innerHTML = criarConteudoEquipe(alerta);
    } else {
        detalhesConteudo.innerHTML = `<div class="alert alert-info">Sem informações adicionais disponíveis.</div>`;
    }
    
    // Configura o botão de marcar como resolvido
    const btnMarcarResolvido = document.getElementById('marcarResolvido');
    
    if (alerta.resolvido) {
        btnMarcarResolvido.textContent = 'Reabrir Alerta';
        btnMarcarResolvido.classList.remove('btn-primary');
        btnMarcarResolvido.classList.add('btn-warning');
    } else {
        btnMarcarResolvido.textContent = 'Marcar como Resolvido';
        btnMarcarResolvido.classList.remove('btn-warning');
        btnMarcarResolvido.classList.add('btn-primary');
    }
    
    btnMarcarResolvido.onclick = function() {
        marcarComoResolvido(id);
    };
    
    // Marca o alerta como lido
    if (!alerta.lido) {
        marcarComoLido(id, false);
    }
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesAlerta'));
    modal.show();
}

/**
 * Cria o conteúdo específico para alertas de desempenho
 * @param {Object} alerta - Dados do alerta
 * @returns {string} HTML do conteúdo
 */
function criarConteudoDesempenho(alerta) {
    const dados = alerta.dados;
    
    return `
        <div class="card mb-3">
            <div class="card-header">
                Dados de Desempenho
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Loja/Franquia:</strong> ${dados.loja}</p>
                        <p><strong>Período:</strong> ${dados.periodo}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Meta:</strong> ${formatarMoeda(dados.meta)}</p>
                        <p><strong>Realizado:</strong> ${formatarMoeda(dados.realizado)}</p>
                    </div>
                </div>
                <div class="progress mt-2">
                    <div class="progress-bar ${dados.percentual < 70 ? 'bg-danger' : dados.percentual < 90 ? 'bg-warning' : 'bg-success'}" 
                        role="progressbar" style="width: ${dados.percentual}%"
                        aria-valuenow="${dados.percentual}" aria-valuemin="0" aria-valuemax="100">
                        ${dados.percentual}%
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-warning">
            <i data-feather="alert-triangle"></i>
            <strong>Ação Recomendada:</strong> ${dados.recomendacao}
        </div>
    `;
}

/**
 * Cria o conteúdo específico para alertas de meta
 * @param {Object} alerta - Dados do alerta
 * @returns {string} HTML do conteúdo
 */
function criarConteudoMeta(alerta) {
    const dados = alerta.dados;
    
    return `
        <div class="card mb-3">
            <div class="card-header">
                Dados da Meta
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Meta:</strong> ${dados.nome}</p>
                        <p><strong>Tipo:</strong> ${dados.tipo}</p>
                        <p><strong>Responsável:</strong> ${dados.responsavel}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Início:</strong> ${formatarData(dados.dataInicio)}</p>
                        <p><strong>Prazo:</strong> ${formatarData(dados.dataFim)}</p>
                        <p><strong>Dias Restantes:</strong> <span class="badge bg-${dados.diasRestantes <= 3 ? 'danger' : dados.diasRestantes <= 7 ? 'warning' : 'info'}">${dados.diasRestantes} dias</span></p>
                    </div>
                </div>
                <div class="progress mt-2">
                    <div class="progress-bar bg-primary" 
                        role="progressbar" style="width: ${dados.progresso}%"
                        aria-valuenow="${dados.progresso}" aria-valuemin="0" aria-valuemax="100">
                        ${dados.progresso}%
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-info">
            <i data-feather="info"></i>
            <strong>Ação Recomendada:</strong> ${dados.recomendacao}
        </div>
    `;
}

/**
 * Cria o conteúdo específico para alertas de desafio
 * @param {Object} alerta - Dados do alerta
 * @returns {string} HTML do conteúdo
 */
function criarConteudoDesafio(alerta) {
    const dados = alerta.dados;
    
    return `
        <div class="card mb-3">
            <div class="card-header">
                Dados do Desafio
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Desafio:</strong> ${dados.nome}</p>
                        <p><strong>Categoria:</strong> ${dados.categoria}</p>
                        <p><strong>Dificuldade:</strong> ${dados.dificuldade}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Início:</strong> ${formatarData(dados.dataInicio)}</p>
                        <p><strong>Término:</strong> ${formatarData(dados.dataFim)}</p>
                        <p><strong>Participantes:</strong> ${dados.participantes}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <p><strong>Taxa de Conclusão:</strong></p>
                    <div class="progress">
                        <div class="progress-bar bg-success" 
                            role="progressbar" style="width: ${dados.taxaConclusao}%"
                            aria-valuenow="${dados.taxaConclusao}" aria-valuemin="0" aria-valuemax="100">
                            ${dados.taxaConclusao}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-${dados.taxaConclusao < 30 ? 'danger' : 'warning'}">
            <i data-feather="alert-circle"></i>
            <strong>Ação Recomendada:</strong> ${dados.recomendacao}
        </div>
    `;
}

/**
 * Cria o conteúdo específico para alertas de recompensa
 * @param {Object} alerta - Dados do alerta
 * @returns {string} HTML do conteúdo
 */
function criarConteudoRecompensa(alerta) {
    const dados = alerta.dados;
    
    return `
        <div class="card mb-3">
            <div class="card-header">
                Dados da Recompensa
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Recompensa:</strong> ${dados.nome}</p>
                        <p><strong>Categoria:</strong> ${dados.categoria}</p>
                        <p><strong>Pontos:</strong> ${dados.pontos}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Estoque Atual:</strong> <span class="badge bg-${dados.estoque < 5 ? 'danger' : 'success'}">${dados.estoque} unidades</span></p>
                        <p><strong>Resgatados:</strong> ${dados.resgatados}</p>
                        <p><strong>Disponibilidade:</strong> ${dados.disponibilidade}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-warning">
            <i data-feather="alert-triangle"></i>
            <strong>Ação Recomendada:</strong> ${dados.recomendacao}
        </div>
    `;
}

/**
 * Cria o conteúdo específico para alertas de equipe
 * @param {Object} alerta - Dados do alerta
 * @returns {string} HTML do conteúdo
 */
function criarConteudoEquipe(alerta) {
    const dados = alerta.dados;
    
    let membrosHtml = '';
    dados.membros.forEach(membro => {
        membrosHtml += `
            <tr>
                <td>${membro.nome}</td>
                <td>${membro.cargo}</td>
                <td>${formatarMoeda(membro.vendas)}</td>
                <td>${membro.desempenho}%</td>
            </tr>
        `;
    });
    
    return `
        <div class="card mb-3">
            <div class="card-header">
                Dados da Equipe
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <p><strong>Equipe:</strong> ${dados.nome}</p>
                        <p><strong>Loja/Franquia:</strong> ${dados.loja}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Desempenho Médio:</strong> ${dados.desempenhoMedio}%</p>
                        <p><strong>Período:</strong> ${dados.periodo}</p>
                    </div>
                </div>
                
                <h6>Membros com Baixo Desempenho</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Vendas</th>
                                <th>Desempenho</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${membrosHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="alert alert-info">
            <i data-feather="info"></i>
            <strong>Ação Recomendada:</strong> ${dados.recomendacao}
        </div>
    `;
}

/**
 * Marca um alerta como lido
 * @param {string} id - ID do alerta
 * @param {boolean} recarregar - Se deve recarregar a lista de alertas
 */
function marcarComoLido(id, recarregar = true) {
    // Aqui seria feita a chamada para a API para marcar o alerta como lido
    console.log(`Alerta ${id} marcado como lido`);
    
    // Simula a atualização do alerta
    const alertas = JSON.parse(localStorage.getItem('alertas') || '[]');
    const index = alertas.findIndex(a => a.id === id);
    
    if (index !== -1) {
        alertas[index].lido = true;
        localStorage.setItem('alertas', JSON.stringify(alertas));
    }
    
    if (recarregar) {
        carregarAlertas();
    }
}

/**
 * Marca todos os alertas como lidos
 */
function marcarTodosComoLidos() {
    // Aqui seria feita a chamada para a API para marcar todos os alertas como lidos
    console.log('Todos os alertas marcados como lidos');
    
    // Simula a atualização dos alertas
    const alertas = JSON.parse(localStorage.getItem('alertas') || '[]');
    
    alertas.forEach(alerta => {
        alerta.lido = true;
    });
    
    localStorage.setItem('alertas', JSON.stringify(alertas));
    
    carregarAlertas();
}

/**
 * Marca um alerta como resolvido
 * @param {string} id - ID do alerta
 */
function marcarComoResolvido(id) {
    // Aqui seria feita a chamada para a API para marcar o alerta como resolvido
    console.log(`Alerta ${id} marcado como resolvido`);
    
    // Simula a atualização do alerta
    const alertas = JSON.parse(localStorage.getItem('alertas') || '[]');
    const index = alertas.findIndex(a => a.id === id);
    
    if (index !== -1) {
        alertas[index].resolvido = !alertas[index].resolvido;
        localStorage.setItem('alertas', JSON.stringify(alertas));
    }
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesAlerta'));
    modal.hide();
    
    carregarAlertas();
}

/**
 * Salva as configurações de alertas
 */
function salvarConfiguracoes() {
    // Obtém os valores dos campos
    const limiarDesempenho = document.getElementById('limiarDesempenho').value;
    const limiarEstoque = document.getElementById('limiarEstoque').value;
    const limiarPrazo = document.getElementById('limiarPrazo').value;
    
    const canalEmail = document.getElementById('canalEmail').checked;
    const canalSistema = document.getElementById('canalSistema').checked;
    const canalSMS = document.getElementById('canalSMS').checked;
    
    // Cria o objeto de configurações
    const configuracoes = {
        limiares: {
            desempenho: limiarDesempenho,
            estoque: limiarEstoque,
            prazo: limiarPrazo
        },
        canais: {
            email: canalEmail,
            sistema: canalSistema,
            sms: canalSMS
        }
    };
    
    // Aqui seria feita a chamada para a API para salvar as configurações
    console.log('Configurações salvas:', configuracoes);
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalConfiguracaoAlertas'));
    modal.hide();
    
    // Exibe mensagem de sucesso
    alert('Configurações salvas com sucesso!');
}

/**
 * Busca um alerta pelo ID
 * @param {string} id - ID do alerta
 * @returns {Object|null} Alerta encontrado ou null
 */
function buscarAlertaPorId(id) {
    const alertas = gerarDadosAlertas();
    return alertas.find(a => a.id === id) || null;
}

/**
 * Retorna o ícone apropriado para o tipo de alerta
 * @param {string} tipo - Tipo do alerta
 * @returns {string} Nome do ícone
 */
function getIconForAlertType(tipo) {
    switch (tipo) {
        case 'desempenho':
            return 'trending-down';
        case 'meta':
            return 'target';
        case 'desafio':
            return 'flag';
        case 'recompensa':
            return 'gift';
        case 'equipe':
            return 'users';
        default:
            return 'bell';
    }
}

/**
 * Formata uma prioridade
 * @param {string} prioridade - Código da prioridade
 * @returns {string} Nome formatado da prioridade
 */
function formatarPrioridade(prioridade) {
    switch (prioridade) {
        case 'high':
            return 'Alta';
        case 'medium':
            return 'Média';
        case 'low':
            return 'Baixa';
        case 'info':
            return 'Informativo';
        default:
            return prioridade;
    }
}

/**
 * Formata uma categoria
 * @param {string} categoria - Código da categoria
 * @returns {string} Nome formatado da categoria
 */
function formatarCategoria(categoria) {
    switch (categoria) {
        case 'desempenho':
            return 'Desempenho';
        case 'meta':
            return 'Meta';
        case 'desafio':
            return 'Desafio';
        case 'recompensa':
            return 'Recompensa';
        case 'equipe':
            return 'Equipe';
        default:
            return categoria;
    }
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
 * Formata uma data e hora
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {string} hora - Hora no formato HH:MM (opcional)
 * @returns {string} Data e hora formatadas
 */
function formatarDataHora(data, hora = '12:00') {
    if (!data) return '';
    
    return `${formatarData(data)} - ${hora}`;
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
 * Gera dados simulados de alertas
 * @returns {Array} Lista de alertas
 */
function gerarDadosAlertas() {
    // Verifica se já existem alertas no localStorage
    const alertasArmazenados = localStorage.getItem('alertas');
    
    if (alertasArmazenados) {
        return JSON.parse(alertasArmazenados);
    }
    
    // Alertas simulados
    const alertas = [
        {
            id: '1',
            titulo: 'Desempenho abaixo da meta',
            mensagem: 'A loja Centro está com desempenho abaixo de 80% da meta mensal.',
            tipo: 'desempenho',
            categoria: 'desempenho',
            prioridade: 'high',
            data: '2023-05-15',
            lido: false,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                loja: 'Centro',
                periodo: 'Maio/2023',
                meta: 150000,
                realizado: 110000,
                percentual: 73,
                recomendacao: 'Verificar os fatores que estão impactando as vendas e realizar uma reunião com a equipe para definir estratégias de recuperação.'
            }
        },
        {
            id: '2',
            titulo: 'Meta próxima do prazo',
            mensagem: 'A meta "Vendas Q2" vence em 3 dias e está com 85% de progresso.',
            tipo: 'meta',
            categoria: 'meta',
            prioridade: 'medium',
            data: '2023-05-14',
            lido: true,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                nome: 'Vendas Q2',
                tipo: 'Vendas',
                responsavel: 'Carlos Silva',
                dataInicio: '2023-04-01',
                dataFim: '2023-06-30',
                diasRestantes: 3,
                progresso: 85,
                recomendacao: 'Acompanhar diariamente o progresso e mobilizar a equipe para atingir a meta no prazo.'
            }
        },
        {
            id: '3',
            titulo: 'Baixa participação em desafio',
            mensagem: 'O desafio "Campeão de Vendas" tem apenas 30% de participação.',
            tipo: 'desafio',
            categoria: 'desafio',
            prioridade: 'medium',
            data: '2023-05-13',
            lido: false,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                nome: 'Campeão de Vendas',
                categoria: 'Vendas',
                dificuldade: 'Média',
                dataInicio: '2023-05-01',
                dataFim: '2023-05-31',
                participantes: 15,
                taxaConclusao: 30,
                recomendacao: 'Promover o desafio entre os vendedores e destacar os benefícios da participação.'
            }
        },
        {
            id: '4',
            titulo: 'Estoque baixo de recompensa',
            mensagem: 'A recompensa "Vale-presente R$100" está com estoque baixo (3 unidades).',
            tipo: 'recompensa',
            categoria: 'recompensa',
            prioridade: 'low',
            data: '2023-05-12',
            lido: false,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                nome: 'Vale-presente R$100',
                categoria: 'Vale-presente',
                pontos: 2000,
                estoque: 3,
                resgatados: 47,
                disponibilidade: 'Nacional',
                recomendacao: 'Repor o estoque ou criar uma recompensa alternativa para substituição.'
            }
        },
        {
            id: '5',
            titulo: 'Equipe com baixo desempenho',
            mensagem: 'A equipe da loja Shopping tem 3 vendedores com desempenho abaixo de 70%.',
            tipo: 'equipe',
            categoria: 'equipe',
            prioridade: 'high',
            data: '2023-05-11',
            lido: true,
            resolvido: true,
            origem: 'Sistema',
            dados: {
                nome: 'Equipe Shopping',
                loja: 'Shopping',
                desempenhoMedio: 65,
                periodo: 'Maio/2023',
                membros: [
                    { nome: 'Ana Silva', cargo: 'Vendedor', vendas: 15000, desempenho: 60 },
                    { nome: 'João Oliveira', cargo: 'Vendedor', vendas: 12500, desempenho: 50 },
                    { nome: 'Maria Santos', cargo: 'Vendedor', vendas: 17500, desempenho: 70 }
                ],
                recomendacao: 'Realizar treinamento de reciclagem e acompanhamento individual com os vendedores.'
            }
        },
        {
            id: '6',
            titulo: 'Nova meta criada',
            mensagem: 'Uma nova meta "Vendas Promocionais" foi criada e atribuída à sua equipe.',
            tipo: 'meta',
            categoria: 'meta',
            prioridade: 'info',
            data: '2023-05-10',
            lido: true,
            resolvido: true,
            origem: 'Admin',
            dados: {
                nome: 'Vendas Promocionais',
                tipo: 'Vendas',
                responsavel: 'Carlos Silva',
                dataInicio: '2023-05-15',
                dataFim: '2023-06-15',
                diasRestantes: 30,
                progresso: 0,
                recomendacao: 'Revisar os detalhes da meta e planejar a execução com a equipe.'
            }
        },
        {
            id: '7',
            titulo: 'Desafio concluído com sucesso',
            mensagem: 'O desafio "Excelência no Atendimento" foi concluído com 95% de participação.',
            tipo: 'desafio',
            categoria: 'desafio',
            prioridade: 'info',
            data: '2023-05-09',
            lido: true,
            resolvido: true,
            origem: 'Sistema',
            dados: {
                nome: 'Excelência no Atendimento',
                categoria: 'Atendimento',
                dificuldade: 'Fácil',
                dataInicio: '2023-04-01',
                dataFim: '2023-04-30',
                participantes: 25,
                taxaConclusao: 95,
                recomendacao: 'Reconhecer os participantes e utilizar as lições aprendidas para futuros desafios.'
            }
        },
        {
            id: '8',
            titulo: 'Recompensa popular esgotada',
            mensagem: 'A recompensa "Fone de ouvido Bluetooth" foi esgotada em apenas 2 dias.',
            tipo: 'recompensa',
            categoria: 'recompensa',
            prioridade: 'medium',
            data: '2023-05-08',
            lido: false,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                nome: 'Fone de ouvido Bluetooth',
                categoria: 'Produto',
                pontos: 5000,
                estoque: 0,
                resgatados: 10,
                disponibilidade: 'Nacional',
                recomendacao: 'Repor o estoque com urgência devido à alta demanda.'
            }
        },
        {
            id: '9',
            titulo: 'Tendência de queda nas vendas',
            mensagem: 'Identificada tendência de queda nas vendas da categoria Eletrônicos nos últimos 3 meses.',
            tipo: 'desempenho',
            categoria: 'desempenho',
            prioridade: 'high',
            data: '2023-05-07',
            lido: true,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                loja: 'Todas',
                periodo: 'Mar-Mai/2023',
                meta: 500000,
                realizado: 425000,
                percentual: 85,
                recomendacao: 'Analisar os fatores de mercado e concorrência que podem estar impactando as vendas desta categoria.'
            }
        },
        {
            id: '10',
            titulo: 'Vendedor destaque do mês',
            mensagem: 'Pedro Almeida foi o vendedor destaque do mês de Abril com 150% da meta.',
            tipo: 'equipe',
            categoria: 'equipe',
            prioridade: 'info',
            data: '2023-05-06',
            lido: true,
            resolvido: true,
            origem: 'Sistema',
            dados: {
                nome: 'Equipe Centro',
                loja: 'Centro',
                desempenhoMedio: 110,
                periodo: 'Abril/2023',
                membros: [
                    { nome: 'Pedro Almeida', cargo: 'Vendedor', vendas: 45000, desempenho: 150 }
                ],
                recomendacao: 'Reconhecer publicamente o desempenho e compartilhar as práticas bem-sucedidas com a equipe.'
            }
        },
        {
            id: '11',
            titulo: 'Oportunidade de melhoria identificada',
            mensagem: 'Análise de dados identificou oportunidade de melhoria no processo de vendas cruzadas.',
            tipo: 'desempenho',
            categoria: 'desempenho',
            prioridade: 'low',
            data: '2023-05-05',
            lido: false,
            resolvido: false,
            origem: 'Sistema',
            dados: {
                loja: 'Todas',
                periodo: 'Jan-Abr/2023',
                meta: 200000,
                realizado: 180000,
                percentual: 90,
                recomendacao: 'Implementar treinamento específico sobre técnicas de vendas cruzadas e complementares.'
            }
        },
        {
            id: '12',
            titulo: 'Novo desafio disponível',
            mensagem: 'Um novo desafio "Especialista em Produtos" está disponível para participação.',
            tipo: 'desafio',
            categoria: 'desafio',
            prioridade: 'info',
            data: '2023-05-04',
            lido: true,
            resolvido: true,
            origem: 'Admin',
            dados: {
                nome: 'Especialista em Produtos',
                categoria: 'Conhecimento',
                dificuldade: 'Média',
                dataInicio: '2023-05-15',
                dataFim: '2023-06-15',
                participantes: 0,
                taxaConclusao: 0,
                recomendacao: 'Divulgar o desafio entre os vendedores e incentivar a participação.'
            }
        }
    ];
    
    // Armazena os alertas no localStorage
    localStorage.setItem('alertas', JSON.stringify(alertas));
    
    return alertas;
}