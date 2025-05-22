// A variável 'timer' foi removida, pois não é mais necessária.

// Funções utilitárias (podem ser definidas fora do DOMContentLoaded se forem globais e não dependerem do DOM)
function displayMessage(message) {
  const messageBox = document.createElement('div');
  messageBox.style.position = 'fixed';
  messageBox.style.top = '50%';
  messageBox.style.left = '50%';
  messageBox.style.transform = 'translate(-50%, -50%)';
  messageBox.style.backgroundColor = '#f8d7da';
  messageBox.style.color = '#721c24';
  messageBox.style.border = '1px solid #f5c6cb';
  messageBox.style.padding = '15px 20px';
  messageBox.style.borderRadius = '8px';
  messageBox.style.zIndex = '1000';
  messageBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  messageBox.style.fontFamily = 'Inter', 'sans-serif';
  messageBox.style.fontSize = '16px';
  messageBox.style.textAlign = 'center';
  messageBox.textContent = message;
  document.body.appendChild(messageBox);
  setTimeout(() => { messageBox.remove(); }, 3000);
}

function showLoading(message = 'Gerando sugestões...') {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-indicator';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '50%';
  loadingDiv.style.left = '50%';
  loadingDiv.style.transform = 'translate(-50%, -50%)';
  loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Fundo semi-transparente
  loadingDiv.style.color = '#fff';
  loadingDiv.style.padding = '20px 30px';
  loadingDiv.style.borderRadius = '10px';
  loadingDiv.style.zIndex = '1001';
  loadingDiv.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
  loadingDiv.style.fontFamily = 'Inter', 'sans-serif';
  loadingDiv.style.fontSize = '18px';
  loadingDiv.style.textAlign = 'center';
  loadingDiv.innerHTML = `<div class="spinner"></div><p class="mt-2">${message}</p>`; // Spinner precisa de CSS
  document.body.appendChild(loadingDiv);
}

function hideLoading() {
  const loadingDiv = document.getElementById('loading-indicator');
  if (loadingDiv) { loadingDiv.remove(); } // CORREÇÃO: Usar loadingDiv.remove()
}

function showLLMResponseModal(title, content) {
  const modal = document.getElementById('llm-response-modal');
  const modalTitle = document.getElementById('llm-modal-title');
  const modalContent = document.getElementById('llm-modal-content');
  if (modal && modalTitle && modalContent) {
    modalTitle.textContent = title;
    modalContent.innerHTML = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/^- (.*)/gm, '<li>$1</li>').replace(/^# (.*)/gm, '<h2>$1</h2>');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function hideLLMResponseModal() {
  const modal = document.getElementById('llm-response-modal');
  if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

async function gerarSugestoesAcao(componente, modelo, acoes) {
  showLoading();
  const prompt = `Com base no componente '${componente}', modelo '${modelo}', e ações '${acoes}', forneça um breve resumo da ação e sugira 2-3 próximos passos ou recomendações relevantes. Formate a resposta usando Markdown com títulos e listas.`;
  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });
  const payload = { contents: chatHistory };
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    hideLoading();
    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      showLLMResponseModal('Sugestões do Gemini ✨', text);
    } else {
      displayMessage("Não foi possível gerar sugestões. Tente novamente.");
      console.error("A API Gemini retornou uma estrutura inesperada:", result);
    }
  } catch (error) {
    hideLoading();
    displayMessage("Erro ao conectar com a API Gemini. Verifique sua conexão.");
    console.error("Erro ao chamar a API Gemini:", error);
  }
}

