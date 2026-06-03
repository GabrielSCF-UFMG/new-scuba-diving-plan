const GRUPOS_REPETICAO = [
  "A", "B", "C", "D", "E", "F", "G", "H",
  "I", "J", "K", "L", "M", "N", "O", "Z"
];

function celula(tempoFundo, parada6m1 = 0) {
  return {
    tempoFundo,
    descompressiva: parada6m1 > 0,
    parada6m1
  };
}

function hmParaMinutos(texto) {
  const [h, m] = texto.split(":").map(Number);
  return h * 60 + m;
}

/*
  ==========================================================
  ANEXO A - TABELA 1
  TEMPO DE FUNDO COM GRUPO DE REPETIÇÃO
  ==========================================================
*/

const ANEXO_A_TABELA_1_TEMPO_FUNDO = [
  {
    profundidadeMetros: 12.2,
    profundidadePes: 40,
    limiteSemDescompressao: 163,
    valores: [
      celula(12), celula(20), celula(27), celula(36),
      celula(44), celula(53), celula(63), celula(73),
      celula(84), celula(95), celula(108), celula(121),
      celula(135), celula(151), celula(163), celula(180, 14)
    ]
  },
  {
    profundidadeMetros: 13.7,
    profundidadePes: 45,
    limiteSemDescompressao: 125,
    valores: [
      celula(11), celula(17), celula(24), celula(31),
      celula(39), celula(46), celula(55), celula(63),
      celula(72), celula(82), celula(92), celula(102),
      celula(114), celula(125), celula(130, 2), celula(150, 25)
    ]
  },
  {
    profundidadeMetros: 15.2,
    profundidadePes: 50,
    limiteSemDescompressao: 92,
    valores: [
      celula(9), celula(15), celula(21), celula(28),
      celula(34), celula(41), celula(48), celula(56),
      celula(63), celula(71), celula(80), celula(89),
      celula(92), celula(100, 4), celula(110, 8), celula(130, 34)
    ]
  },
  {
    profundidadeMetros: 16.8,
    profundidadePes: 55,
    limiteSemDescompressao: 74,
    valores: [
      celula(8), celula(14), celula(19), celula(25),
      celula(31), celula(37), celula(43), celula(50),
      celula(56), celula(63), celula(71), celula(74),
      celula(80, 4), celula(90, 10), celula(100, 17), null
    ]
  },
  {
    profundidadeMetros: 18.3,
    profundidadePes: 60,
    limiteSemDescompressao: 60,
    valores: [
      celula(7), celula(12), celula(17), celula(22),
      celula(28), celula(33), celula(39), celula(45),
      celula(51), celula(57), celula(60), celula(65, 2),
      null, celula(80, 14), celula(90, 23), null
    ]
  },
  {
    profundidadeMetros: 21.3,
    profundidadePes: 70,
    limiteSemDescompressao: 48,
    valores: [
      celula(6), celula(10), celula(14), celula(19),
      celula(23), celula(28), celula(32), celula(37),
      celula(42), celula(47), celula(48), celula(55, 9),
      celula(60, 14), celula(70, 24), null, null
    ]
  },
  {
    profundidadeMetros: 24.4,
    profundidadePes: 80,
    limiteSemDescompressao: 39,
    valores: [
      celula(5), celula(9), celula(12), celula(16),
      celula(20), celula(24), celula(28), celula(32),
      celula(36), celula(39), celula(45, 10), null,
      celula(50, 17), celula(60, 30), null, null
    ]
  },
  {
    profundidadeMetros: 27.4,
    profundidadePes: 90,
    limiteSemDescompressao: 30,
    valores: [
      celula(4), celula(7), celula(11), celula(14),
      celula(17), celula(21), celula(24), celula(28),
      celula(30), celula(35, 4), null, celula(40, 14),
      celula(45, 23), null, null, null
    ]
  },
  {
    profundidadeMetros: 30.5,
    profundidadePes: 100,
    limiteSemDescompressao: 25,
    valores: [
      celula(4), celula(6), celula(9), celula(12),
      celula(15), celula(18), celula(21), celula(25),
      celula(30, 3), null, celula(35, 15), celula(40, 26),
      null, null, null, null
    ]
  },
  {
    profundidadeMetros: 33.5,
    profundidadePes: 110,
    limiteSemDescompressao: 20,
    valores: [
      celula(3), celula(6), celula(8), celula(11),
      celula(14), celula(16), celula(19), celula(20),
      celula(25, 3), null, celula(30, 14), null,
      celula(35, 27), null, null, null
    ]
  },
  {
    profundidadeMetros: 36.6,
    profundidadePes: 120,
    limiteSemDescompressao: 15,
    valores: [
      celula(3), celula(5), celula(7), celula(10),
      celula(12), celula(15), null, celula(20, 2),
      null, celula(25, 8), null, celula(30, 24),
      null, null, null, null
    ]
  },
  {
    profundidadeMetros: 39.6,
    profundidadePes: 130,
    limiteSemDescompressao: 10,
    valores: [
      celula(2), celula(4), celula(6), celula(9),
      celula(10), null, celula(15, 1), null,
      celula(20, 4), null, celula(25, 17), null,
      null, null, null, null
    ]
  }
];

