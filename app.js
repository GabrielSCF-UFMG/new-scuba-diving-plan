let estado = {
    primeiro: null,
    segundo: null
};

const CONFIG_VALIDACAO_MERGULHO = {
    velocidadeSubidaNormal: 9,
    velocidadeSubidaEmergencia: 18,
    usarParadaSeguranca: true,
    profundidadeMinimaParadaSeguranca: 18,
    profundidadeParadaSeguranca: 5,
    tempoParadaSeguranca: 3
};

function el(id) {
    return document.getElementById(id);
}

function valorNumero(idOuIds) {
    const ids = Array.isArray(idOuIds) ? idOuIds : [idOuIds];

    for (const id of ids) {
        const elemento = el(id);

        if (elemento) {
            const texto = String(elemento.value || "").replace(",", ".");
            const valor = Number(texto);

            return Number.isFinite(valor) ? valor : 0;
        }
    }

    return 0;
}

function valorTexto(idOuIds) {
    const ids = Array.isArray(idOuIds) ? idOuIds : [idOuIds];

    for (const id of ids) {
        const elemento = el(id);

        if (elemento) {
            return String(elemento.value || "").trim();
        }
    }

    return "";
}

function formatarNumero(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === "" ||
        Number.isNaN(Number(valor))
    ) {
        return "";
    }

    return Number(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    });
}

function minTexto(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    return `${valor} min`;
}

function metroTexto(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    return `${formatarNumero(valor)} m`;
}

function velocidadeTexto(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    return `${formatarNumero(valor)} m/min`;
}


function usaCorrecaoPorAltitude(altitude) {
    return Number(altitude) > 0;
}

function metroTextoAnexoB(altitude, valor) {
    if (!usaCorrecaoPorAltitude(altitude)) {
        return "-";
    }

    return metroTexto(valor);
}

function profundidadeCorrigidaTexto(dados) {
    if (!dados) {
        return "";
    }

    if (!usaCorrecaoPorAltitude(dados.altitude)) {
        return "-";
    }

    return metroTexto(dados.profundidadeCorrigida);
}

function profundidadeRealTabelaAnexoBTexto(dados) {
    if (!dados) {
        return "";
    }

    if (!usaCorrecaoPorAltitude(dados.altitude)) {
        return "-";
    }

    return metroTexto(dados.profundidadeRealTabela);
}


function statusParada(resultado) {
    if (!resultado) {
        return "";
    }

    if (resultado.descompressiva) {
        return `<span class="aviso">Parada descompressiva: ${resultado.parada6m1} min a 6,1 m</span>`;
    }

    return `<span class="ok">Sem parada descompressiva pela célula consultada</span>`;
}

function tabelaResultado(linhas) {
    return `
    <table>
      <tbody>
        ${linhas
            .map(
                linha => `
              <tr>
                <th>${linha[0]}</th>
                <td>${linha[1]}</td>
              </tr>
            `
            )
            .join("")}
      </tbody>
    </table>
  `;
}

function mostrarErro(id, mensagem) {
    const destino = el(id);

    if (destino) {
        destino.innerHTML = `
            <div class="erro">
                <strong>Ocorreu um erro no cálculo</strong>
                <p>${mensagem}</p>
            </div>`;
    } else {
        alert(mensagem);
    }
}

function verificarDependencias() {
    const faltando = [];

    if (typeof obterProfundidadeCorrigidaPorAltitude !== "function") {
        faltando.push("obterProfundidadeCorrigidaPorAltitude");
    }

    if (typeof obterGrupoPorTempoFundo !== "function") {
        faltando.push("obterGrupoPorTempoFundo");
    }

    if (typeof obterGrupoAposIntervaloSuperficie !== "function") {
        faltando.push("obterGrupoAposIntervaloSuperficie");
    }

    if (typeof obterTNRPorGrupoEProfundidade !== "function") {
        faltando.push("obterTNRPorGrupoEProfundidade");
    }

    if (faltando.length > 0) {
        return {
            erro: true,
            mensagem: `O arquivo anexos-a-b.js não foi carregado corretamente. Funções ausentes: ${faltando.join(
                ", "
            )}. Verifique se o arquivo anexos-a-b.js está na mesma pasta do index.html.`
        };
    }

    return {
        erro: false
    };
}

function horaParaMinutos(hora) {
    if (!hora) {
        return null;
    }

    const texto = String(hora).trim();

    if (!/^\d{1,2}:\d{2}$/.test(texto)) {
        return null;
    }

    const [h, m] = textToMin = texto.split(":").map(Number);

    if (!Number.isFinite(h) || !Number.isFinite(m)) {
        return null;
    }

    if (h < 0 || h > 23 || m < 0 || m > 59) {
        return null;
    }

    return h * 60 + m;
}


function diferencaMinutos(horaInicial, horaFinal) {
    const inicio = horaParaMinutos(horaInicial);
    const fim = horaParaMinutos(horaFinal);

    if (inicio === null || fim === null) {
        return null;
    }

    let diferenca = fim - inicio;

    if (diferenca < 0) {
        diferenca += 24 * 60;
    }

    return diferenca;
}

function diferencaMinutosMesmoDia(horaInicial, horaFinal) {
    const inicio = horaParaMinutos(horaInicial);
    const fim = horaParaMinutos(horaFinal);

    if (inicio === null || fim === null) {
        return null;
    }

    return fim - inicio;
}



function obterParadasDescompressivas(resultadoTabela) {
    const paradas = [];

    if (!resultadoTabela) {
        return paradas;
    }

    if (resultadoTabela.descompressiva && Number(resultadoTabela.parada6m1) > 0) {
        paradas.push({
            tipo: "descompressiva",
            tempo: Number(resultadoTabela.parada6m1),
            profundidade: 6.1,
            descricao: `Parada descompressiva de ${resultadoTabela.parada6m1} min a 6,1 m`
        });
    }

    return paradas;
}

