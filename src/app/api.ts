// export const URL = "http://vitalmedvendas.iwwadigital.com.br";
export const URL = "https://vendas.vitalmed.com.br";

export const API_URL = `${URL}/api`;
export const URL_PDF = `${URL}/`;

export const STATUS_PROPOSTAS = {
    1 : "Aprovado",
    2 : "Em aprovação",
    3 : "Pendente", 
    4 : "Recusado",
    5 : "Rascunho"
}

// export const TIPO_SERVICO_DESC_FOLHA_ID = 2131;
export const TIPO_SERVICO_DESC_FOLHA_ID = 230;
export const TIPO_SERVICO_TRT_FAMI_ID = 620;
export const TIPO_SERVICO_TRT_REGI_ID = 621;

export const ADESAO_PAGAMENTO_ONLINE_ID = 103;
export const CORRETORA_ID = 104;

export const ESTADO_CIVIL = {
    "Solteiro" : "S",
    "Casado" : "C",
    "Divorciado" : "D",
    "Viúvo" : "V",
    "Marital" : "M",
    "Desquitado" : "Q",
    "Não informado" : "N",
};

export const BANNER_SIZES = {
    desktop: {
        width:872,
        height:220,
    },
    mobile: {
        width:468,
        height:468,
    },
};

export const TIPOS_PAMENTOS = {
    "dinheiro" : [1], // Dinheiro
    "conta" : [4,91,96,100], // Cheque Debito automatico
    "cartao" : [3,92,97,101], // Cartão de credito
    "cartao_d" : [6], // Cartão de débito
    "repasse" : [94,93,98,102], //Repasse
    // "df" : [93,98,102] // Debito em folha
    "boleto" : [90,95,99], // Boleto
    "cadastramento_online" : [103]
};

export const LISTA_BANDEIRAS = [
    "Mastercard",
    "Visa",
    "American Express",
    "Elo",
    "Hipercard",
    "Diners Club"
]


export const LISTA_ESTADO = {
    "AC": "Acre" ,
    "AL": "Alagoas" ,
    "AP": "Amapá" ,
    "AM": "Amazonas" ,
    "BA": "Bahia" ,
    "CE": "Ceará" ,
    "DF": "Distrito Federal" ,
    "ES": "Espírito Santo" ,
    "GO": "Goiás" ,
    "MA": "Maranhão" ,
    "MT": "Mato Grosso" ,
    "MS": "Mato Grosso do Sul" ,
    "MG": "Minas Gerais" ,
    "PA": "Pará" ,
    "PB": "Paraíba" ,
    "PR": "Paraná" ,
    "PE": "Pernambuco" ,
    "PI": "Piauí" ,
    "RJ": "Rio de Janeiro" ,
    "RN": "Rio Grande do Norte" ,
    "RS": "Rio Grande do Sul" ,
    "RO": "Rondônia" ,
    "RR": "Roraima" ,
    "SC": "Santa Catarina" ,
    "SP": "São Paulo" ,
    "SE": "Sergipe" ,
    "TO": "Tocantins" ,
}

export const LISTA_TIPO_ADESAO:any[] = [
    {
        id: 1,
        nome : "Dinheiro"
    }, 
    {
        id: 4,
        nome: "Cheque"
    },
    {
        id: 3,
        nome: "Cartão de crédito"
    },
    {
        id: 6,
        nome: "Cartão de Débito"
    },
    {
        id: 103,
        nome: "Pagamento Online"
    },
    {
        id: 104,
        nome: "Corretora"
    },
];

export const LISTA_TIPO_CONTA = [
    {
        value : "001",
        nome : "001 – Conta Corrente de Pessoa Física"
    },
    {
        value : "002",
        nome : "002 – Conta Simples de Pessoa Física"
    },
    {
        value : "003",
        nome : "003 – Conta Corrente de Pessoa Jurídica"
    },
    {
        value : "006",
        nome : "006 – Entidades Públicas"
    },
    // {
    //     value : "007",
    //     nome : "007 – Depósitos Instituições Financeiras"
    // },
    // {
    //     value : "013",
    //     nome : "013 – Poupança de Pessoa Física"
    // },
    {
        value : "022",
        nome : "022 – Poupança de Pessoa Jurídica"
    },
    {
        value : "023",
        nome : "023 – Conta Caixa Fácil"
    },
    {
        value : "1288",
        nome : "1288 – Poupança digital"
    },
    // {
    //     value : "028",
    //     nome : "028 – Poupança de Crédito Imobiliário"
    // },
    // {
    //     value : "032",
    //     nome : "032 – Conta Investimento Pessoa Física"
    // },
    // {
    //     value : "034",
    //     nome : "034 – Conta Investimento Pessoa Jurídica"
    // },
    // {
    //     value : "037",
    //     nome : "037 – Conta Salário"
    // },
    // {
    //     value : "043",
    //     nome : "043 – Depósitos Lotéricos"
    // },
    // {
    //     value : "131",
    //     nome : "131 – Poupança Integrada"
    // },
];