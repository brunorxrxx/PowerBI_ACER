// Funções já usadas no HTML
function abrirRegistro() {
  window.open("registro.html", "Registro de Ações", "width=900,height=600");
}

function reloadDashboard() {
  const iframe = document.getElementById('powerbi-frame');
  iframe.src = iframe.src;
}

function abrirImagemAdmin() {
  window.open('imagem-admin.html', 'Imagem', 'width=600,height=600');
}

// Código para gerenciar as ações

const tabela = document.getElementById("tabela-acoes")?.getElementsByTagName('tbody')[0];
const dadosSalvos = JSON.parse(localStorage.getItem("acoesRegistradas")) || [];

if (tabela) {
  dadosSalvos.forEach(item => inserirLinha(item));
}

function salvarAcao() {
  const modelo = document.getElementById("modelo").value.trim();
  const responsavel = document.getElementById("responsavel").value.trim();
  const componente = document.getElementById("componente").value.trim();
  const causa = document.getElementById("causa")?.value.trim() || "";
  const acoes = document.getElementById("acoes").value.trim();

  if (!modelo || !responsavel || !componente || !acoes || (document.getElementById("causa") && !causa)) {
    alert("Preencha todos os campos.");
    return;
  }

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' +
    dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const novaAcao = { data: dataFormatada, modelo, responsavel, componente, causa, acoes };
  inserirLinha(novaAcao);

  dadosSalvos.push(novaAcao);
  localStorage.setItem("acoesRegistradas", JSON.stringify(dadosSalvos));

  // Limpa campos
  document.getElementById("modelo").value = "";
  document.getElementById("responsavel").value = "";
  document.getElementById("componente").value = "";
  if (document.getElementById("causa")) document.getElementById("causa").value = "";
  document.getElementById("acoes").value = "";
}

function inserirLinha(acao) {
  if (!tabela) return;
  const linha = tabela.insertRow();
  linha.insertCell(0).innerText = acao.data;
  linha.insertCell(1).innerText = acao.modelo;
  linha.insertCell(2).innerText = acao.responsavel;
  linha.insertCell(3).innerText = acao.componente;
  linha.insertCell(4).innerText = acao.causa || "";
  linha.insertCell(5).innerText = acao.acoes;

  // Célula de ações (Excluir e Editar)

  const cellExcluir = linha.insertCell(6);
  const botao = document.createElement("button");
  botao.innerText = "Excluir";
  botao.className = "btn-excluir";

  botao.onclick = function () {
    const senha = prompt("Digite a senha para excluir:");
    if (senha === "123") {
      const index = Array.from(tabela.rows).indexOf(linha);
      dadosSalvos.splice(index, 1);
      localStorage.setItem("acoesRegistradas", JSON.stringify(dadosSalvos));
      tabela.deleteRow(index);
    } else {
      alert("Senha incorreta.");
    }
  };

  cellExcluir.appendChild(botao);
}

// Função para voltar para o painel principal
document.addEventListener('DOMContentLoaded', () => {
  const btnVoltar = document.getElementById('btnVoltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      // Tentar fechar a janela (funciona só se aberta por JS)
      window.close();

      // Redireciona para o painel
      window.location.href = "https://brunorxrxx.github.io/PowerBI_ACER/";
    });
  }
});