function obterParadaSeguranca(profundidadeMetros) {
    if (!CONFIG_VALIDACAO_MERGULHO.usarParadaSeguranca) return null;

    const profundidade = Number(profundidadeMetros);

    if (!Number.isFinite(profundidade)) return null;

    // Apenas mergulhos superiores a 18 metros
    if (profundidade <= CONFIG_VALIDACAO_MERGULHO.profundidadeMinimaParadaSeguranca) {
        return null;
    }

    return {
        tipo: "seguranca",
        tempo: CONFIG_VALIDACAO_MERGULHO.tempoParadaSeguranca,
        profundidade: CONFIG_VALIDACAO_MERGULHO.profundidadeParadaSeguranca,
        descricao: `Parada de segurança de ${CONFIG_VALIDACAO_MERGULHO.tempoParadaSeguranca} min a ${formatarNumero(CONFIG_VALIDACAO_MERGULHO.profundidadeParadaSeguranca)} m`
    };
}


function htmlValidacao(validacao) {
    let html = "";

    if (validacao.erros.length > 0) {
        html += `
            <div class="erro">
                <strong>Verifique as inconsistências no perfil de mergulho:</strong>
                <ul>
                    ${validacao.erros.map(erro => `<li>${erro}</li>`).join("")}
                </ul>
            </div>
        `;
    }

    if (validacao.avisos.length > 0) {
        html += `
            <div style="background-color: var(--warning-bg); border-left: 4px solid var(--warning); padding: 16px; border-radius: var(--radius-md); margin-top: 14px; margin-bottom: 14px; color: #92400e; font-size: 14px;">
                <strong>Avisos operacionais:</strong>
                <ul style="padding-left: 20px; margin-top: 6px;">
                    ${validacao.avisos.map(aviso => `<li>${aviso}</li>`).join("")}
                </ul>
            </div>
        `;
    }

    if (validacao.detalhes.length > 0) {
        html += tabelaResultado([
            ["Status da validação", validacao.erros.length > 0 ? `<span class="aviso">Perfil Inconsistente</span>` : `<span class="ok">Validado Sem Pendências</span>`],
            ...validacao.detalhes.map(item => [item.campo, item.valor])
        ]);
    }

    return html;
}

function validarPlanejamentoMergulho({
    numero,
    profundidadeMetros,
    tempoFundoInformado,
    ds,
    cf,
    df,
    cs,
    tipoSubida,
    resultadoTabela
}) {
    const erros = [];
    const avisos = [];
    const detalhes = [];

    const profundidade = Number(profundidadeMetros);
    const tempoFundo = Number(tempoFundoInformado);
    const subida = tipoSubida === "emergencia" ? "emergencia" : "normal";

    if (!Number.isFinite(profundidade) || profundidade <= 0) {
        erros.push(`Informe uma profundidade válida para o ${numero}º mergulho.`);
    }

    if (!Number.isFinite(tempoFundo) || tempoFundo <= 0) {
        erros.push(`Informe um tempo de fundo válido para o ${numero}º mergulho.`);
    }

    if (!ds || !cf || !df || !cs) {
        erros.push(`Informe todos os horários DS, CF, DF e CS do ${numero}º mergulho.`);
    }

    if (erros.length > 0) {
        return {
            valido: false,
            erros,
            avisos,
            detalhes
        };
    }

    const tempoDSCF = diferencaMinutosMesmoDia(ds, cf);
    const tempoDSDF = diferencaMinutosMesmoDia(ds, df);
    const tempoDSCS = diferencaMinutosMesmoDia(ds, cs);
    const tempoDFCS = diferencaMinutosMesmoDia(df, cs);

    if (
        tempoDSCF === null ||
        tempoDSDF === null ||
        tempoDSCS === null ||
        tempoDFCS === null
    ) {
        erros.push(`Há horários inválidos no ${numero}º mergulho.`);
    }

    if (tempoDSCF !== null && tempoDSDF !== null && tempoDSCF > tempoDSDF) {
        erros.push(`No ${numero}º mergulho, o horário CF não pode ser depois do horário DF.`);
    }

    if (tempoDSDF !== null && tempoDSCS !== null && tempoDSDF > tempoDSCS) {
        erros.push(`No ${numero}º mergulho, o horário DF não pode ser depois do horário CS.`);
    }

    if (tempoDSDF !== null && tempoDSDF !== tempoFundo) {
        erros.push(
            `Tempo de fundo inconsistente no ${numero}º mergulho. ` +
            `Foi informado ${tempoFundo} min, mas DF - DS resulta em ${tempoDSDF} min.`
        );
    }

    if (tempoDFCS !== null && tempoDFCS <= 0) {
        erros.push(`No ${numero}º mergulho, CS deve ocorrer depois de DF para existir tempo de subida.`);
    }



    const velocidadeMaxima =
        subida === "emergencia"
            ? CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaEmergencia
            : CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaNormal;

    const tempoMinimoDeslocamento = profundidade / velocidadeMaxima;
    const tempoMinimoSubidaNormal = profundidade / CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaNormal;
    const tempoMinimoSubidaEmergencia = profundidade / CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaEmergencia;

    const paradasDescompressivas = obterParadasDescompressivas(resultadoTabela);
    const paradaSeguranca = obterParadaSeguranca(profundidade);

    const tempoParadasDescompressivas = paradasDescompressivas.reduce(
        (total, parada) => total + parada.tempo,
        0
    );

    const tempoParadaSeguranca = paradaSeguranca ? paradaSeguranca.tempo : 0;

    const tempoMinimoTotal =
        tempoMinimoDeslocamento +
        tempoParadasDescompressivas +
        tempoParadaSeguranca;


    const velocidadeMediaSubida =
        tempoDFCS > 0 ? profundidade / tempoDFCS : null;

    detalhes.push({
        campo: "Tipo de subida informado",
        valor: subida === "emergencia" ? "Emergência - até 18 m/min" : "Normal - até 9 m/min"
    });

    detalhes.push({
        campo: "Tempo de fundo calculado por DF - DS",
        valor: minTexto(tempoDSDF)
    });

    detalhes.push({
        campo: "Tempo disponível para subida por CS - DF",
        valor: minTexto(tempoDFCS)
    });

    detalhes.push({
        campo: "Velocidade média aproximada de subida",
        valor: velocidadeMediaSubida === null
            ? "Não calculável"
            : `${formatarNumero(velocidadeMediaSubida)} m/min`
    });


    detalhes.push({
        campo: "Tempo mínimo de subida normal (deslocamento)",
        valor: `${formatarNumero(tempoMinimoSubidaNormal)} min`
    });

    detalhes.push({
        campo: "Tempo mínimo de subida de emergência (deslocamento)",
        valor: `${formatarNumero(tempoMinimoSubidaEmergencia)} min`
    });

    if (paradaSeguranca) {
        detalhes.push({
            campo: "Parada de segurança recomendada",
            valor: paradaSeguranca.descricao
        });
    } else {
        detalhes.push({
            campo: "Parada de segurança",
            valor: "Isento (abaixo de 18 m)"
        });
    }


    if (paradasDescompressivas.length > 0) {
        paradasDescompressivas.forEach(parada => {
            detalhes.push({
                campo: "Parada descompressiva obrigatória",
                valor: parada.descricao
            });
        });
    } else {
        detalhes.push({
            campo: "Parada descompressiva",
            valor: "Isento pela tabela de mergulho"
        });
    }

    detalhes.push({
        campo: "Tempo mínimo total de subida (DF até CS)",
        valor: `${formatarNumero(tempoMinimoTotal)} min`
    });

    if (
        velocidadeMediaSubida !== null &&
        subida === "normal" &&
        velocidadeMediaSubida > CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaNormal
    ) {

        erros.push(
            `A velocidade de subida do ${numero}º mergulho excede a normal permitida de ` +
            `${CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaNormal} m/min. ` +
            `Registrado: ${formatarNumero(velocidadeMediaSubida)} m/min.`
        );
    }

    if (
        velocidadeMediaSubida !== null &&
        subida === "emergencia" &&
        velocidadeMediaSubida > CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaEmergencia
    ) {

        erros.push(
            `A velocidade de emergência do ${numero}º mergulho excede o limite absoluto de ` +
            `${CONFIG_VALIDACAO_MERGULHO.velocidadeSubidaEmergencia} m/min. ` +
            `Registrado: ${formatarNumero(velocidadeMediaSubida)} m/min.`
        );
    }

    if (subida === "emergencia") {
        avisos.push(
            `Mergulho ${numero} marcado como subida de emergência. ` +
            `O cálculo considera tempos de deslocamento acelerados.`
        );
    }

    if (tempoDFCS !== null && tempoDFCS < tempoMinimoTotal) {
        erros.push(
            `Inconsistência cronológica: intervalo DF a CS insuficiente no ${numero}º mergulho. ` +
            `Disponibilizado: ${tempoDFCS} min. ` +
            `Mínimo obrigatório (subida + paradas): ` +
            `${formatarNumero(tempoMinimoTotal)} min.`
        );
    }



    return {
        valido: erros.length === 0,
        erros,
        avisos,
        detalhes,
        tempoDSCF,
        tempoDSDF,
        tempoDSCS,
        tempoDFCS,
        velocidadeMediaSubida,
        tempoMinimoTotal,
        paradasDescompressivas,
        paradaSeguranca
    };

}

