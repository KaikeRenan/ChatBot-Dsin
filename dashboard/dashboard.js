// Configurar gráficos
document.addEventListener('DOMContentLoaded', function () {
    const topicsCtx = document.getElementById('topicsDonutChart').getContext('2d');
    new Chart(topicsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Sobre a DSIN', 'Sobre o Trânsito'],
            datasets: [{
                label: 'Distribuição de Tópicos',
                data: [60,40],
                backgroundColor: ['#fecc00', '#476bff']
            }]
        },
        options: { animation: { duration: 1000 } }
    });

    const messagesCtx = document.getElementById('messagesLineChart').getContext('2d');
    new Chart(messagesCtx, {
        type: 'line',
        data: {
            labels: ['Agosto', 'Setembro', 'Outubro', 'Novembro',],
            datasets: [{
                label: 'Mensagens',
                data: [10, 15, 20, 25, 30, 35],
                borderColor: '#ff6961',
                fill: false,
                tension: 0.1
            }]
        },
        options: { animation: { duration: 1000 } }
    });

    const timeCtx = document.getElementById('interactionTimeChart').getContext('2d');
    new Chart(timeCtx, {
        type: 'bar',
        data: {
            labels: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
            datasets: [{
                label: 'Interações',
                data: [5, 10, 8, 12, 10, 25],
                backgroundColor: '#00969e'
            }]
        },
        options: { animation: { duration: 1000 } }
    });
});