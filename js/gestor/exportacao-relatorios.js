/**
 * Exportação de Relatórios - Sistema de Gamificação para Vendas
 * Script para gerenciamento de exportação de relatórios para gerentes e administradores
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones Feather
    feather.replace();
    
    // Verifica autenticação - apenas gerentes e admins podem acessar
    verificarAutenticacao(['gestor', 'admin']);
    
    // Inicializa o sistema de notificações
    inicializarNotificacoes();
    
    // Configura o botão de logout
    document.getElementById('logout').addEventListener('click', fazerLogout);
    
    // Carrega os tipos de relatórios disponíveis
    carregarTiposRelatorios();
    
    // Configura os filtros de relatórios
    configurarFiltros();
    
    // Configura o botão de gerar relatório
    document.getElementById('gerarRelatorio').addEventListener('click', gerarRelatorio);
    
    // Configura o botão de agendar relatório
    document.getElementById('agendarRelatorio').addEventListener('click', agendarRelatorio);
    
    // Configura o botão de salvar agendamento
    document.getElementById('salvarAgendamento').addEventListener('click', salvarAgendamento);
    
    // Carrega os relatórios recentes
    carregarRelatoriosRecentes();
    
    // Carrega os relatórios agendados
    carregarRelatoriosAgendados();
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
    
    // if (!perfisPermitidos.includes(usuarioLogado.perfil)) {
    //     alert('Você não tem permissão para acessar esta página');
    //     window.location.href = 'dashboard.html';
    // }

        // Verifica autenticação
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'gestor' && currentUser.role !== 'admin')) {
        window.location.href = '../../index.html';
        return;
    }
    
    // Exibe o nome do usuário logado
    // document.querySelector('.navbar-brand').textContent = `Sistema de Gamificação | ${usuarioLogado.nome}`;
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
 * Carrega os tipos de relatórios disponíveis
 */
function carregarTiposRelatorios() {
    // Tipos de relatórios disponíveis
    const tiposRelatorios = [
        { id: 'vendas', nome: 'Relatório de Vendas', descricao: 'Dados de vendas por período, loja, vendedor e produto', icone: 'dollar-sign' },
        { id: 'metas', nome: 'Relatório de Metas', descricao: 'Status e progresso das metas por tipo, período e responsável', icone: 'target' },
        { id: 'desafios', nome: 'Relatório de Desafios', descricao: 'Participação e conclusão de desafios por categoria e dificuldade', icone: 'flag' },
        { id: 'recompensas', nome: 'Relatório de Recompensas', descricao: 'Resgates de recompensas por categoria, período e loja', icone: 'gift' },
        { id: 'desempenho', nome: 'Relatório de Desempenho', descricao: 'Desempenho de vendedores e equipes por período e loja', icone: 'trending-up' },
        { id: 'pontuacao', nome: 'Relatório de Pontuação', descricao: 'Pontos acumulados, resgatados e disponíveis por vendedor e loja', icone: 'award' }
    ];
    
    // Preenche o select de tipos de relatórios
    const selectTipo = document.getElementById('tipoRelatorio');
    
    tiposRelatorios.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nome;
        selectTipo.appendChild(option);
    });
    
    // Preenche os cards de tipos de relatórios
    const containerTipos = document.getElementById('tiposRelatorios');
    
    tiposRelatorios.forEach(tipo => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        const card = document.createElement('div');
        card.className = 'card h-100 report-type-card';
        card.setAttribute('data-tipo', tipo.id);
        card.addEventListener('click', function() {
            selecionarTipoRelatorio(tipo.id);
        });
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'report-icon mb-3';
        iconDiv.innerHTML = `<i data-feather="${tipo.icone}"></i>`;
        
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = tipo.nome;
        
        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = tipo.descricao;
        
        cardBody.appendChild(iconDiv);
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        
        card.appendChild(cardBody);
        col.appendChild(card);
        containerTipos.appendChild(col);
    });
    
    // Reinicializa os ícones Feather
    feather.replace();
}

/**
 * Seleciona um tipo de relatório
 * @param {string} tipoId - ID do tipo de relatório
 */