function validarIntervaloSegundoMergulho({
    intervaloSuperficie,
    horaInicioIntervalo,
    horaFinalIntervalo,
    horaCSPrimeiro,
    horaInicioSegundo
}) {
    const erros = [];
    const avisos = [];
    const detalhes = [];

    const intervalo = Number(intervaloSuperficie);

    if (!Number.isFinite(intervalo) || intervalo < 0) {
        erros.push("Informe um intervalo de superfície válido.");
    }

    if (horaInicioIntervalo && horaFinalIntervalo) {
        const calculado = diferencaMinutos(horaInicioIntervalo, horaFinalIntervalo);

        detalhes.push({
            campo: "Intervalo calculado (Hora final - Hora inicial)",
            valor: minTexto(calculado)
        });

        if (calculado !== null && calculado !== intervalo) {
            erros.push(
                `Intervalo de superfície inconsistente. ` +
                `Foi digitado ${intervalo} min, mas a diferença dos horários indica ${calculado} min.`
            );
        }
    }

    if (horaCSPrimeiro && horaInicioSegundo) {
        const calculadoEntreMergulhos = diferencaMinutos(horaCSPrimeiro, horaInicioSegundo);

        detalhes.push({
            campo: "Intervalo operacional (DS do 2º mergulho - CS do 1º mergulho)",
            valor: minTexto(calculadoEntreMergulhos)
        });

        if (calculadoEntreMergulhos !== null && calculadoEntreMergulhos !== intervalo) {
            erros.push(
                `Intervalo entre os mergulhos incompatível. ` +
                `Foi digitado ${intervalo} min, mas o espaço cronológico entre o CS do 1º e DS do 2º indica ` +
                `${calculadoEntreMergulhos} min.`
            );
        }
    }

    if (horaInicioIntervalo && horaCSPrimeiro && horaInicioIntervalo !== horaCSPrimeiro) {
        avisos.push(
            `A hora inicial do intervalo de superfície diverge da hora de término (CS) do primeiro mergulho.`
        );
    }

    if (horaFinalIntervalo && horaInicioSegundo && horaFinalIntervalo !== horaInicioSegundo) {
        avisos.push(
            `A hora de encerramento do intervalo de superfície diverge do início (DS) do segundo mergulho.`
        );
    }

    return {
        valido: erros.length === 0,
        erros,
        avisos,
        detalhes
    };
}

