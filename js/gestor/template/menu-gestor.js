function carregarMenu() {
    fetch('./template/menu-gestor.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebarMenu').innerHTML = data;
        feather.replace();
    });
}

carregarMenu();

function navegar(e, url) {
    e.preventDefault();
    window.location.href = url;
}