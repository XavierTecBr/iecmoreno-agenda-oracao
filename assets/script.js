document.addEventListener('DOMContentLoaded', () => {
    const calendario = document.getElementById('calendario');
    const dataSelecionada = document.getElementById('dataSelecionada');

    // Função para obter a data atual considerando o fuso horário de São Paulo (GMT-3)
    function obterDataNoFusoHorario() {
        const agora = new Date();
        const offsetHoras = -3;
        const dataAjustada = new Date(agora.getTime() + (offsetHoras - agora.getTimezoneOffset() / 60) * 60 * 60 * 1000);
        return dataAjustada;
    }

    // Função para formatar a data para o formato YYYY-MM-DD
    function formatarData(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    function atualizarCalendario(dia) {
        fetch('assets/membros.json')
            .then(response => response.json())
            .then(membros => {
                const hoje = obterDataNoFusoHorario();
                const ano = hoje.getFullYear();
                const mes = hoje.getMonth();
                const diasNoMes = new Date(ano, mes + 1, 0).getDate();

                // Garante que o dia esteja dentro do intervalo válido do mês
                const diaValido = Math.min(Math.max(dia, 1), diasNoMes);

                // Distribui os membros igualmente pelos dias do mês
                const totalMembros = membros.length;
                const membrosPorDia = Math.floor(totalMembros / diasNoMes);
                const membrosExtras = totalMembros % diasNoMes;

                // Verifica se o dia recebe um membro extra
                const membrosParaEsteDia = membrosPorDia + (diaValido <= membrosExtras ? 1 : 0);

                // Calcula o índice de início para o dia específico
                let membroIndex = (diaValido - 1) * membrosPorDia + Math.min(diaValido - 1, membrosExtras);

                // Seleciona os membros do dia específico
                const diaMembros = membros.slice(membroIndex, membroIndex + membrosParaEsteDia);

                // Gera os cards para os membros do dia específico
                let html = '';
                diaMembros.forEach(membro => {
                    html += `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${membro.nome}</h5>
                            </div>
                        </div>
                    </div>
                    `;
                });

                calendario.innerHTML = html;
            });
    }

    // Função para definir a data do campo de data como hoje e atualizar o calendário
    function inicializarCalendario() {
        const hoje = obterDataNoFusoHorario();
        const diaHoje = hoje.getDate();
        const dataFormatada = formatarData(hoje);
        dataSelecionada.value = dataFormatada;
        atualizarCalendario(diaHoje);
    }

    // Atualiza o calendário com a data selecionada pelo usuário
    dataSelecionada.addEventListener('change', (event) => {
        const dataSelecionada = new Date(event.target.value);
        const dataAjustada = new Date(dataSelecionada.getTime() + (-3 - dataSelecionada.getTimezoneOffset() / 60) * 60 * 60 * 1000);
        const dia = dataAjustada.getDate();
        atualizarCalendario(dia);
    });

    // Inicializa o calendário com a data de hoje
    inicializarCalendario();
});