/*
  ==========================================================
  ANEXO A - TABELA 2
  INTERVALO DE SUPERFÍCIE
  ==========================================================
*/

const ANEXO_A_TABELA_2_INTERVALO_SUPERFICIE = (() => {
  const linhaA = {
    A: ["0:10", "2:20"], B: ["1:17", "3:36"], C: ["2:12", "4:31"],
    D: ["3:04", "5:23"], E: ["3:56", "6:15"], F: ["4:49", "7:08"],
    G: ["5:41", "8:00"], H: ["6:33", "8:52"], I: ["7:25", "9:44"],
    J: ["8:17", "10:36"], K: ["9:10", "11:29"], L: ["10:02", "12:21"],
    M: ["10:54", "13:13"], N: ["11:46", "14:05"], O: ["12:38", "14:58"],
    Z: ["13:31", "15:50"]
  };

  const linhaB = {
    B: ["0:10", "1:16"], C: ["0:56", "2:11"], D: ["1:48", "3:03"],
    E: ["2:40", "3:55"], F: ["3:32", "4:48"], G: ["4:24", "5:40"],
    H: ["5:17", "6:32"], I: ["6:09", "7:24"], J: ["7:01", "8:16"],
    K: ["7:53", "9:09"], L: ["8:45", "10:01"], M: ["9:38", "10:53"],
    N: ["10:30", "11:45"], O: ["11:22", "12:37"], Z: ["12:14", "13:30"]
  };

  const linhaC = {
    C: ["0:10", "0:55"], D: ["0:53", "1:47"], E: ["1:45", "2:39"],
    F: ["2:38", "3:31"], G: ["3:30", "4:23"], H: ["4:22", "5:16"],
    I: ["5:14", "6:08"], J: ["6:07", "7:00"], K: ["6:59", "7:52"],
    L: ["7:51", "8:44"], M: ["8:43", "9:37"], N: ["9:35", "10:29"],
    O: ["10:28", "11:21"], Z: ["11:20", "12:13"]
  };

  const padrao = [
    ["0:10", "0:52"], ["0:53", "1:44"], ["1:45", "2:37"],
    ["2:38", "3:29"], ["3:30", "4:21"], ["4:22", "5:13"],
    ["5:14", "6:06"], ["6:07", "6:58"], ["6:59", "7:50"],
    ["7:51", "8:42"], ["8:43", "9:34"], ["9:35", "10:27"],
    ["10:28", "11:19"]
  ];

  const saida = [];

  GRUPOS_REPETICAO.forEach((grupoInicial, iInicial) => {
    GRUPOS_REPETICAO.forEach((grupoAposIS, iApos) => {
      if (iApos > iInicial) return;

      let faixa = null;

      if (grupoAposIS === "A") faixa = linhaA[grupoInicial];
      else if (grupoAposIS === "B") faixa = linhaB[grupoInicial];
      else if (grupoAposIS === "C") faixa = linhaC[grupoInicial];
      else faixa = padrao[iInicial - iApos];

      if (!faixa) return;

      saida.push({
        grupoInicial,
        grupoAposIS,
        minimoTexto: faixa[0],
        maximoTexto: faixa[1],
        minimoMinutos: hmParaMinutos(faixa[0]),
        maximoMinutos: hmParaMinutos(faixa[1])
      });
    });
  });

  return saida;
})();

/*
  ==========================================================
  ANEXO A - TABELA 3
  MERGULHO REPETITIVO - TNR / PTF
  ==========================================================
*/

const PROF_TABELA_3 = [12.2, 13.7, 15.2, 16.8, 18.3, 21.3, 24.4, 27.4, 30.5, 33.5, 36.6, 39.6];