function calcularPrimeiroMergulho() {
    const dep = verificarDependencias();

    if (dep.erro) {
        estado.primeiro = null;
        estado.segundo = null;
        mostrarErro("resultado1", dep.mensagem);
        return;
    }

    const altitude = valorNumero("altitude");
    const profundidadeReal = valorNumero(["profundidade1", "profundidadeReal1"]);
    const tempoFundo = valorNumero(["tempo1", "tempoFundo1"]);
    const tipoSubida = valorTexto("tipoSubida1") || "normal";

    if (profundidadeReal <= 0) {
        estado.primeiro = null;
        estado.segundo = null;
        mostrarErro("resultado1", "Informe uma profundidade válida para o 1º mergulho.");
        return;
    }

    if (tempoFundo <= 0) {
        estado.primeiro = null;
        estado.segundo = null;
        mostrarErro("resultado1", "Informe um tempo de fundo válido para o 1º mergulho.");
        return;
    }

    const ajuste = obterProfundidadeCorrigidaPorAltitude(profundidadeReal, altitude);

    if (ajuste.erro) {
        estado.primeiro = null;
        estado.segundo = null;
        mostrarErro("resultado1", ajuste.mensagem);
        return;
    }

    const grupo = obterGrupoPorTempoFundo(
        ajuste.profundidadeCorrigida,
        tempoFundo
    );

    if (grupo.erro) {
        estado.primeiro = null;
        estado.segundo = null;
        mostrarErro("resultado1", grupo.mensagem);
        return;
    }

    const horaInicio = valorTexto("horaInicio1");
    const horaCF = valorTexto("horaCF1");
    const horaDF = valorTexto("horaDF1");
    const horaCS = valorTexto(["horaCS1", "horaFinal1"]);

    const validacao = validarPlanejamentoMergulho({
        numero: 1,
        profundidadeMetros: profundidadeReal,
        tempoFundoInformado: tempoFundo,
        ds: horaInicio,
        cf: horaCF,
        df: horaDF,
        cs: horaCS,
        tipoSubida,
        resultadoTabela: grupo
    });

    if (!validacao.valido) {
        estado.primeiro = null;
        estado.segundo = null;
        el("resultado1").innerHTML = htmlValidacao(validacao);
        return;
    }

    estado.primeiro = {
        altitude,
        usaCorrecaoAltitude: usaCorrecaoPorAltitude(altitude),
        profundidadeReal,
        profundidadeRealTabela: ajuste.profundidadeRealTabela,
        profundidadeCorrigida: ajuste.profundidadeCorrigida,
        altitudeTabela: ajuste.altitudeTabela,
        tempoFundo,

        tipoSubida,
        tempoSubida: validacao.tempoDFCS,
        velocidadeMediaSubida: validacao.velocidadeMediaSubida,
        tempoMinimoSubidaTotal: validacao.tempoMinimoTotal,
        paradaSeguranca: validacao.paradaSeguranca,
        paradasDescompressivas: validacao.paradasDescompressivas,

        horaInicio,
        horaCF,
        horaDF,
        horaCS,

        horaFinal: horaCS,

        grupo: grupo.grupo,
        limiteSemDescompressao: grupo.limiteSemDescompressao,
        descompressiva: groupDescomp = grupo.descompressiva,
        parada6m1: grupo.parada6m1,
        profundidadeTabelaAnexoA: grupo.profundidadeTabela,
        profundidadePes: grupo.profundidadePes,
        tempoFundoTabela: grupo.tempoFundoTabela

    };

    el("resultado1").innerHTML =
        htmlValidacao(validacao) +
        tabelaResultado([
            ["Status do mergulho", `<span class="ok">Sucesso (Perfil Consistente)</span>`],
            ["Altitude real local", metroTexto(altitude)],
            ["Altitude correspondente Anexo B", metroTexto(ajuste.altitudeTabela)],
            ["Profundidade real do mergulhador", metroTexto(profundidadeReal)],
            ["Profundidade correspondente Anexo B", metroTextoAnexoB(altitude, ajuste.profundidadeRealTabela)],
            ["Profundidade corrigida equivalente", metroTextoAnexoB(altitude, ajuste.profundidadeCorrigida)],
            [
                "Profundidade para busca no Anexo A",
                `${metroTexto(grupo.profundidadeTabela)} (${grupo.profundidadePes} pés)`
            ],

            ["Tempo de fundo inserido", minTexto(tempoFundo)],
            ["Limite da tabela correspondente", minTexto(grupo.tempoFundoTabela)],
            ["Classificação de subida", tipoSubida === "emergencia" ? "Emergência — até 18 m/min" : "Normal — até 9 m/min"],
            ["Tempo de subida calculado", minTexto(validacao.tempoDFCS)],
            ["Velocidade média calculada", velocidadeTexto(validacao.velocidadeMediaSubida)],
            ["Horários informados (DS / CF / DF / CS)", `${horaInicio || "-"} / ${horaCF || "-"} / ${horaDF || "-"} / ${horaCS || "-"}`],
            ["Grupo de repetição final", `<strong style="font-size: 16px; color: var(--secondary);">${grupo.grupo}</strong>`],
            ["Tempo limite sem descompressão (TLSD)", minTexto(grupo.limiteSemDescompressao)],
            ["Exigência de paradas", statusParada(grupo)]
        ]);
}

