// script.js

// Função para recarregar apenas o iframe do Power BI
function reloadDashboard() {
    const iframe = document.getElementById('powerbi-frame');
    if (iframe) {
        // Obtém a URL original do iframe
        const originalSrc = iframe.src;
        // Define o src do iframe como uma string vazia e depois de volta para a original
        // Isso força o navegador a recarregar o conteúdo do iframe
        iframe.src = ''; 
        iframe.src = originalSrc;
        console.log("Painel do Power BI atualizado.");
    } else {
        console.error("Iframe do Power BI não encontrado.");
    }
}

// Lógica para o contador regressivo (countdown)
let timerInterval;
let timeLeft = 60; // Tempo inicial em segundos

function startCountdown() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error("Elemento do timer não encontrado.");
        return;
    }

    // Limpa qualquer intervalo existente para evitar múltiplos timers
    clearInterval(timerInterval); 

    timeLeft = 60; // Reinicia o contador
    timerElement.innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            reloadDashboard(); // Recarrega o dashboard automaticamente
            startCountdown(); // Reinicia o contador para a próxima atualização automática
        }
    }, 1000); // Atualiza a cada 1 segundo
}

// Função para abrir o formulário de registro (já existente no seu HTML)
// Esta função apenas abre uma nova janela/aba para 'registro.html'
function abrirRegistro() {
    window.open("registro.html", "Registro de Ações", "width=900,height=600");
}

// Funções de formulário (se 'registro.html' as usar, elas devem estar lá ou aqui se for um SPA)
// Estas funções são apenas placeholders, pois a lógica real do formulário está em 'registro.html'
function fecharFormulario() {
    const formulario = document.getElementById('formulario');
    if (formulario) {
        formulario.style.display = 'none';
    }
}

function salvarAcao() {
    // Esta função precisaria de mais lógica se o formulário estivesse nesta página
    // Como ele abre uma nova janela, esta função pode não ser usada aqui.
    console.log("Ação salva (lógica de salvamento precisa ser implementada).");
    // Exemplo: pegar valores dos inputs e fazer algo com eles
    // const componente = document.getElementById('componente').value;
    // ...
}


// Inicia o contador regressivo assim que a página é carregada
window.onload = startCountdown;
