let timer = 60;

function reloadDashboard() {
  const iframe = document.getElementById('powerbi-frame');
  iframe.src = iframe.src;
  timer = 60;
}

setInterval(() => {
  timer--;
  if (timer <= 0) {
    reloadDashboard();
  }
  document.getElementById('timer').textContent = timer;
}, 1000);

function toggleFormulario() {
  const form = document.getElementById('formulario');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Cria a tabela de registros se ainda não existir
function criarTabelaSeNecessario() {
  if (!document.getElementById('tabela-registros')) {
    const resultado = document.getElementById('resultado');
    const table = document.createElement('table');
    table.id = 'tabela-registros';
    table.border = '1';
    table.style.width = '100%';
    table.style.marginTop = '10px';
    table.innerHTML = `
      <thead>
        <tr style="background-color:#e0e0e0">
          <th>Componente</th>
          <th>Modelo</th>
          <th>Ações</th>
          <th>Responsável</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    resultado.appendChild(table);
  }
}

function salvarAcao() {
  const componente = document.getElementById('componente').value.trim();
  const modelo = document.getElementById('modelo').value.trim();
  const acoes = document.getElementById('acoes').value.trim();
  const responsavel = document.getElementById('responsavel').value.trim();

  if (!componente || !modelo || !acoes || !responsavel) {
    alert("Preencha todos os campos.");
    return;
  }

  criarTabelaSeNecessario();
  const tbody = document.querySelector('#tabela-registros tbody');
  const novaLinha = document.createElement('tr');

  novaLinha.innerHTML = `
    <td>${componente}</td>
    <td>${modelo}</td>
    <td>${acoes}</td>
    <td>${responsavel}</td>
  `;

  tbody.appendChild(novaLinha);

  // Limpa os campos
  document.getElementById('componente').value = '';
  document.getElementById('modelo').value = '';
  document.getElementById('acoes').value = '';
  document.getElementById('responsavel').value = '';

  // Oculta o formulário após salvar
  document.getElementById('formulario').style.display = 'none';
}

function fecharFormulario() {
  document.getElementById('formulario').style.display = 'none';
}