function selecionarTipoRelatorio(tipoId) {
    // Remove a classe 'selected' de todos os cards
    document.querySelectorAll('.report-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adiciona a classe 'selected' ao card selecionado
    document.querySelector(`.report-type-card[data-tipo="${tipoId}"]`).classList.add('selected');
    
    // Seleciona o tipo no select
    document.getElementById('tipoRelatorio').value = tipoId;
    
    // Atualiza os campos de filtro de acordo com o tipo selecionado
    atualizarCamposFiltro(tipoId);
}

/**
 * Atualiza os campos de filtro de acordo com o tipo de relatório selecionado
 * @param {string} tipoId - ID do tipo de relatório
 */
function atualizarCamposFiltro(tipoId) {
    // Oculta todos os campos de filtro específicos
    document.querySelectorAll('.filtro-especifico').forEach(filtro => {
        filtro.style.display = 'none';
    });
    
    // Exibe os campos de filtro comuns
    document.getElementById('filtroPeriodo').style.display = 'block';
    document.getElementById('filtroFormato').style.display = 'block';
    
    // Exibe os campos de filtro específicos de acordo com o tipo
    switch (tipoId) {
        case 'vendas':
            document.getElementById('filtroLoja').style.display = 'block';
            document.getElementById('filtroVendedor').style.display = 'block';
            document.getElementById('filtroProduto').style.display = 'block';
            break;
        case 'metas':
            document.getElementById('filtroTipoMeta').style.display = 'block';
            document.getElementById('filtroStatus').style.display = 'block';
            document.getElementById('filtroResponsavel').style.display = 'block';
            break;
        case 'desafios':
            document.getElementById('filtroCategoria').style.display = 'block';
            document.getElementById('filtroDificuldade').style.display = 'block';
            document.getElementById('filtroStatus').style.display = 'block';
            break;
        case 'recompensas':
            document.getElementById('filtroCategoria').style.display = 'block';
            document.getElementById('filtroLoja').style.display = 'block';
            document.getElementById('filtroStatus').style.display = 'block';
            break;
        case 'desempenho':
            document.getElementById('filtroLoja').style.display = 'block';
            document.getElementById('filtroVendedor').style.display = 'block';
            document.getElementById('filtroIndicador').style.display = 'block';
            break;
        case 'pontuacao':
            document.getElementById('filtroLoja').style.display = 'block';
            document.getElementById('filtroVendedor').style.display = 'block';
            document.getElementById('filtroTipoPonto').style.display = 'block';
            break;
    }
}

/**
 * Configura os filtros de relatórios
 */
function configurarFiltros() {
    // Configura o filtro de período
    document.getElementById('periodoInicio').valueAsDate = new Date(new Date().setDate(1)); // Primeiro dia do mês atual
    document.getElementById('periodoFim').valueAsDate = new Date(); // Data atual
    
    // Configura o filtro de período personalizado
    document.getElementById('periodoPredefinido').addEventListener('change', function() {
        const periodo = this.value;
        
        if (periodo === 'personalizado') {
            document.getElementById('periodoPersonalizado').style.display = 'block';
        } else {
            document.getElementById('periodoPersonalizado').style.display = 'none';
            
            const hoje = new Date();
            let dataInicio = new Date();
            
            switch (periodo) {
                case 'hoje':
                    dataInicio = hoje;
                    break;
                case 'ontem':
                    dataInicio = new Date(hoje.setDate(hoje.getDate() - 1));
                    break;
                case '7dias':
                    dataInicio = new Date(hoje.setDate(hoje.getDate() - 7));
                    break;
                case '30dias':
                    dataInicio = new Date(hoje.setDate(hoje.getDate() - 30));
                    break;
                case 'mes_atual':
                    dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    break;
                case 'mes_anterior':
                    dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                    hoje = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
                    break;
                case 'ano_atual':
                    dataInicio = new Date(hoje.getFullYear(), 0, 1);
                    break;
            }
            
            document.getElementById('periodoInicio').valueAsDate = dataInicio;
            document.getElementById('periodoFim').valueAsDate = hoje;
        }
    });
    
    // Configura o filtro de tipo de relatório
    document.getElementById('tipoRelatorio').addEventListener('change', function() {
        selecionarTipoRelatorio(this.value);
    });
}

/**
 * Gera um relatório com base nos filtros selecionados
 */
function gerarRelatorio() {
    // Obtém os valores dos filtros
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    const formato = document.getElementById('formatoRelatorio').value;
    const periodoInicio = document.getElementById('periodoInicio').value;
    const periodoFim = document.getElementById('periodoFim').value;
    
    // Verifica se o tipo de relatório foi selecionado
    if (!tipoRelatorio) {
        alert('Selecione um tipo de relatório');
        return;
    }
    
    // Verifica se o período foi informado
    if (!periodoInicio || !periodoFim) {
        alert('Informe o período do relatório');
        return;
    }
    
    // Obtém os filtros específicos de acordo com o tipo
    const filtrosEspecificos = obterFiltrosEspecificos(tipoRelatorio);
    
    // Simula a geração do relatório
    console.log('Gerando relatório:', {
        tipo: tipoRelatorio,
        formato: formato,
        periodoInicio: periodoInicio,
        periodoFim: periodoFim,
        filtros: filtrosEspecificos
    });
    
    // Exibe mensagem de sucesso
    const toast = new bootstrap.Toast(document.getElementById('toastSucesso'));
    document.getElementById('toastMensagem').textContent = `Relatório de ${obterNomeTipoRelatorio(tipoRelatorio)} gerado com sucesso!`;
    toast.show();
    
    // Simula o download do relatório
    setTimeout(() => {
        const nomeArquivo = `relatorio_${tipoRelatorio}_${formatarDataArquivo(new Date())}.${formato}`;
        simularDownload(nomeArquivo, tipoRelatorio, formato);
    }, 1500);
    
    // Adiciona o relatório à lista de recentes
    adicionarRelatorioRecente(tipoRelatorio, formato, periodoInicio, periodoFim, filtrosEspecificos);
}

/**
 * Obtém os filtros específicos de acordo com o tipo de relatório
 * @param {string} tipoId - ID do tipo de relatório
 * @returns {Object} Objeto com os filtros específicos
 */
function obterFiltrosEspecificos(tipoId) {
    const filtros = {};
    
    switch (tipoId) {
        case 'vendas':
            filtros.loja = document.getElementById('loja').value;
            filtros.vendedor = document.getElementById('vendedor').value;
            filtros.produto = document.getElementById('produto').value;
            break;
        case 'metas':
            filtros.tipoMeta = document.getElementById('tipoMeta').value;
            filtros.status = document.getElementById('status').value;
            filtros.responsavel = document.getElementById('responsavel').value;
            break;
        case 'desafios':
            filtros.categoria = document.getElementById('categoria').value;
            filtros.dificuldade = document.getElementById('dificuldade').value;
            filtros.status = document.getElementById('status').value;
            break;
        case 'recompensas':
            filtros.categoria = document.getElementById('categoria').value;
            filtros.loja = document.getElementById('loja').value;
            filtros.status = document.getElementById('status').value;
            break;
        case 'desempenho':
            filtros.loja = document.getElementById('loja').value;
            filtros.vendedor = document.getElementById('vendedor').value;
            filtros.indicador = document.getElementById('indicador').value;
            break;
        case 'pontuacao':
            filtros.loja = document.getElementById('loja').value;
            filtros.vendedor = document.getElementById('vendedor').value;
            filtros.tipoPonto = document.getElementById('tipoPonto').value;
            break;
    }
    
    return filtros;
}

/**
 * Obtém o nome do tipo de relatório pelo ID
 * @param {string} tipoId - ID do tipo de relatório
 * @returns {string} Nome do tipo de relatório
 */
function obterNomeTipoRelatorio(tipoId) {
    const tipos = {
        'vendas': 'Vendas',
        'metas': 'Metas',
        'desafios': 'Desafios',
        'recompensas': 'Recompensas',
        'desempenho': 'Desempenho',
        'pontuacao': 'Pontuação'
    };
    
    return tipos[tipoId] || tipoId;
}

/**
 * Simula o download de um arquivo
 * @param {string} nomeArquivo - Nome do arquivo
 * @param {string} tipoRelatorio - Tipo do relatório
 * @param {string} formato - Formato do arquivo
 */
function simularDownload(nomeArquivo, tipoRelatorio, formato) {
    // Cria um elemento <a> para simular o download
    const link = document.createElement('a');
    
    // Define o conteúdo do arquivo de acordo com o formato
    let conteudo = '';
    
    if (formato === 'csv') {
        conteudo = gerarConteudoCSV(tipoRelatorio);
    } else if (formato === 'json') {
        conteudo = gerarConteudoJSON(tipoRelatorio);
    } else {
        conteudo = gerarConteudoTXT(tipoRelatorio);
    }
    
    // Cria um blob com o conteúdo
    const blob = new Blob([conteudo], { type: obterTipoMIME(formato) });
    
    // Cria uma URL para o blob
    const url = URL.createObjectURL(blob);
    
    // Configura o link para download
    link.href = url;
    link.download = nomeArquivo;
    
    // Adiciona o link ao documento
    document.body.appendChild(link);
    
    // Simula o clique no link
    link.click();
    
    // Remove o link do documento
    document.body.removeChild(link);
    
    // Libera a URL
    URL.revokeObjectURL(url);
}

/**
 * Gera o conteúdo do arquivo CSV
 * @param {string} tipoRelatorio - Tipo do relatório
 * @returns {string} Conteúdo do arquivo CSV
 */
function gerarConteudoCSV(tipoRelatorio) {
    let conteudo = '';
    
    // Cabeçalho do CSV
    switch (tipoRelatorio) {
        case 'vendas':
            conteudo = 'Data,Loja,Vendedor,Produto,Quantidade,Valor\n';
            // Dados simulados
            conteudo += '2023-05-01,Centro,João Silva,Produto A,2,R$ 150.00\n';
            conteudo += '2023-05-02,Shopping,Maria Oliveira,Produto B,1,R$ 200.00\n';
            conteudo += '2023-05-03,Centro,Pedro Santos,Produto C,3,R$ 300.00\n';
            break;
        case 'metas':
            conteudo = 'Meta,Tipo,Responsável,Data Início,Data Fim,Progresso,Status\n';
            // Dados simulados
            conteudo += 'Vendas Q2,Vendas,Carlos Silva,2023-04-01,2023-06-30,85%,Em andamento\n';
            conteudo += 'Novos Clientes,Captação,Ana Souza,2023-05-01,2023-05-31,100%,Concluída\n';
            conteudo += 'Treinamento Equipe,Desenvolvimento,João Silva,2023-05-15,2023-06-15,50%,Em andamento\n';
            break;
        case 'desafios':
            conteudo = 'Desafio,Categoria,Dificuldade,Data Início,Data Fim,Participantes,Taxa Conclusão\n';
            // Dados simulados
            conteudo += 'Campeão de Vendas,Vendas,Média,2023-05-01,2023-05-31,15,30%\n';
            conteudo += 'Excelência no Atendimento,Atendimento,Fácil,2023-04-01,2023-04-30,25,95%\n';
            conteudo += 'Especialista em Produtos,Conhecimento,Média,2023-05-15,2023-06-15,10,20%\n';
            break;
        case 'recompensas':
            conteudo = 'Recompensa,Categoria,Pontos,Estoque,Resgatados,Disponibilidade\n';
            // Dados simulados
            conteudo += 'Vale-presente R$100,Vale-presente,2000,3,47,Nacional\n';
            conteudo += 'Fone de ouvido Bluetooth,Produto,5000,0,10,Nacional\n';
            conteudo += 'Dia de folga,Benefício,10000,Ilimitado,5,Nacional\n';
            break;
        case 'desempenho':
            conteudo = 'Vendedor,Loja,Vendas,Meta,Desempenho,Ranking\n';
            // Dados simulados
            conteudo += 'João Silva,Centro,R$ 45.000,R$ 30.000,150%,1\n';
            conteudo += 'Maria Oliveira,Shopping,R$ 25.000,R$ 30.000,83%,5\n';
            conteudo += 'Pedro Santos,Centro,R$ 35.000,R$ 30.000,117%,3\n';
            break;
        case 'pontuacao':
            conteudo = 'Vendedor,Loja,Pontos Acumulados,Pontos Resgatados,Pontos Disponíveis\n';
            // Dados simulados
            conteudo += 'João Silva,Centro,15000,5000,10000\n';
            conteudo += 'Maria Oliveira,Shopping,8000,3000,5000\n';
            conteudo += 'Pedro Santos,Centro,12000,2000,10000\n';
            break;
    }
    
    return conteudo;
}

/**
 * Gera o conteúdo do arquivo JSON
 * @param {string} tipoRelatorio - Tipo do relatório
 * @returns {string} Conteúdo do arquivo JSON
 */
function gerarConteudoJSON(tipoRelatorio) {
    let dados = [];
    
    // Dados simulados
    switch (tipoRelatorio) {
        case 'vendas':
            dados = [
                { data: '2023-05-01', loja: 'Centro', vendedor: 'João Silva', produto: 'Produto A', quantidade: 2, valor: 'R$ 150.00' },
                { data: '2023-05-02', loja: 'Shopping', vendedor: 'Maria Oliveira', produto: 'Produto B', quantidade: 1, valor: 'R$ 200.00' },
                { data: '2023-05-03', loja: 'Centro', vendedor: 'Pedro Santos', produto: 'Produto C', quantidade: 3, valor: 'R$ 300.00' }
            ];
            break;
        case 'metas':
            dados = [
                { meta: 'Vendas Q2', tipo: 'Vendas', responsavel: 'Carlos Silva', dataInicio: '2023-04-01', dataFim: '2023-06-30', progresso: '85%', status: 'Em andamento' },
                { meta: 'Novos Clientes', tipo: 'Captação', responsavel: 'Ana Souza', dataInicio: '2023-05-01', dataFim: '2023-05-31', progresso: '100%', status: 'Concluída' },
                { meta: 'Treinamento Equipe', tipo: 'Desenvolvimento', responsavel: 'João Silva', dataInicio: '2023-05-15', dataFim: '2023-06-15', progresso: '50%', status: 'Em andamento' }
            ];
            break;
        case 'desafios':
            dados = [
                { desafio: 'Campeão de Vendas', categoria: 'Vendas', dificuldade: 'Média', dataInicio: '2023-05-01', dataFim: '2023-05-31', participantes: 15, taxaConclusao: '30%' },
                { desafio: 'Excelência no Atendimento', categoria: 'Atendimento', dificuldade: 'Fácil', dataInicio: '2023-04-01', dataFim: '2023-04-30', participantes: 25, taxaConclusao: '95%' },
                { desafio: 'Especialista em Produtos', categoria: 'Conhecimento', dificuldade: 'Média', dataInicio: '2023-05-15', dataFim: '2023-06-15', participantes: 10, taxaConclusao: '20%' }
            ];
            break;
        case 'recompensas':
            dados = [
                { recompensa: 'Vale-presente R$100', categoria: 'Vale-presente', pontos: 2000, estoque: 3, resgatados: 47, disponibilidade: 'Nacional' },
                { recompensa: 'Fone de ouvido Bluetooth', categoria: 'Produto', pontos: 5000, estoque: 0, resgatados: 10, disponibilidade: 'Nacional' },
                { recompensa: 'Dia de folga', categoria: 'Benefício', pontos: 10000, estoque: 'Ilimitado', resgatados: 5, disponibilidade: 'Nacional' }
            ];
            break;
        case 'desempenho':
            dados = [
                { vendedor: 'João Silva', loja: 'Centro', vendas: 'R$ 45.000', meta: 'R$ 30.000', desempenho: '150%', ranking: 1 },
                { vendedor: 'Maria Oliveira', loja: 'Shopping', vendas: 'R$ 25.000', meta: 'R$ 30.000', desempenho: '83%', ranking: 5 },
                { vendedor: 'Pedro Santos', loja: 'Centro', vendas: 'R$ 35.000', meta: 'R$ 30.000', desempenho: '117%', ranking: 3 }
            ];
            break;
        case 'pontuacao':
            dados = [
                { vendedor: 'João Silva', loja: 'Centro', pontosAcumulados: 15000, pontosResgatados: 5000, pontosDisponiveis: 10000 },
                { vendedor: 'Maria Oliveira', loja: 'Shopping', pontosAcumulados: 8000, pontosResgatados: 3000, pontosDisponiveis: 5000 },
                { vendedor: 'Pedro Santos', loja: 'Centro', pontosAcumulados: 12000, pontosResgatados: 2000, pontosDisponiveis: 10000 }
            ];
            break;
    }
    
    return JSON.stringify({ dados: dados }, null, 2);
}

/**
 * Gera o conteúdo do arquivo TXT
 * @param {string} tipoRelatorio - Tipo do relatório
 * @returns {string} Conteúdo do arquivo TXT
 */
function gerarConteudoTXT(tipoRelatorio) {
    let conteudo = `Relatório de ${obterNomeTipoRelatorio(tipoRelatorio)}\n`;
    conteudo += `Data de geração: ${formatarDataHora(new Date())}\n\n`;
    
    // Conteúdo específico de acordo com o tipo
    switch (tipoRelatorio) {
        case 'vendas':
            conteudo += 'RELATÓRIO DE VENDAS\n\n';
            conteudo += 'Data       | Loja     | Vendedor       | Produto   | Qtd | Valor\n';
            conteudo += '-----------|----------|----------------|-----------|-----|----------\n';
            conteudo += '01/05/2023 | Centro   | João Silva     | Produto A | 2   | R$ 150.00\n';
            conteudo += '02/05/2023 | Shopping | Maria Oliveira | Produto B | 1   | R$ 200.00\n';
            conteudo += '03/05/2023 | Centro   | Pedro Santos   | Produto C | 3   | R$ 300.00\n';
            conteudo += '\nTotal: R$ 650.00\n';
            break;
        case 'metas':
            conteudo += 'RELATÓRIO DE METAS\n\n';
            conteudo += 'Meta                | Tipo          | Responsável   | Início     | Fim        | Progresso | Status\n';
            conteudo += '--------------------|---------------|---------------|------------|------------|-----------|-------------\n';
            conteudo += 'Vendas Q2           | Vendas        | Carlos Silva  | 01/04/2023 | 30/06/2023 | 85%       | Em andamento\n';
            conteudo += 'Novos Clientes      | Captação      | Ana Souza     | 01/05/2023 | 31/05/2023 | 100%      | Concluída\n';
            conteudo += 'Treinamento Equipe  | Desenvolvimento| João Silva    | 15/05/2023 | 15/06/2023 | 50%       | Em andamento\n';
            break;
        case 'desafios':
            conteudo += 'RELATÓRIO DE DESAFIOS\n\n';
            conteudo += 'Desafio                  | Categoria    | Dificuldade | Início     | Fim        | Participantes | Taxa Conclusão\n';
            conteudo += '-------------------------|--------------|-------------|------------|------------|--------------|---------------\n';
            conteudo += 'Campeão de Vendas        | Vendas       | Média       | 01/05/2023 | 31/05/2023 | 15           | 30%\n';
            conteudo += 'Excelência no Atendimento| Atendimento  | Fácil       | 01/04/2023 | 30/04/2023 | 25           | 95%\n';
            conteudo += 'Especialista em Produtos | Conhecimento | Média       | 15/05/2023 | 15/06/2023 | 10           | 20%\n';
            break;
        case 'recompensas':
            conteudo += 'RELATÓRIO DE RECOMPENSAS\n\n';
            conteudo += 'Recompensa             | Categoria     | Pontos | Estoque   | Resgatados | Disponibilidade\n';
            conteudo += '-----------------------|---------------|--------|-----------|------------|---------------\n';
            conteudo += 'Vale-presente R$100    | Vale-presente | 2000   | 3         | 47         | Nacional\n';
            conteudo += 'Fone de ouvido Bluetooth| Produto      | 5000   | 0         | 10         | Nacional\n';
            conteudo += 'Dia de folga           | Benefício     | 10000  | Ilimitado | 5          | Nacional\n';
            break;
        case 'desempenho':
            conteudo += 'RELATÓRIO DE DESEMPENHO\n\n';
            conteudo += 'Vendedor       | Loja     | Vendas     | Meta       | Desempenho | Ranking\n';
            conteudo += '---------------|----------|------------|------------|------------|-------\n';
            conteudo += 'João Silva     | Centro   | R$ 45.000  | R$ 30.000  | 150%       | 1\n';
            conteudo += 'Maria Oliveira | Shopping | R$ 25.000  | R$ 30.000  | 83%        | 5\n';
            conteudo += 'Pedro Santos   | Centro   | R$ 35.000  | R$ 30.000  | 117%       | 3\n';
            break;
        case 'pontuacao':
            conteudo += 'RELATÓRIO DE PONTUAÇÃO\n\n';
            conteudo += 'Vendedor       | Loja     | Pontos Acumulados | Pontos Resgatados | Pontos Disponíveis\n';
            conteudo += '---------------|----------|-------------------|-------------------|------------------\n';
            conteudo += 'João Silva     | Centro   | 15.000            | 5.000             | 10.000\n';
            conteudo += 'Maria Oliveira | Shopping | 8.000             | 3.000             | 5.000\n';
            conteudo += 'Pedro Santos   | Centro   | 12.000            | 2.000             | 10.000\n';
            break;
    }
    
    return conteudo;
}

/**
 * Obtém o tipo MIME de acordo com o formato do arquivo
 * @param {string} formato - Formato do arquivo
 * @returns {string} Tipo MIME
 */
function obterTipoMIME(formato) {
    switch (formato) {
        case 'csv':
            return 'text/csv';
        case 'json':
            return 'application/json';
        default:
            return 'text/plain';
    }
}

/**
 * Abre o modal de agendamento de relatório
 */
function agendarRelatorio() {
    // Obtém os valores dos filtros
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    const formato = document.getElementById('formatoRelatorio').value;
    const periodoInicio = document.getElementById('periodoInicio').value;
    const periodoFim = document.getElementById('periodoFim').value;
    
    // Verifica se o tipo de relatório foi selecionado
    if (!tipoRelatorio) {
        alert('Selecione um tipo de relatório');
        return;
    }
    
    // Preenche os campos do modal
    document.getElementById('agendamentoTipo').value = tipoRelatorio;
    document.getElementById('agendamentoFormato').value = formato;
    
    // Preenche o nome do relatório
    document.getElementById('agendamentoNome').value = `Relatório de ${obterNomeTipoRelatorio(tipoRelatorio)} - ${formatarData(new Date())}`;
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalAgendarRelatorio'));
    modal.show();
}

/**
 * Salva o agendamento de relatório
 */
function salvarAgendamento() {
    // Obtém os valores dos campos
    const nome = document.getElementById('agendamentoNome').value;
    const tipo = document.getElementById('agendamentoTipo').value;
    const formato = document.getElementById('agendamentoFormato').value;
    const frequencia = document.getElementById('agendamentoFrequencia').value;
    const destinatarios = document.getElementById('agendamentoDestinatarios').value;
    
    // Verifica se o nome foi informado
    if (!nome) {
        alert('Informe o nome do agendamento');
        return;
    }
    
    // Verifica se a frequência foi informada
    if (!frequencia) {
        alert('Selecione a frequência do agendamento');
        return;
    }
    
    // Simula o salvamento do agendamento
    console.log('Agendamento salvo:', {
        nome: nome,
        tipo: tipo,
        formato: formato,
        frequencia: frequencia,
        destinatarios: destinatarios
    });
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgendarRelatorio'));
    modal.hide();
    
    // Exibe mensagem de sucesso
    const toast = new bootstrap.Toast(document.getElementById('toastSucesso'));
    document.getElementById('toastMensagem').textContent = 'Agendamento salvo com sucesso!';
    toast.show();
    
    // Adiciona o agendamento à lista
    adicionarRelatorioAgendado(nome, tipo, formato, frequencia, destinatarios);
}

/**
 * Carrega os relatórios recentes
 */
function carregarRelatoriosRecentes() {
    // Simula a obtenção de dados do servidor
    const relatorios = JSON.parse(localStorage.getItem('relatoriosRecentes') || '[]');
    
    // Atualiza a lista de relatórios recentes
    atualizarListaRelatoriosRecentes(relatorios);
}

/**
 * Atualiza a lista de relatórios recentes
 * @param {Array} relatorios - Lista de relatórios
 */
function atualizarListaRelatoriosRecentes(relatorios) {
    const listaRelatorios = document.getElementById('relatoriosRecentes');
    listaRelatorios.innerHTML = '';
    
    if (relatorios.length === 0) {
        listaRelatorios.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum relatório recente.</td></tr>';
        return;
    }
    
    relatorios.forEach(relatorio => {
        const tr = document.createElement('tr');
        
        const tdNome = document.createElement('td');
        tdNome.textContent = relatorio.nome;
        
        const tdData = document.createElement('td');
        tdData.textContent = formatarDataHora(relatorio.data);
        
        const tdFormato = document.createElement('td');
        tdFormato.textContent = relatorio.formato.toUpperCase();
        
        const tdPeriodo = document.createElement('td');
        tdPeriodo.textContent = `${formatarData(relatorio.periodoInicio)} a ${formatarData(relatorio.periodoFim)}`;
        
        const tdAcoes = document.createElement('td');
        tdAcoes.className = 'text-end';
        
        const btnDownload = document.createElement('button');
        btnDownload.className = 'btn btn-sm btn-outline-primary me-1';
        btnDownload.innerHTML = '<i data-feather="download"></i>';
        btnDownload.setAttribute('title', 'Download');
        btnDownload.addEventListener('click', function() {
            simularDownload(`relatorio_${relatorio.tipo}_${formatarDataArquivo(new Date())}.${relatorio.formato}`, relatorio.tipo, relatorio.formato);
        });
        
        const btnRecriar = document.createElement('button');
        btnRecriar.className = 'btn btn-sm btn-outline-secondary';
        btnRecriar.innerHTML = '<i data-feather="refresh-cw"></i>';
        btnRecriar.setAttribute('title', 'Recriar');
        btnRecriar.addEventListener('click', function() {
            recriarRelatorio(relatorio);
        });
        
        tdAcoes.appendChild(btnDownload);
        tdAcoes.appendChild(btnRecriar);
        
        tr.appendChild(tdNome);
        tr.appendChild(tdData);
        tr.appendChild(tdFormato);
        tr.appendChild(tdPeriodo);
        tr.appendChild(tdAcoes);
        
        listaRelatorios.appendChild(tr);
    });
    
    // Reinicializa os ícones Feather
    feather.replace();
}

/**
 * Adiciona um relatório à lista de recentes
 * @param {string} tipo - Tipo do relatório
 * @param {string} formato - Formato do relatório
 * @param {string} periodoInicio - Data de início do período
 * @param {string} periodoFim - Data de fim do período
 * @param {Object} filtros - Filtros específicos
 */
function adicionarRelatorioRecente(tipo, formato, periodoInicio, periodoFim, filtros) {
    // Obtém os relatórios recentes
    const relatorios = JSON.parse(localStorage.getItem('relatoriosRecentes') || '[]');
    
    // Cria o novo relatório
    const novoRelatorio = {
        id: gerarId(),
        nome: `Relatório de ${obterNomeTipoRelatorio(tipo)}`,
        tipo: tipo,
        formato: formato,
        periodoInicio: periodoInicio,
        periodoFim: periodoFim,
        filtros: filtros,
        data: formatarDataArquivo(new Date())
    };
    
    // Adiciona o novo relatório à lista
    relatorios.unshift(novoRelatorio);
    
    // Limita a lista a 10 relatórios
    if (relatorios.length > 10) {
        relatorios.pop();
    }
    
    // Salva a lista atualizada
    localStorage.setItem('relatoriosRecentes', JSON.stringify(relatorios));
    
    // Atualiza a lista de relatórios recentes
    atualizarListaRelatoriosRecentes(relatorios);
}

/**
 * Recria um relatório
 * @param {Object} relatorio - Dados do relatório
 */
function recriarRelatorio(relatorio) {
    // Seleciona o tipo de relatório
    document.getElementById('tipoRelatorio').value = relatorio.tipo;
    selecionarTipoRelatorio(relatorio.tipo);
    
    // Seleciona o formato
    document.getElementById('formatoRelatorio').value = relatorio.formato;
    
    // Define o período
    document.getElementById('periodoInicio').value = relatorio.periodoInicio;
    document.getElementById('periodoFim').value = relatorio.periodoFim;
    
    // Define os filtros específicos
    if (relatorio.filtros) {
        for (const [key, value] of Object.entries(relatorio.filtros)) {
            const elemento = document.getElementById(key);
            if (elemento) {
                elemento.value = value;
            }
        }
    }
    
    // Rola a página para o topo
    window.scrollTo(0, 0);
}

/**
 * Carrega os relatórios agendados
 */
function carregarRelatoriosAgendados() {
    // Simula a obtenção de dados do servidor
    const agendamentos = JSON.parse(localStorage.getItem('relatoriosAgendados') || '[]');
    
    // Atualiza a lista de relatórios agendados
    atualizarListaRelatoriosAgendados(agendamentos);
}

/**
 * Atualiza a lista de relatórios agendados
 * @param {Array} agendamentos - Lista de agendamentos
 */
function atualizarListaRelatoriosAgendados(agendamentos) {
    const listaAgendamentos = document.getElementById('relatoriosAgendados');
    listaAgendamentos.innerHTML = '';
    
    if (agendamentos.length === 0) {
        listaAgendamentos.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum relatório agendado.</td></tr>';
        return;
    }
    
    agendamentos.forEach(agendamento => {
        const tr = document.createElement('tr');
        
        const tdNome = document.createElement('td');
        tdNome.textContent = agendamento.nome;
        
        const tdTipo = document.createElement('td');
        tdTipo.textContent = obterNomeTipoRelatorio(agendamento.tipo);
        
        const tdFrequencia = document.createElement('td');
        tdFrequencia.textContent = formatarFrequencia(agendamento.frequencia);
        
        const tdProximaExecucao = document.createElement('td');
        tdProximaExecucao.textContent = calcularProximaExecucao(agendamento.frequencia);
        
        const tdAcoes = document.createElement('td');
        tdAcoes.className = 'text-end';
        
        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-sm btn-outline-primary me-1';
        btnEditar.innerHTML = '<i data-feather="edit"></i>';
        btnEditar.setAttribute('title', 'Editar');
        btnEditar.addEventListener('click', function() {
            editarAgendamento(agendamento);
        });
        
        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn btn-sm btn-outline-danger';
        btnExcluir.innerHTML = '<i data-feather="trash-2"></i>';
        btnExcluir.setAttribute('title', 'Excluir');
        btnExcluir.addEventListener('click', function() {
            excluirAgendamento(agendamento.id);
        });
        
        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        
        tr.appendChild(tdNome);
        tr.appendChild(tdTipo);
        tr.appendChild(tdFrequencia);
        tr.appendChild(tdProximaExecucao);
        tr.appendChild(tdAcoes);
        
        listaAgendamentos.appendChild(tr);
    });
    
    // Reinicializa os ícones Feather
    feather.replace();
}

/**
 * Adiciona um relatório à lista de agendados
 * @param {string} nome - Nome do agendamento
 * @param {string} tipo - Tipo do relatório
 * @param {string} formato - Formato do relatório
 * @param {string} frequencia - Frequência do agendamento
 * @param {string} destinatarios - Destinatários do relatório
 */
function adicionarRelatorioAgendado(nome, tipo, formato, frequencia, destinatarios) {
    // Obtém os relatórios agendados
    const agendamentos = JSON.parse(localStorage.getItem('relatoriosAgendados') || '[]');
    
    // Cria o novo agendamento
    const novoAgendamento = {
        id: gerarId(),
        nome: nome,
        tipo: tipo,
        formato: formato,
        frequencia: frequencia,
        destinatarios: destinatarios,
        dataCriacao: formatarDataArquivo(new Date())
    };
    
    // Adiciona o novo agendamento à lista
    agendamentos.push(novoAgendamento);
    
    // Salva a lista atualizada
    localStorage.setItem('relatoriosAgendados', JSON.stringify(agendamentos));
    
    // Atualiza a lista de relatórios agendados
    atualizarListaRelatoriosAgendados(agendamentos);
}

/**
 * Edita um agendamento
 * @param {Object} agendamento - Dados do agendamento
 */
function editarAgendamento(agendamento) {
    // Preenche os campos do modal
    document.getElementById('agendamentoNome').value = agendamento.nome;
    document.getElementById('agendamentoTipo').value = agendamento.tipo;
    document.getElementById('agendamentoFormato').value = agendamento.formato;
    document.getElementById('agendamentoFrequencia').value = agendamento.frequencia;
    document.getElementById('agendamentoDestinatarios').value = agendamento.destinatarios;
    
    // Armazena o ID do agendamento
    document.getElementById('agendamentoId').value = agendamento.id;
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalAgendarRelatorio'));
    modal.show();
}

/**
 * Exclui um agendamento
 * @param {string} id - ID do agendamento
 */
function excluirAgendamento(id) {
    // Confirma a exclusão
    if (!confirm('Deseja realmente excluir este agendamento?')) {
        return;
    }
    
    // Obtém os relatórios agendados
    const agendamentos = JSON.parse(localStorage.getItem('relatoriosAgendados') || '[]');
    
    // Remove o agendamento
    const novosAgendamentos = agendamentos.filter(a => a.id !== id);
    
    // Salva a lista atualizada
    localStorage.setItem('relatoriosAgendados', JSON.stringify(novosAgendamentos));
    
    // Atualiza a lista de relatórios agendados
    atualizarListaRelatoriosAgendados(novosAgendamentos);
    
    // Exibe mensagem de sucesso
    const toast = new bootstrap.Toast(document.getElementById('toastSucesso'));
    document.getElementById('toastMensagem').textContent = 'Agendamento excluído com sucesso!';
    toast.show();
}

/**
 * Formata uma data
 * @param {Date} data - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatarData(data) {
    if (!data) return '';
    
    if (typeof data === 'string') {
        // Se for uma string no formato YYYY-MM-DD
        const partes = data.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    
    // Se for um objeto Date
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
}

/**
 * Formata uma data e hora
 * @param {Date} data - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
function formatarDataHora(data) {
    if (!data) return '';
    
    if (typeof data === 'string') {
        // Se for uma string no formato YYYY-MM-DD
        return `${formatarData(data)} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Se for um objeto Date
    return `${formatarData(data)} ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Formata uma data para nome de arquivo
 * @param {Date} data - Data a ser formatada
 * @returns {string} Data formatada para nome de arquivo
 */
function formatarDataArquivo(data) {
    if (!data) return '';
    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${ano}-${mes}-${dia}`;
}

/**
 * Formata uma frequência
 * @param {string} frequencia - Código da frequência
 * @returns {string} Frequência formatada
 */
function formatarFrequencia(frequencia) {
    switch (frequencia) {
        case 'diario':
            return 'Diário';
        case 'semanal':
            return 'Semanal';
        case 'quinzenal':
            return 'Quinzenal';
        case 'mensal':
            return 'Mensal';
        default:
            return frequencia;
    }
}

/**
 * Calcula a próxima execução de um agendamento
 * @param {string} frequencia - Frequência do agendamento
 * @returns {string} Data da próxima execução
 */
function calcularProximaExecucao(frequencia) {
    const hoje = new Date();
    let proximaExecucao = new Date();
    
    switch (frequencia) {
        case 'diario':
            proximaExecucao.setDate(hoje.getDate() + 1);
            break;
        case 'semanal':
            proximaExecucao.setDate(hoje.getDate() + 7);
            break;
        case 'quinzenal':
            proximaExecucao.setDate(hoje.getDate() + 15);
            break;
        case 'mensal':
            proximaExecucao.setMonth(hoje.getMonth() + 1);
            break;
    }
    
    return formatarData(proximaExecucao);
}

/**
 * Gera um ID único
 * @returns {string} ID gerado
 */
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}