function calcularSegundoMergulho() {
    const dep = verificarDependencias();

    if (dep.erro) {
        estado.segundo = null;
        mostrarErro("resultado2", dep.mensagem);
        return;
    }

    if (!estado.primeiro) {
        alert("Antes de calcular o 2º mergulho, calcule o 1º mergulho com sucesso.");
        return;
    }

    const altitude = valorNumero("altitude");
    const intervaloSuperficie = valorNumero("intervaloSuperficie");
    const intervaloTexto = valorTexto("intervaloSuperficie");
    const profundidadeReal = valorNumero(["profundidade2", "profundidadeReal2"]);
    const tempoFundo = valorNumero(["tempo2", "tempoFundo2"]);
    const tipoSubida = valorTexto("tipoSubida2") || "normal";

    if (intervaloTexto === "") {
        estado.segundo = null;
        mostrarErro("resultado2", "Informe o intervalo de superfície para calcular o 2º mergulho.");
        return;
    }

    if (profundidadeReal <= 0) {
        estado.segundo = null;
        mostrarErro("resultado2", "Informe uma profundidade válida para o 2º mergulho.");
        return;
    }

    if (tempoFundo <= 0) {
        estado.segundo = null;
        mostrarErro("resultado2", "Informe um tempo de fundo válido para o 2º mergulho.");
        return;
    }

    const horaInicio = valorTexto("horaInicio2");
    const horaCF = valorTexto("horaCF2");
    const horaDF = valorTexto("horaDF2");
    const horaCS = valorTexto(["horaCS2", "horaFinal2"]);

    const validacaoIntervalo = validarIntervaloSegundoMergulho({
        intervaloSuperficie,
        horaInicioIntervalo: valorTexto("horaInicioIntervalo"),
        horaFinalIntervalo: valorTexto("horaFinalIntervalo"),
        horaCSPrimeiro: estado.primeiro.horaCS,
        horaInicioSegundo: horaInicio
    });

    if (!validacaoIntervalo.valido) {
        estado.segundo = null;
        el("resultado2").innerHTML = htmlValidacao(validacaoIntervalo);
        return;
    }

    const grupoAposIS = obterGrupoAposIntervaloSuperficie(
        estado.primeiro.grupo,
        intervaloSuperficie
    );

    if (grupoAposIS.erro) {
        estado.segundo = null;
        mostrarErro("resultado2", grupoAposIS.mensagem);
        return;
    }

    const ajuste = obterProfundidadeCorrigidaPorAltitude(profundidadeReal, altitude);

    if (ajuste.erro) {
        estado.segundo = null;
        mostrarErro("resultado2", ajuste.mensagem);
        return;
    }

    const tnr = obterTNRPorGrupoEProfundidade(
        grupoAposIS.grupoAposIS,
        ajuste.profundidadeCorrigida
    );

    if (tnr.erro) {
        estado.segundo = null;
        mostrarErro("resultado2", tnr.mensagem);
        return;
    }

    const tempoTotalNitrogenio = tempoFundo + tnr.tnr;

    const grupoFinal = obterGrupoPorTempoFundo(
        ajuste.profundidadeCorrigida,
        tempoTotalNitrogenio
    );

    if (grupoFinal.erro) {
        estado.segundo = null;
        mostrarErro("resultado2", grupoFinal.mensagem);
        return;
    }

    const validacaoMergulho = validarPlanejamentoMergulho({
        numero: 2,
        profundidadeMetros: profundidadeReal,
        tempoFundoInformado: tempoFundo,
        ds: horaInicio,
        cf: horaCF,
        df: horaDF,
        cs: horaCS,
        tipoSubida,
        resultadoTabela: grupoFinal
    });

    if (!validacaoMergulho.valido) {
        estado.segundo = null;
        el("resultado2").innerHTML =
            htmlValidacao(validacaoIntervalo) +
            htmlValidacao(validacaoMergulho);
        return;
    }

    estado.segundo = {
        altitude,
        usaCorrecaoAltitude: usaCorrecaoPorAltitude(altitude),
        intervaloSuperficie,
        grupoInicial: estado.primeiro.grupo,
        grupoAposIS: grupoAposIS.grupoAposIS,
        tipoIS: grupoAposIS.tipo,
        profundidadeReal,
        profundidadeRealTabela: ajuste.profundidadeRealTabela,
        profundidadeCorrigida: ajuste.profundidadeCorrigida,
        profundidadeTabelaAnexoA: grupoFinal.profundidadeTabela,
        profundidadePes: grupoFinal.profundidadePes,
        tempoFundo,

        tipoSubida,
        tempoSubida: validacaoMergulho.tempoDFCS,
        velocidadeMediaSubida: validacaoMergulho.velocidadeMediaSubida,
        tempoMinimoSubidaTotal: validacaoMergulho.tempoMinimoTotal,
        paradaSeguranca: validacaoMergulho.paradaSeguranca,
        paradasDescompressivas: validacaoMergulho.paradasDescompressivas,


        horaInicio,
        horaCF,
        horaDF,
        horaCS,

        horaFinal: horaCS,

        tnr: tnr.tnr,
        ptf: tnr.ptf,
        tempoTotalNitrogenio,
        grupoFinal: grupoFinal.grupo,
        limiteSemDescompressao: grupoFinal.limiteSemDescompressao,
        descompressiva: grupoFinal.descompressiva,
        parada6m1: grupoFinal.parada6m1,
        tempoFundoTabela: grupoFinal.tempoFundoTabela
    };

    el("resultado2").innerHTML =
        htmlValidacao(validacaoIntervalo) +
        htmlValidacao(validacaoMergulho) +
        tabelaResultado([
            ["Status do mergulho", `<span class="ok">Sucesso (Perfil Consistente)</span>`],
            ["Grupo de repetição inicial", estado.primeiro.grupo],
            ["Intervalo em superfície", minTexto(intervaloSuperficie)],
            ["Grupo após o intervalo", grupoAposIS.grupoAposIS || "Isento de nitrogênio residual"],
            ["Profundidade real do mergulhador", metroTexto(profundidadeReal)],
            ["Profundidade correspondente Anexo B", metroTextoAnexoB(altitude, ajuste.profundidadeRealTabela)],
            ["Profundidade corrigida equivalente", metroTextoAnexoB(altitude, ajuste.profundidadeCorrigida)],
            [
                "Profundidade para busca no Anexo A",
                `${metroTexto(grupoFinal.profundidadeTabela)} (${grupoFinal.profundidadePes} pés)`
            ],
            ["Tempo de Nitrogênio Residual (TNR)", minTexto(tnr.tnr)],
            ["Penalidade de tempo calculada (PTF)", tnr.ptf === null ? "-" : minTexto(tnr.ptf)],
            ["Tempo de fundo real executado", minTexto(tempoFundo)],
            ["Tempo total de nitrogênio residual (TFE)", minTexto(tempoTotalNitrogenio)],
            ["Classificação de subida", tipoSubida === "emergencia" ? "Emergência — até 18 m/min" : "Normal — até 9 m/min"],
            ["Tempo de subida calculado", minTexto(validacaoMergulho.tempoDFCS)],
            ["Velocidade média calculada", velocidadeTexto(validacaoMergulho.velocidadeMediaSubida)],
            ["Horários informados (DS / CF / DF / CS)", `${horaInicio || "-"} / ${horaCF || "-"} / ${horaDF || "-"} / ${horaCS || "-"}`],
            ["Grupo de repetição final", `<strong style="font-size: 16px; color: var(--secondary);">${grupoFinal.grupo}</strong>`],
            ["Tempo limite sem descompressão (TLSD)", minTexto(grupoFinal.limiteSemDescompressao)],
            ["Exigência de paradas", statusParada(grupoFinal)]
        ]);
}

function dataBR(dataISO) {
    if (!dataISO) {
        return "";
    }

    const [ano, mes, dia] = dataISO.split("-");

    if (!ano || !mes || !dia) {
        return dataISO;
    }

    return `${dia}/${mes}/${ano}`;
}

function paradaTexto(obj) {
    if (!obj) {
        return "";
    }

    const partes = [];

    if (obj.descompressiva) {
        partes.push(`${obj.parada6m1} min a 6,1 m`);
    } else {
        partes.push("Isento");
    }

    if (obj.paradaSeguranca) {
        partes.push(
            `Segurança: ${obj.paradaSeguranca.tempo} min a ${formatarNumero(obj.paradaSeguranca.profundidade)} m`
        );
    }

    return partes.join(" | ");
}