const T3_COMPACTA = {
  A: [[13,150],[12,113],[11,81],[10,64],[9,51],[8,40],[7,32],[6,24],[5,20],[5,15],[5,10],[4,6]],
  B: [[21,142],[18,107],[17,75],[15,59],[14,46],[12,36],[10,29],[9,21],[8,17],[8,12],[7,8],[6,4]],
  C: [[29,134],[25,100],[23,69],[20,54],[19,41],[16,32],[14,25],[12,18],[11,14],[10,10],[9,6],[9,1]],
  D: [[37,126],[32,93],[29,63],[26,48],[24,36],[20,28],[18,21],[16,14],[14,11],[13,7],[12,3]],
  E: [[45,118],[40,85],[35,57],[32,42],[29,31],[25,23],[22,17],[19,11],[17,8],[16,4],[14,1]],
  F: [[55,108],[48,77],[42,50],[38,36],[35,25],[29,19],[25,14],[22,8],[20,5],[18,2]],
  G: [[64,99],[56,69],[49,43],[44,30],[40,20],[34,14],[29,10],[26,4],[23,2]],
  H: [[74,89],[64,61],[57,35],[51,23],[46,14],[39,9],[33,6],[29,1]],
  I: [[85,78],[73,52],[65,27],[58,16],[52,8],[44,4],[38,1]],
  J: [[97,66],[83,42],[73,19],[65,9],[58,2]],
  K: [[109,54],[93,32],[81,11],[72,2]],
  L: [[122,41],[104,21],[90,2]],
  M: [[136,27],[115,10]],
  N: [[152,11]],
  O: [],
  Z: []
};

const ANEXO_A_TABELA_3_MERGULHO_REPETITIVO = Object.entries(T3_COMPACTA).map(([grupo, lista]) => {
  const profundidades = {};

  lista.forEach((valor, index) => {
    profundidades[PROF_TABELA_3[index]] = {
      tnr: valor[0],
      ptf: valor[1]
    };
  });

  return {
    grupo,
    profundidades
  };
});

/*
  ==========================================================
  ANEXO B
  PROFUNDIDADE CORRIGIDA CONFORME ALTITUDE
  ==========================================================
*/