// Funções que interagem com o DOM e precisam ser chamadas após o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
  // Funções principais do painel
  function reloadDashboard() {
    const iframe = document.getElementById('powerbi-frame');
    iframe.src = iframe.src;
    hideFilterDropdown(); // Esconde o dropdown após a ação
  }

  // FUNÇÃO ATUALIZADA: Agora alterna a classe 'hidden' do Tailwind
  function toggleFormulario() {
    const form = document.getElementById('formulario');
    form.classList.toggle('hidden'); // Alterna a classe 'hidden'
    hideFilterDropdown(); // Esconde o dropdown após a ação
  }

  // Funções de controle do dropdown
  function toggleFilterDropdown() {
    const dropdown = document.getElementById('filter-dropdown');
    dropdown.classList.toggle('hidden');
  }

  function hideFilterDropdown() {
    const dropdown = document.getElementById('filter-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) { // Verifica se o dropdown existe antes de tentar manipular
      dropdown.classList.add('hidden');
    }
  }

  // FUNÇÃO ATUALIZADA: Agora adiciona a classe 'hidden' ao formulário
  function fecharFormulario() {
    const form = document.getElementById('formulario');
    form.classList.add('hidden'); // Adiciona a classe 'hidden' para esconder
  }

  function salvarAcao() {
    const componente = document.getElementById('componente').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const acoes = document.getElementById('acoes').value.trim();
    const responsavel = document.getElementById('responsavel').value.trim();

    if (!componente || !modelo || !acoes || !responsavel) {
      displayMessage("Preencha todos os campos.");
      return;
    }

    criarTabelaSeNecessario();
    const tbody = document.querySelector('#tabela-registros tbody');
    const novaLinha = document.createElement('tr');

    novaLinha.innerHTML = `
      <td class="p-3 border border-gray-700 text-gray-300">${componente}</td>
      <td class="p-3 border border-gray-700 text-gray-300">${modelo}</td>
      <td class="p-3 border border-gray-700 text-gray-300">${acoes}</td>
      <td class="p-3 border border-gray-700 text-gray-300">${responsavel}</td>
      <td class="p-3 border border-gray-700 text-center">
        <button onclick="gerarSugestoesAcao('${componente}', '${modelo}', '${acoes}')"
                class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm">
          ✨ Gerar Sugestões
        </button>
      </td>
    `;

    tbody.appendChild(novaLinha);

    document.getElementById('componente').value = '';
    document.getElementById('modelo').value = '';
    document.getElementById('acoes').value = '';
    document.getElementById('responsavel').value = '';
    // FUNÇÃO ATUALIZADA: Agora adiciona a classe 'hidden' ao formulário
    document.getElementById('formulario').classList.add('hidden');
  }

  function criarTabelaSeNecessario() {
    if (!document.getElementById('tabela-registros')) {
      const resultado = document.getElementById('resultado');
      const table = document.createElement('table');
      table.id = 'tabela-registros';
      table.classList.add('min-w-full', 'bg-gray-800', 'border', 'border-gray-700', 'rounded-lg', 'shadow-md');
      table.style.marginTop = '20px';

      table.innerHTML = `
        <thead>
          <tr class="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Componente</th>
            <th class="py-3 px-6 text-left">Modelo</th>
            <th class="py-3 px-6 text-left">Ações</th>
            <th class="py-3 px-6 text-left">Responsável</th>
            <th class="py-3 px-6 text-center">IA</th>
          </tr>
        </thead>
        <tbody class="text-gray-300 text-sm font-light"></tbody>
      `;
      resultado.appendChild(table);
    }
  }

  // Anexar ouvintes de eventos aos botões estáticos
  document.getElementById('toggle-filter-button').addEventListener('click', toggleFilterDropdown);
  document.getElementById('reload-dashboard-button').addEventListener('click', reloadDashboard);
  document.getElementById('toggle-formulario-button').addEventListener('click', toggleFormulario);
  document.getElementById('fechar-formulario-button').addEventListener('click', fecharFormulario);
  document.getElementById('salvar-acao-button').addEventListener('click', salvarAcao);
  document.getElementById('hide-llm-modal-button').addEventListener('click', hideLLMResponseModal);

  // Ouvinte de evento para fechar o dropdown se clicar fora dele
  document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('filter-dropdown');
    const filterButton = document.getElementById('toggle-filter-button');
    
    // Verifica se o clique não foi no dropdown nem no botão que o abre
    if (dropdown && !dropdown.contains(event.target) && !filterButton.contains(event.target)) {
      hideFilterDropdown();
    }
  });

}); // Fim de DOMContentLoaded