function montarDiagrama(dados, ttd) {
    const ds = dados?.horaInicio || "___";
    const cf = dados?.horaCF || "___";
    const df = dados?.horaDF || "___";
    const cs = dados?.horaCS || "___";
    const prof = dados?.profundidadeReal ? `${formatarNumero(dados.profundidadeReal)} m` : "___ m";
    const tf = dados?.tempoFundo ? `${dados.tempoFundo} min` : "___ min";

    // Custom modern SVG profile diagram with grid markers and round stroke joints
    return `
    <div class="apc-diagrama-wrapper">
      <div class="apc-diagrama">
        <svg viewBox="0 0 260 210" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.12"/>
            </filter>
          </defs>
          
          <!-- Water surface gradient area fill -->
          <path d="M 80,30 L 55,165 L 105,165 L 145,85 L 175,85 L 195,30 Z" fill="url(#grad)" />
          
          <!-- Horizontal depth grid markers -->
          <line x1="15" y1="30" x2="245" y2="30" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="15" y1="85" x2="245" y2="85" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="15" y1="165" x2="245" y2="165" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3" />
          
          <!-- Marine curve trajectory -->
          <path d="M 80,30 L 55,165 L 105,165 L 145,85 L 175,85 L 195,30" 
                stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#shadow)" />
          
          <!-- Key step circles -->
          <circle cx="80" cy="30" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="55" cy="165" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="105" cy="165" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="145" cy="85" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="175" cy="85" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="195" cy="30" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" />
        </svg>

        <div class="apc-label" style="left:78px; top:12px;">DS ${ds}</div>
        <div class="apc-label" style="left:2px; top:88px; color: #0284c7;">Prof. ${prof}</div>

        <div class="apc-label" style="left:12px; top:174px;">CF ${cf}</div>
        <div class="apc-label" style="left:60px; top:142px; color: var(--text-muted);">TF ${tf}</div>
        <div class="apc-label" style="left:110px; top:174px;">DF ${df}</div>

        <div class="apc-label" style="left:190px; top:12px;">CS ${cs}</div>
        <div class="apc-label" style="left:150px; top:102px; font-weight: 800; color: #1e293b;">TTD ${ttd || "___"}</div>
      </div>
    </div>
  `;
}

function obterDadosExportacao() {
    return {
        cabecalho: {
            ocorrencia: valorTexto("apcOcorrencia"),
            os: valorTexto("apcOS"),
            outros: valorTexto("apcOutros"),
            data: dataBR(valorTexto("apcData")),
            local: valorTexto("apcLocal"),
            cidade: valorTexto("apcCidade"),
            latitude: valorTexto("apcLatitude"),
            longitude: valorTexto("apcLongitude")
        },
        mergulhadores: {
            primeiro: valorTexto("apcMerg1"),
            roupa1: valorTexto("apcRoupa1"),
            lastro1: valorTexto("apcLastro1"),
            segundo: valorTexto("apcMerg2"),
            roupa2: valorTexto("apcRoupa2"),
            lastro2: valorTexto("apcLastro2")
        },
        complementares: {
            vol1: valorTexto("apcVol1"),
            pi1: valorTexto("apcPI1"),
            pf1: valorTexto("apcPF1"),
            consumo1: valorTexto("apcConsumo1"),
            vol2: valorTexto("apcVol2"),
            pi2: valorTexto("apcPI2"),
            pf2: valorTexto("apcPF2"),
            consumo2: valorTexto("apcConsumo2"),
            supervisor: valorTexto("apcSupervisor")
        }
    };
}