const ANEXO_B_PROFUNDIDADE_CORRIGIDA = {
  altitudes: [304.8, 609.6, 914.4, 1219.1, 1523.9, 1828.7, 2133.5, 2438.3, 2743.1, 3047.9],
  linhas: [
    { profundidadeReal: 3.0, corrigidas: [3.0,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6] },
    { profundidadeReal: 4.6, corrigidas: [4.6,6.1,6.1,6.1,6.1,6.1,6.1,7.6,7.6,7.6] },
    { profundidadeReal: 6.1, corrigidas: [6.1,7.6,7.6,7.6,7.6,7.6,9.1,9.1,9.1,9.1] },
    { profundidadeReal: 7.6, corrigidas: [7.6,9.1,9.1,9.1,10.7,10.7,10.7,10.7,10.7,12.2] },
    { profundidadeReal: 9.1, corrigidas: [9.1,10.7,10.7,10.7,12.2,12.2,12.2,13.7,13.7,13.7] },
    { profundidadeReal: 10.7, corrigidas: [10.7,12.2,12.2,13.7,13.7,13.7,15.2,15.2,15.2,18.3] },
    { profundidadeReal: 12.2, corrigidas: [12.2,13.7,13.7,15.2,15.2,15.2,16.8,16.8,18.3,18.3] },
    { profundidadeReal: 13.7, corrigidas: [13.7,15.2,16.8,16.8,16.8,18.3,18.3,21.3,21.3,21.3] },
    { profundidadeReal: 15.2, corrigidas: [15.2,16.8,18.3,18.3,21.3,21.3,21.3,21.3,21.3,24.4] },
    { profundidadeReal: 16.8, corrigidas: [16.8,18.3,21.3,21.3,21.3,21.3,24.4,24.4,24.4,24.4] },
    { profundidadeReal: 18.3, corrigidas: [18.3,21.3,21.3,21.3,24.4,24.4,24.4,27.4,27.4,27.4] },
    { profundidadeReal: 19.8, corrigidas: [19.8,21.3,24.4,24.4,24.4,27.4,27.4,27.4,30.5,30.5] },
    { profundidadeReal: 21.3, corrigidas: [21.3,24.4,24.4,27.4,27.4,27.4,30.5,30.5,30.5,33.5] },
    { profundidadeReal: 22.9, corrigidas: [22.9,27.4,27.4,27.4,30.5,30.5,30.5,33.5,33.5,33.5] },
    { profundidadeReal: 24.4, corrigidas: [24.4,27.4,27.4,30.5,30.5,30.5,33.5,33.5,36.6,36.6] },
    { profundidadeReal: 25.9, corrigidas: [25.9,30.5,30.5,30.5,33.5,33.5,36.6,36.6,36.6,39.6] },
    { profundidadeReal: 27.4, corrigidas: [27.4,30.5,33.5,33.5,33.5,36.6,36.6,39.6,39.6,42.7] },
    { profundidadeReal: 29.0, corrigidas: [29.0,33.5,33.5,33.5,36.6,36.6,39.6,39.6,42.7,42.7] },
    { profundidadeReal: 30.5, corrigidas: [30.5,33.5,36.6,36.6,39.6,39.6,39.6,42.7,42.7,45.7] },
    { profundidadeReal: 32.0, corrigidas: [32.0,36.6,36.6,39.6,39.6,42.7,42.7,45.7,45.7,48.8] },
    { profundidadeReal: 33.5, corrigidas: [33.5,36.6,39.6,39.6,42.7,42.7,45.7,45.7,48.8,48.8] },
    { profundidadeReal: 35.1, corrigidas: [35.1,39.6,39.6,42.7,42.7,45.7,45.7,48.8,51.8,51.8] },
    { profundidadeReal: 36.6, corrigidas: [36.6,39.6,42.7,42.7,45.7,45.7,48.8,51.8,51.8,54.9] },
    { profundidadeReal: 38.1, corrigidas: [38.1,42.7,42.7,45.7,48.8,48.8,51.8,51.8,54.9,57.9] },
    { profundidadeReal: 39.6, corrigidas: [39.6,42.7,45.7,48.8,48.8,51.8,51.8,54.9,57.9,57.9] },
    { profundidadeReal: 41.1, corrigidas: [41.1,45.7,48.8,48.8,51.8,51.8,54.9,57.9,57.9,61.0] },
    { profundidadeReal: 42.7, corrigidas: [42.7,48.8,48.8,51.8,51.8,54.9,57.9,57.9,61.0,64.0] },
    { profundidadeReal: 44.2, corrigidas: [44.2,48.8,51.8,51.8,54.9,57.9,57.9,61.0,64.0,null] },
    { profundidadeReal: 45.7, corrigidas: [48.8,51.8,51.8,54.9,57.9,57.9,61.0,64.0,null,null] },
    { profundidadeReal: 47.2, corrigidas: [51.8,51.8,54.9,54.9,57.9,61.0,64.0,null,null,null] },
    { profundidadeReal: 48.8, corrigidas: [51.8,54.9,54.9,57.9,61.0,61.0,null,null,null,null] },
    { profundidadeReal: 50.3, corrigidas: [54.9,54.9,57.9,61.0,61.0,null,null,null,null,null] },
    { profundidadeReal: 51.8, corrigidas: [54.9,57.9,57.9,61.0,null,null,null,null,null,null] },
    { profundidadeReal: 53.3, corrigidas: [57.9,57.9,61.0,null,null,null,null,null,null,null] },
    { profundidadeReal: 54.9, corrigidas: [57.9,61.0,64.0,null,null,null,null,null,null,null] },
    { profundidadeReal: 56.4, corrigidas: [61.0,61.0,null,null,null,null,null,null,null,null] },
    { profundidadeReal: 57.9, corrigidas: [61.0,null,null,null,null,null,null,null,null,null] }
  ]
};

const ANEXO_A_OFICIAL = {
  tabela1TempoFundo: ANEXO_A_TABELA_1_TEMPO_FUNDO,
  tabela2IntervaloSuperficie: ANEXO_A_TABELA_2_INTERVALO_SUPERFICIE,
  tabela3MergulhoRepetitivo: ANEXO_A_TABELA_3_MERGULHO_REPETITIVO
};

const ANEXO_B_OFICIAL = ANEXO_B_PROFUNDIDADE_CORRIGIDA;

/*
  ==========================================================
  FUNÇÕES DE CONSULTA
  ==========================================================
*/

