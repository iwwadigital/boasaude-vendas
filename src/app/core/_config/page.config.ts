export class PageConfig {
	public defaults: any = {
		'dashboard': {
			page: {
				title: 'Página inicial',
				desc: ''
			},
		},
		"usuario": {
			page : {
				title: "Usuários",
				desc: ""
			},
			"view": {
				page : {
					title: "Usuário",
					desc: ""
				}
			},
			"perfil": {
				page : {
					title: "Usuário",
					desc: ""
				}
			}
		},
		'produto': {
			page : {
				title: "Produtos",
				desc: ""
			}
		},
		'tabela': {
			page : {
				title: "Tabelas",
				desc: ""
			}
		},
		'relatorio': {
			page : {
				title: "Relatórios",
				desc: ""
			}
		},
		'contrato': {
			page : {
				title: "Contratos",
				desc: ""
			}
		},
		'equipe': {
			page : {
				title: "Equipes",
				desc: ""
			},
			"view": {
				page : {
					title: "Equipe",
					desc: ""
				}
			}
		},
		'endereco': {
			page : {
				title: "Endereços",
				desc: ""
			}
		},
		'banner': {
			page : {
				title: "Banners",
				desc: ""
			}
		},
		'proposta': {
			page : {
				title: "Propostas",
				desc: ""
			},
			"view":{
				page : {
					title: "Proposta",
					desc: ""
				},
			},
			"create" :{
				page : {
					title: "Proposta",
					desc: ""
				},
			}
		},
		profile: {
			page: {title: 'User Profile', desc: ''}
		},
		error: {
			404: {
				page: {title: '404 Not Found', desc: '', subheader: false}
			},
			403: {
				page: {title: '403 Access Forbidden', desc: '', subheader: false}
			}
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
