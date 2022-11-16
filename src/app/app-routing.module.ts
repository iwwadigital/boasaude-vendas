// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Page
import { PageUsuarioComponent } from './views/pages/components/usuario/page-usuario/page-usuario.component';
import { PageTabelaComponent } from './views/pages/components/tabela/page-tabela/page-tabela.component';
import { PageProdutoComponent } from './views/pages/components/produto/page-produto/page-produto.component';

// Auth
// import { AuthGuard } from './core/auth';
import { LoginGuard } from './core/auth_new/login.guard';
import { AuthGuard } from './core/auth_new/auth.guard';
import { PageEquipeComponent } from './views/pages/components/equipe/page-equipe/page-equipe.component';
import { ViewEquipeComponent } from './views/pages/components/equipe/view-equipe/view-equipe.component';
import { ViewUsuarioComponent } from './views/pages/components/usuario/view-usuario/view-usuario.component';
import { PageRelatorioComponent } from './views/pages/components/relatorio/page-relatorio/page-relatorio.component';
import { PageContratoComponent } from './views/pages/components/relatorio/page-contrato/page-contrato.component';
import { PageTipoServicoComponent } from './views/pages/components/tipo-servico/page-tipo-servico/page-tipo-servico.component';
import { PageCanalVendasComponent } from './views/pages/components/canal-vendas/page-canal-vendas/page-canal-vendas.component';
import { PageFilialComponent } from './views/pages/components/filial/page-filial/page-filial.component';
import { PageSeguroSaudeComponent } from './views/pages/components/seguro-saude/page-seguro-saude/page-seguro-saude.component';


const routes: Routes = [
	{
		path: 'auth', 
		canActivate: [LoginGuard],
		data: {
			permissions: {
				redirectTo: ''
			}
		},
		loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		data: {
			permissions: {
				only: [
					"sistema-ver",
				],
				redirectTo: 'auth/login'
			}
		},
		children: [
			{
				path: 'usuario',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"usuario-page",
						],
						redirectTo: ''
					}
				},
				component: PageUsuarioComponent
			},
			{
				path: 'usuario/perfil',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"sistema-ver"
						],
						redirectTo: ''
					}
				},
				component: ViewUsuarioComponent
			},
			{
				path: 'usuario/view/:id',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"usuario-ver",
						],
						redirectTo: ''
					}
				},
				component: ViewUsuarioComponent
			},
			{
				path: 'tabela',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"tabela-page",
						],
						redirectTo: ''
					}
				},
				component: PageTabelaComponent
			},
			{
				path: 'tipo-servico',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"tipo-servico-page",
						],
						redirectTo: ''
					}
				},
				component: PageTipoServicoComponent
			},
			{
				path: 'canal-vendas',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"tipo-servico-page",
						],
						redirectTo: ''
					}
				},
				component: PageCanalVendasComponent
			},
			// {	
			// 	path: 'produto',
			// 	canActivate: [AuthGuard],
			// 	data: {
			// 		permissions: {
			// 			only: [
			// 				"produto-page",
			// 			],
			// 			redirectTo: ''
			// 		}
			// 	},
			// 	component: PageProdutoComponent
			// },
			{
				path: 'equipe',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"equipe-page",
						],
						redirectTo: ''
					}
				},
				component: PageEquipeComponent
			},
			
			{
				path: 'equipe/view/:id',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"equipe-page",
						],
						redirectTo: ''
					}
				},
				component: ViewEquipeComponent
			},
			{
				path: 'relatorio',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"relatorio-page",
						],
						redirectTo: ''
					}
				},
				component: PageRelatorioComponent
			},
			{
				path: 'contrato',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"contrato-page",
						],
						redirectTo: ''
					}
				},
				component: PageContratoComponent
			},
			{
				path: 'seguro-saude',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"seguro-saude-page",
						],
						redirectTo: ''
					}
				},
				component: PageSeguroSaudeComponent
			},
			{
				path: 'filial',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"filial-page",
						],
						redirectTo: ''
					}
				},
				component: PageFilialComponent
			},
			{
				path: 'proposta',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							"proposta-ver",
						],
						redirectTo: ''
					}
				},
				loadChildren: () => import('./views/pages/proposta/proposta.module').then(m => m.PropostaModule)
			},
			
			{
				path: 'dashboard',
				loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'user-management',
				loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