function obterProfundidadeCorrigidaPorAltitude(profundidadeReal, altitudeLocal) {
  const tabela = ANEXO_B_OFICIAL;

  const indiceAltitude = tabela.altitudes.findIndex(altitude => altitudeLocal <= altitude);

  if (indiceAltitude === -1) {
    return {
      erro: true,
      mensagem: "Altitude acima do limite do Anexo B."
    };
  }

  const linha = tabela.linhas.find(item => profundidadeReal <= item.profundidadeReal);

  if (!linha) {
    return {
      erro: true,
      mensagem: "Profundidade acima do limite do Anexo B."
    };
  }

  const profundidadeCorrigida = linha.corrigidas[indiceAltitude];

  if (profundidadeCorrigida === null || profundidadeCorrigida === undefined) {
    return {
      erro: true,
      mensagem: "Combinação de altitude e profundidade não disponível no Anexo B."
    };
  }

  return {
    erro: false,
    profundidadeRealInformada: profundidadeReal,
    profundidadeRealTabela: linha.profundidadeReal,
    altitudeInformada: altitudeLocal,
    altitudeTabela: tabela.altitudes[indiceAltitude],
    profundidadeCorrigida
  };
}

function obterGrupoPorTempoFundo(profundidadeMetros, tempoFundo) {
  const linha = ANEXO_A_OFICIAL.tabela1TempoFundo.find(item => profundidadeMetros <= item.profundidadeMetros);

  if (!linha) {
    return {
      erro: true,
      mensagem: "Profundidade acima do limite da Tabela 1 do Anexo A."
    };
  }

  for (let i = 0; i < GRUPOS_REPETICAO.length; i++) {
    const celulaTabela = linha.valores[i];

    if (!celulaTabela) continue;

    if (tempoFundo <= celulaTabela.tempoFundo) {
      return {
        erro: false,
        profundidadeTabela: linha.profundidadeMetros,
        profundidadePes: linha.profundidadePes,
        grupo: GRUPOS_REPETICAO[i],
        limiteSemDescompressao: linha.limiteSemDescompressao,
        descompressiva: celulaTabela.descompressiva,
        parada6m1: celulaTabela.parada6m1,
        tempoFundoTabela: celulaTabela.tempoFundo
      };
    }
  }

  return {
    erro: true,
    mensagem: "Tempo de fundo acima do limite disponível para essa profundidade."
  };
}

function obterGrupoAposIntervaloSuperficie(grupoInicial, intervaloMinutos) {
  if (intervaloMinutos < 10) {
    return {
      erro: false,
      tipo: "MERGULHO_CONTINUADO",
      grupoInicial,
      grupoAposIS: grupoInicial,
      mensagem: "Intervalo inferior a 10 minutos. Considerar continuação do mergulho."
    };
  }

  const candidatos = ANEXO_A_OFICIAL.tabela2IntervaloSuperficie.filter(item => {
    return (
      item.grupoInicial === grupoInicial &&
      intervaloMinutos >= item.minimoMinutos &&
      intervaloMinutos <= item.maximoMinutos
    );
  });

  if (candidatos.length) {
    const melhor = candidatos[candidatos.length - 1];

    return {
      erro: false,
      tipo: "REPETITIVO",
      grupoInicial,
      grupoAposIS: melhor.grupoAposIS,
      intervalo: melhor
    };
  }

  const maior = ANEXO_A_OFICIAL.tabela2IntervaloSuperficie
    .filter(item => item.grupoInicial === grupoInicial)
    .sort((a, b) => b.maximoMinutos - a.maximoMinutos)[0];

  if (maior && intervaloMinutos > maior.maximoMinutos) {
    return {
      erro: false,
      tipo: "SEM_GRUPO_RESIDUAL",
      grupoInicial,
      grupoAposIS: null,
      mensagem: "Intervalo superior ao maior previsto para o grupo. Sem grupo residual."
    };
  }

  return {
    erro: true,
    mensagem: "Intervalo de superfície não encontrado na Tabela 2."
  };
}

function obterTNRPorGrupoEProfundidade(grupo, profundidadeMetros) {
  if (!grupo) {
    return {
      erro: false,
      grupo: null,
      profundidadeTabela: profundidadeMetros,
      tnr: 0,
      ptf: null
    };
  }

  const linhaGrupo = ANEXO_A_OFICIAL.tabela3MergulhoRepetitivo.find(item => item.grupo === grupo);

  if (!linhaGrupo) {
    return {
      erro: true,
      mensagem: "Grupo não encontrado na Tabela 3."
    };
  }

  const profundidades = Object.keys(linhaGrupo.profundidades).map(Number).sort((a, b) => a - b);
  const profundidadeTabela = profundidades.find(p => profundidadeMetros <= p);

  if (!profundidadeTabela) {
    return {
      erro: true,
      mensagem: "Profundidade não encontrada na Tabela 3 para esse grupo."
    };
  }

  const dados = linhaGrupo.profundidades[profundidadeTabela];

  return {
    erro: false,
    grupo,
    profundidadeTabela,
    tnr: dados.tnr,
    ptf: dados.ptf
  };
}
