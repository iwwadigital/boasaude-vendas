export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: false,
					alignment: 'left',
					icon: 'flaticon-user',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					show_menu: false,
					permissao : [],
					//Para aparecer o breadcrumb dele
					submenu:[
						{
							title: "Usuários",
							root: true,
							alignment: 'left',
							page : "/usuario",
							permissao : [],
							submenu:[
								{
									title: "Visualizar",
									root: true,
									alignment: 'left',
									page : "/usuario/view",
									icon: 'flaticon2-avatar',
								},
								{
									title: "Visualizar",
									root: true,
									alignment: 'left',
									page : "/usuario/perfil",
									icon: 'flaticon2-avatar',
								},
								
							],
						},
						{
							title: "Propostas",
							root: true,
							alignment: 'left',
							page : "/",
							permissao : [],
							submenu:[
								{
									title: "Visualização da proposta",
									root: true,
									alignment: 'left',
									page : "/proposta/view",
									icon: 'flaticon2-avatar',
								},
								{
									title: "Cadastro",
									root: true,
									alignment: 'left',
									page : "/proposta/create",
									icon: 'flaticon2-avatar',
								},
								
							],
						},
						{
							title: "Equipes",
							root: true,
							alignment: 'left',
							page : "/equipe",
							permissao : [],
							submenu:[
								{
									title: "Visualizar",
									root: true,
									alignment: 'left',
									page : "/equipe/view",
									icon: 'flaticon2-avatar',
								}
							],
						},
						{
							title: "Relatórios",
							root: true,
							alignment: 'left',
							page : "/relatorio",
							permissao : [],
						},
						{
							title: "Contratos",
							root: true,
							alignment: 'left',
							page : "/contrato",
							permissao : [],
						},
						{
							title: "Tabelas de valores",
							root: true,
							alignment: 'left',
							page : "/tabela",
							permissao : [],
						},
						{
							title: "Tipos de Serviços",
							root: true,
							alignment: 'left',
							icon: 'flaticon2-google-drive-file',
							page : "/tipo-servico",
							show_menu: true,
							permissao : [
								"tipo-servico-page"
							],
						},
					]
				},
				{
					title: "Equipes",
					root: true,
					alignment: 'left',
					page : "/equipe",
					icon: 'flaticon2-avatar',
					show_menu: true,
					permissao : [
						"equipe-page"
					],
				},
				{
					title: "Usuários",
					root: true,
					alignment: 'left',
					icon: 'flaticon2-user',
					page : "/usuario",
					show_menu: true,
					permissao : [
						"usuario-page"
					],
				},
				{
					title: "Relatórios",
					root: true,
					alignment: 'left',
					page : "/relatorio",
					icon: 'flaticon-notepad',
					show_menu: true,
					permissao : [
						"relatorio-page"
					],
				},
				{
					title: "Contratos",
					root: true,
					alignment: 'left',
					icon: 'flaticon2-google-drive-file',
					page : "/contrato",
					show_menu: true,
					permissao : [
						"contrato-page"
					],
				},
				{
					title: "Tipos de Serviços",
					root: true,
					alignment: 'left',
					icon: 'flaticon2-box-1',
					page : "/tipo-servico",
					show_menu: true,
					permissao : [
						"tipo-servico-page"
					],
				},
				{
					title: "Tabelas de valores",
					root: true,
					alignment: 'left',
					page : "/tabela",
					icon: "flaticon2-percentage",
					show_menu: true,
					permissao : [
						"tabela-page"
					],
				},
				{
					title: "Canais de Vendas",
					root: true,
					alignment: 'left',
					page : "/canal-vendas",
					icon: "flaticon2-checking",
					show_menu: true,
					permissao : [
						"tabela-page"
					],
				},
				// {
				// 	title: "Produtos",
				// 	root: true,
				// 	alignment: 'left',
				// 	page : "/produto",
				// 	icon: 'flaticon2-box-1',
				// 	show_menu: true,
				// 	permissao : [
				// 		"produto-page"
				// 	],
				// },
				{
					title: "Filiais",
					root: true,
					alignment: 'left',
					icon: 'flaticon2-image-file',
					page : "/filial",
					show_menu: true,
					permissao : [
						"filial-page"
					],
				},
				{
					title: "Seguros Saúde",
					root: true,
					alignment: 'left',
					icon: 'flaticon2-image-file',
					page : "/seguro-saude",
					show_menu: true,
					permissao : [
						"seguro-saude-page"
					],
				},
				
			]
		},
		aside: {
			self: {},
			items: [
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