function montarApendiceC() {
    if (!estado.primeiro) {
        alert("Preencha e calcule pelo menos o 1º mergulho com sucesso antes de gerar.");
        return false;
    }

    const d = obterDadosExportacao();
    const m1 = estado.primeiro;
    const m2 = estado.segundo;

    const isTexto = m2 ? minTexto(m2.intervaloSuperficie) : "____";
    const grTexto = m1 ? m1.grupo || "____" : "____";
    const ngrTexto = m2 ? m2.grupoAposIS || "Isento" : "____";

    const html = `
    <div class="apc-doc">
      <div class="apc-titulo">APÊNDICE C - CADERNETA DE MERGULHO INDIVIDUAL</div>

      <table class="apc-tabela">
        <tr><th colspan="6">LIVRO DE CONTROLE DE MERGULHO</th></tr>
        <tr><th colspan="6">RELATÓRIO OPERACIONAL DE MERGULHO</th></tr>

        <tr>
          <td colspan="2"><strong>Ocorrência nº:</strong> ${d.cabecalho.ocorrencia || "________________"}</td>
          <td colspan="2"><strong>O.S.:</strong> ${d.cabecalho.os || "________________"}</td>
          <td colspan="2"><strong>Outros:</strong> ${d.cabecalho.outros || "________________"}</td>
        </tr>

        <tr>
          <td><strong>Data:</strong> ${d.cabecalho.data || "____/____/________"}</td>
          <td colspan="3"><strong>Local:</strong> ${d.cabecalho.local || "________________"}</td>
          <td colspan="2"><strong>Cidade / UF:</strong> ${d.cabecalho.cidade || "________________"}</td>
        </tr>

        <tr>
          <td colspan="3"><strong>Latitude GPS:</strong> ${d.cabecalho.latitude || "________________"}</td>
          <td colspan="3"><strong>Longitude GPS:</strong> ${d.cabecalho.longitude || "________________"}</td>
        </tr>

        <tr><th colspan="6">MERGULHADORES</th></tr>

        <tr>
          <td colspan="3"><strong>1º Mergulhador:</strong> ${d.mergulhadores.primeiro || "________________________________"}</td>
          <td><strong>Roupa:</strong> ${d.mergulhadores.roupa1 || "________"}</td>
          <td colspan="2"><strong>Lastro:</strong> ${d.mergulhadores.lastro1 || "________"}</td>
        </tr>

        <tr>
          <td colspan="3"><strong>2º Mergulhador:</strong> ${d.mergulhadores.segundo || "________________________________"}</td>
          <td><strong>Roupa:</strong> ${d.mergulhadores.roupa2 || "________"}</td>
          <td colspan="2"><strong>Lastro:</strong> ${d.mergulhadores.lastro2 || "________"}</td>
        </tr>

        <tr><th colspan="6">PLANO DE MERGULHO</th></tr>
      </table>

      <div class="apc-plano">
        <div class="apc-is">
          <div>INTERVALO DE SUPERFÍCIE (IS): ${isTexto}</div>
          <div class="apc-grupos">
            <span>GRUPO INICIAL (GR): ${grTexto}</span>
            <span>GRUPO APÓS IS (NGR): ${ngrTexto}</span>
          </div>
        </div>

        ${montarDiagrama(m1, minTexto(m1.tempoFundo))}
        ${montarDiagrama(m2, m2 ? minTexto(m2.tempoTotalNitrogenio) : "___")}
      </div>

      <table class="apc-tabela">
        <tr>
          <th colspan="3">1º Mergulho</th>
          <th colspan="3">2º Mergulho</th>
        </tr>

        <tr>
          <td><strong>Profundidade máxima:</strong></td><td colspan="2">${metroTexto(m1.profundidadeReal)}</td>
          <td><strong>Profundidade máxima:</strong></td><td colspan="2">${metroTexto(m2?.profundidadeReal)}</td>
        </tr>

        <tr>
          <td><strong>Profundidade corrigida:</strong></td><td colspan="2">${profundidadeCorrigidaTexto(m1)}</td>
          <td><strong>Profundidade corrigida:</strong></td><td colspan="2">${profundidadeCorrigidaTexto(m2)}</td>
        </tr>


        <tr>
          <td><strong>Tempo de fundo (TF):</strong></td><td colspan="2">${minTexto(m1.tempoFundo)}</td>
          <td><strong>Tempo de fundo (TF):</strong></td><td colspan="2">${minTexto(m2?.tempoFundo)}</td>
        </tr>

        <tr>
          <td><strong>Tipo de subida:</strong></td><td colspan="2">${m1.tipoSubida === "emergencia" ? "Emergência" : "Normal"}</td>
          <td><strong>Tipo de subida:</strong></td><td colspan="2">${m2 ? (m2.tipoSubida === "emergencia" ? "Emergência" : "Normal") : ""}</td>
        </tr>

        <tr>
          <td><strong>Velocidade de subida:</strong></td><td colspan="2">${velocidadeTexto(m1.velocidadeMediaSubida)}</td>
          <td><strong>Velocidade de subida:</strong></td><td colspan="2">${m2 ? velocidadeTexto(m2.velocidadeMediaSubida) : ""}</td>
        </tr>

        <tr>
          <td><strong>Grupo de Repetição (GR):</strong></td><td colspan="2">${m1.grupo}</td>
          <td><strong>Grupo após Intervalo:</strong></td><td colspan="2">${m2?.grupoAposIS || ""}</td>
        </tr>

        <tr>
          <td><strong>Nitrogênio Residual (TNR):</strong></td><td colspan="2">-</td>
          <td><strong>Nitrogênio Residual (TNR):</strong></td><td colspan="2">${minTexto(m2?.tnr)}</td>
        </tr>

        <tr>
          <td><strong>Tempo Fundo Equivalente:</strong></td><td colspan="2">${minTexto(m1.tempoFundo)}</td>
          <td><strong>Tempo Fundo Equivalente:</strong></td><td colspan="2">${minTexto(m2?.tempoTotalNitrogenio)}</td>
        </tr>

        <tr>
          <td><strong>Limite Sem Descompr. (TLSD):</strong></td><td colspan="2">${minTexto(m1.limiteSemDescompressao)}</td>
          <td><strong>Limite Sem Descompr. (TLSD):</strong></td><td colspan="2">${minTexto(m2?.limiteSemDescompressao)}</td>
        </tr>

        <tr>
          <td><strong>Paradas recomendadas:</strong></td><td colspan="2">${paradaTexto(m1)}</td>
          <td><strong>Paradas recomendadas:</strong></td><td colspan="2">${paradaTexto(m2)}</td>
        </tr>

        <tr>
          <td><strong>Hora de início (DS):</strong></td><td colspan="2">${m1.horaInicio || ""}</td>
          <td><strong>Hora de início (DS):</strong></td><td colspan="2">${m2?.horaInicio || ""}</td>
        </tr>

        <tr>
          <td><strong>Hora de término (CS):</strong></td><td colspan="2">${m1.horaCS || ""}</td>
          <td><strong>Hora de término (CS):</strong></td><td colspan="2">${m2?.horaCS || ""}</td>
        </tr>

        <tr>
          <td><strong>Volume do cilindro:</strong></td><td colspan="2">${d.complementares.vol1 || ""}</td>
          <td><strong>Volume do cilindro:</strong></td><td colspan="2">${d.complementares.vol2 || ""}</td>
        </tr>

        <tr>
          <td><strong>Pressão inicial:</strong></td><td colspan="2">${d.complementares.pi1 || ""}</td>
          <td><strong>Pressão inicial:</strong></td><td colspan="2">${d.complementares.pi2 || ""}</td>
        </tr>

        <tr>
          <td><strong>Pressão final:</strong></td><td colspan="2">${d.complementares.pf1 || ""}</td>
          <td><strong>Pressão final:</strong></td><td colspan="2">${d.complementares.pf2 || ""}</td>
        </tr>

        <tr>
          <td><strong>Consumo médio:</strong></td><td colspan="2">${d.complementares.consumo1 || ""}</td>
          <td><strong>Consumo médio:</strong></td><td colspan="2">${d.complementares.consumo2 || ""}</td>
        </tr>

        <tr>
          <td><strong>Altitude do local:</strong></td><td colspan="2">${metroTexto(m1.altitude)}</td>
          <td><strong>Altitude do local:</strong></td><td colspan="2">${metroTexto(m2?.altitude ?? m1.altitude)}</td>
        </tr>
      </table>

      <div class="apc-assinatura">
        <div class="apc-linha-ass"></div>
        <strong>SUPERVISOR OPERACIONAL RESPONSÁVEL</strong><br>
        <span>${d.complementares.supervisor || "____________________________________________"}</span>
      </div>

      <div class="apc-fonte">Fonte: Elaborado conforme especificações das Tabelas Oficiais de Mergulho da Marinha.</div>
    </div>
  `;

    const destino = el("apendiceCExport") || el("planoMergulho");

    if (destino) {
        destino.innerHTML = html;
    }

    return true;
}

