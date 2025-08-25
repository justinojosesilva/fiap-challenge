/**
 * JavaScript para as funcionalidades do painel do vendedor
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Inicializa tooltips e popovers do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Configuração do modal de resgate de recompensas
    setupRewardModal();

    // Configuração dos filtros de histórico
    setupHistoryFilters();

    // Animação para os cards do dashboard
    animateDashboardCards();
});

/**
 * Configura o modal de resgate de recompensas
 */
function setupRewardModal() {
    var resgateModal = document.getElementById('resgateModal');
    if (resgateModal) {
        resgateModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget;
            var reward = button.getAttribute('data-reward');
            var points = button.getAttribute('data-points');
            
            var rewardNameElement = document.getElementById('rewardName');
            var rewardPointsElement = document.getElementById('rewardPoints');
            var pointsAfterElement = document.getElementById('pointsAfter');
            
            if (rewardNameElement) rewardNameElement.textContent = reward;
            if (rewardPointsElement) rewardPointsElement.textContent = points;
            
            // Calcula pontos restantes
            var currentPoints = 1250;
            var pointsAfter = currentPoints - parseInt(points);
            if (pointsAfterElement) pointsAfterElement.textContent = pointsAfter;
        });
    }
    
    // Botão de confirmação de resgate
    var confirmResgateBtn = document.getElementById('confirmResgateBtn');
    if (confirmResgateBtn) {
        confirmResgateBtn.addEventListener('click', function() {
            alert('Resgate realizado com sucesso! Você receberá mais informações por e-mail.');
            var modalInstance = bootstrap.Modal.getInstance(resgateModal);
            modalInstance.hide();
        });
    }
}

/**
 * Configura os filtros da página de histórico
 */
function setupHistoryFilters() {
    var historyFilterForm = document.querySelector('.card form');
    if (historyFilterForm) {
        historyFilterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Aqui seria implementada a lógica de filtro real
            // Por enquanto, apenas exibe uma mensagem
            alert('Filtros aplicados com sucesso!');
        });
    }
}

/**
 * Adiciona animações aos cards do dashboard
 */
function animateDashboardCards() {
    var cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(function(card, index) {
        // Adiciona um pequeno atraso para cada card
        setTimeout(function() {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Força um reflow
            card.offsetHeight;
            
            // Adiciona transição
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Anima para o estado final
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Atualiza o progresso dos desafios em tempo real (simulação)
 */
function updateChallengeProgress() {
    // Esta função seria chamada por um endpoint real
    // Por enquanto, apenas simula atualizações aleatórias
    
    var progressBars = document.querySelectorAll('#desafios-ativos .progress-bar');
    
    progressBars.forEach(function(bar) {
        var currentWidth = parseInt(bar.style.width);
        var randomIncrement = Math.floor(Math.random() * 5);
        
        if (currentWidth < 100) {
            var newWidth = Math.min(currentWidth + randomIncrement, 100);
            bar.style.width = newWidth + '%';
            bar.setAttribute('aria-valuenow', newWidth);
            
            // Atualiza o texto dentro da barra de progresso
            var total = parseInt(bar.textContent.split('/')[1]);
            var current = Math.ceil(total * (newWidth / 100));
            bar.textContent = current + '/' + total;
        }
    });
}