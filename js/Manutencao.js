document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção de Elementos
    const addHistoryBtn = document.querySelector('.add-history-btn');
    const historyTableBody = document.querySelector('.history-table tbody');
    const dataInput = document.getElementById('dataInput');
    const descricaoInput = document.getElementById('descricaoInput');

    // Função para obter o TIPO de manutenção selecionado
    function getSelectedManutencaoType() {
        const selectedRadio = document.querySelector('input[name="manutencaoType"]:checked');
        if (selectedRadio) {
            // Pega o texto do label associado ao radio button
            const label = document.querySelector(`label[for="${selectedRadio.id}"]`);
            return label ? label.textContent : '';
        }
        return '';
    }

    // Função para formatar a data de 'YYYY-MM-DD' para 'DD/MM/YYYY'
    function formatarData(dataISO) {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Função para adicionar uma nova linha ao histórico
    function addHistoryRow(data, descricao, tipo) {
        // Formata a data antes de inserir
        const dataFormatada = formatarData(data);
        
        // Remove a última linha vazia para manter a aparência de "preenchida"
        const linhas = historyTableBody.querySelectorAll('tr');
        if (linhas.length > 0) {
             // Verifica se a última linha está vazia antes de remover
            const ultimaLinha = linhas[linhas.length - 1];
            const celulasVazias = Array.from(ultimaLinha.querySelectorAll('td')).every(td => td.textContent.trim() === '');
            if (celulasVazias) {
                historyTableBody.removeChild(ultimaLinha);
            }
        }
        
        // Cria a nova linha (tr)
        const newRow = document.createElement('tr');
        
        // Cria as células (td) e define seus conteúdos
        newRow.innerHTML = `
            <td class="history-data-cell">${dataFormatada}</td>
            <td class="history-description-cell">${descricao}</td>
            <td class="history-type-cell">${tipo}</td>
            <td class="trash-column"><i class="fas fa-trash-alt trash-icon"></i></td>
        `;

        // Adiciona a classe para estilo da linha de dados
        newRow.querySelector('td:not(.trash-column)').style.color = '#333';
        newRow.querySelector('td:not(.trash-column)').style.fontWeight = '500';

        // Adiciona a nova linha ao corpo da tabela
        historyTableBody.prepend(newRow); // Adiciona no início (topo)
        
        // Adiciona uma nova linha vazia no final para manter o layout
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td></td><td></td><td></td><td></td>`;
        historyTableBody.appendChild(emptyRow);


        // Reatribui o evento de remoção para a nova linha
        addRemoveListener(newRow);

        // Limpa os campos de entrada após a adição
        descricaoInput.value = '';
        
        // Opcional: Alerta de sucesso
        // alert('Manutenção adicionada com sucesso!');
    }

    // Função para adicionar o listener de remoção a uma linha
    function addRemoveListener(row) {
        const trashIcon = row.querySelector('.trash-icon');
        if (trashIcon) {
            trashIcon.addEventListener('click', (event) => {
                const rowToRemove = event.target.closest('tr');
                if (confirm('Tem certeza de que deseja remover este registro de manutenção?')) {
                    rowToRemove.remove();
                    
                    // Adiciona uma nova linha vazia para preencher o espaço, se necessário
                    const emptyRow = document.createElement('tr');
                    emptyRow.innerHTML = `<td></td><td></td><td></td><td></td>`;
                    historyTableBody.appendChild(emptyRow);
                }
            });
        }
    }
    
    // 2. Event Listener para o Botão de Adição
    addHistoryBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Impede o comportamento padrão do botão se estiver em um formulário
        
        const data = dataInput.value;
        const descricao = descricaoInput.value.trim();
        const tipo = getSelectedManutencaoType();

        // Validação simples
        if (!data || !descricao || !tipo) {
            alert('Por favor, preencha a Data, o Tipo e a Descrição da manutenção.');
            return;
        }

        addHistoryRow(data, descricao, tipo);
    });

    // 3. Inicialização: Adiciona o listener de remoção às linhas existentes
    historyTableBody.querySelectorAll('tr').forEach(addRemoveListener);
});