async function exportarApendicePNG() {
    if (!montarApendiceC()) {
        return;
    }

    const elemento = el("apendiceCExport") || el("planoMergulho");

    if (!elemento) {
        alert("Área de exportação não encontrada no documento.");
        return;
    }

    const canvas = await html2canvas(elemento, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
    });

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "apendice-c-caderneta-mergulho.png";
        link.click();

        URL.revokeObjectURL(url);
    }, "image/png");
}

async function exportarApendicePDF() {
    if (!montarApendiceC()) {
        return;
    }

    const elemento =
        document.querySelector("#apendiceCExport .apc-doc") ||
        document.querySelector("#planoMergulho .apc-doc") ||
        el("apendiceCExport") ||
        el("planoMergulho");

    if (!elemento) {
        alert("Área de exportação não localizada no documento.");
        return;
    }


    const canvas = await html2canvas(elemento, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 6;

    let imgWidth = pageWidth - margin * 2;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight - margin * 2) {
        imgHeight = pageHeight - margin * 2;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = margin;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("apendice-c-caderneta-mergulho.pdf");
}

function csvEscape(valor) {
    const texto = valor === null || valor === undefined ? "" : String(valor);
    return `"${texto.replace(/"/g, '""')}"`;
}

function exportarApendiceCSV() {
    if (!estado.primeiro) {
        alert("Preencha os cálculos operacionais antes de exportar dados.");
        return;
    }

    const d = obterDadosExportacao();
    const m1 = estado.primeiro;
    const m2 = estado.segundo || {};

    const linhas = [
        ["Campo", "Valor"],
        ["Ocorrência nº", d.cabecalho.ocorrencia],
        ["O.S.", d.cabecalho.os],
        ["Outros", d.cabecalho.outros],
        ["Data", d.cabecalho.data],
        ["Local", d.cabecalho.local],
        ["Cidade", d.cabecalho.cidade],
        ["Latitude GPS", d.cabecalho.latitude],
        ["Longitude GPS", d.cabecalho.longitude],
        ["1º Mergulhador", d.mergulhadores.primeiro],
        ["2º Mergulhador", d.mergulhadores.segundo],

        ["1º - Profundidade real", metroTexto(m1.profundidadeReal)],
        ["1º - Profundidade corrigida", profundidadeCorrigidaTexto(m1)],
        ["1º - Tempo de fundo", minTexto(m1.tempoFundo)],
        ["1º - Tipo de subida", m1.tipoSubida === "emergencia" ? "Emergência" : "Normal"],
        ["1º - Velocidade subida", velocidadeTexto(m1.velocidadeMediaSubida)],
        ["1º - DS", m1.horaInicio],
        ["1º - CF", m1.horaCF],
        ["1º - DF", m1.horaDF],
        ["1º - CS", m1.horaCS],
        ["1º - Hora de início", m1.horaInicio],
        ["1º - Hora final", m1.horaCS],
        ["1º - Grupo", m1.grupo],
        ["1º - TLSD", minTexto(m1.limiteSemDescompressao)],
        ["1º - Parada", paradaTexto(m1)],

        ["2º - Intervalo superfície", minTexto(m2.intervaloSuperficie)],
        ["2º - Grupo após IS", m2.grupoAposIS || ""],
        ["2º - Profundidade real", metroTexto(m2.profundidadeReal)],
        ["2º - Profundidade corrigida", profundidadeCorrigidaTexto(m2)],
        ["2º - Tempo de fundo", minTexto(m2.tempoFundo)],
        ["2º - Tipo de subida", m2.tipoSubida ? (m2.tipoSubida === "emergencia" ? "Emergência" : "Normal") : ""],
        ["2º - Velocidade subida", velocidadeTexto(m2.velocidadeMediaSubida)],
        ["2º - DS", m2.horaInicio || ""],
        ["2º - CF", m2.horaCF || ""],
        ["2º - DF", m2.horaDF || ""],
        ["2º - CS", m2.horaCS || ""],
        ["2º - Hora de início", m2.horaInicio || ""],
        ["2º - Hora final", m2.horaCS || ""],
        ["2º - TNR", minTexto(m2.tnr)],
        ["2º - TFE/TTD", minTexto(m2.tempoTotalNitrogenio)],
        ["2º - Grupo final", m2.grupoFinal || ""],
        ["2º - TLSD", minTexto(m2.limiteSemDescompressao)],
        ["2º - Parada", paradaTexto(m2)],

        ["Supervisor", d.complementares.supervisor]
    ];

    const csv = "\uFEFF" + linhas.map(l => l.map(csvEscape).join(";")).join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "apendice-c-caderneta-mergulho.csv";
    link.click();

    URL.revokeObjectURL(url);
}

window.calcularPrimeiroMergulho = calcularPrimeiroMergulho;
window.calcularSegundoMergulho = calcularSegundoMergulho;
window.montarApendiceC = montarApendiceC;
window.exportarApendicePNG = exportarApendicePNG;
window.exportarApendicePDF = exportarApendicePDF;
window.exportarApendiceCSV = exportarApendiceCSV;

window.addEventListener("load", () => {
    const data = el("apcData");

    if (data && !data.value) {
        data.value = new Date().toISOString().slice(0, 10);
    }

    const btnCalcular1 = el("btnCalcular1");
    const btnCalcular2 = el("btnCalcular2");
    const btnGerarPlano = el("btnGerarPlano");
    const btnExportarPDF = el("btnExportarPDF");
    const btnImprimir = el("btnImprimir");

    if (btnCalcular1) {
        btnCalcular1.addEventListener("click", calcularPrimeiroMergulho);
    }

    if (btnCalcular2) {
        btnCalcular2.addEventListener("click", calcularSegundoMergulho);
    }

    if (btnGerarPlano) {
        btnGerarPlano.addEventListener("click", montarApendiceC);
    }

    if (btnExportarPDF) {
        btnExportarPDF.addEventListener("click", exportarApendicePDF);
    }

    if (btnImprimir) {
        btnImprimir.addEventListener("click", () => window.print());
    }

    console.log("app.js carregado.");
    console.log("Dependências:", verificarDependencias());
});