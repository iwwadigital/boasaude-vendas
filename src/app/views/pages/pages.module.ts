// Angular
import { NgModule } from '@angular/core';
import { CommonModule,registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Material
import {
	MatInputModule,
	MatFormFieldModule,
	MatIconModule,
	MatDialogModule,
	MatSnackBarModule,
	MatSelectModule,
	MatAutocompleteModule,
	MatTableModule,
	MatProgressSpinnerModule,
	MatDatepickerModule,
	MatCheckboxModule,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	MatPaginatorIntl,
	MatSlideToggleModule,
	MatChipsModule
 } from '@angular/material';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { SharedVisualModule } from './shared/shared-visual.module';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { 
	MarkInputsDirective,
	DisableControlDirective 
} from './../../core/_base/crud';

import { PageUsuarioComponent } from './components/usuario/page-usuario/page-usuario.component';
import { PageProdutoComponent } from './components/produto/page-produto/page-produto.component';
import { PageTabelaComponent } from './components/tabela/page-tabela/page-tabela.component';
import { PageEnderecoComponent } from './components/endereco/page-endereco/page-endereco.component';
import { PageEquipeComponent } from './components/equipe/page-equipe/page-equipe.component';
import { ModalUsuario } from './components/usuario/modal-usuario/modal-usuario.component';
import { ModalTabelaComponent } from './components/tabela/modal-tabela/modal-tabela.component';
import { ModalProdutoComponent } from './components/produto/modal-produto/modal-produto.component';
import { ModalEnderecoComponent } from './components/endereco/modal-endereco/modal-endereco.component';
import { ModalEquipeComponent } from './components/equipe/modal-equipe/modal-equipe.component';
import { ViewEquipeComponent } from './components/equipe/view-equipe/view-equipe.component';
import { ViewUsuarioComponent } from './components/usuario/view-usuario/view-usuario.component';
import { RouterModule } from '@angular/router';
import { PageBannerComponent } from './components/banner/page-banner/page-banner.component';
import { ModalBannerComponent } from './components/banner/modal-banner/modal-banner.component';
import { PageRelatorioComponent } from './components/relatorio/page-relatorio/page-relatorio.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { changePaginator } from './../../PaginatorIntl';
import { PageContratoComponent } from './components/relatorio/page-contrato/page-contrato.component';
import { NgxPhoneMaskBrModule } from 'ngx-phone-mask-br';
import {LOCALE_ID} from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { PageTipoServicoComponent } from './components/tipo-servico/page-tipo-servico/page-tipo-servico.component';
import { ModalTipoServicoComponent } from './components/tipo-servico/modal-tipo-servico/modal-tipo-servico.component';
import { ModalCanalVendasComponent } from './components/canal-vendas/modal-canal-vendas/modal-canal-vendas.component';
import { PageCanalVendasComponent } from './components/canal-vendas/page-canal-vendas/page-canal-vendas.component';
import { PageFilialComponent } from './components/filial/page-filial/page-filial.component';
import { ModalFilialComponent } from './components/filial/modal-filial/modal-filial.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ModalSeguroSaudeComponent } from './components/seguro-saude/modal-seguro-saude/modal-seguro-saude.component';
import { PageSeguroSaudeComponent } from './components/seguro-saude/page-seguro-saude/page-seguro-saude.component';
import { FormEnderecoComponent } from './components/filial/modal-filial/form-endereco/form-endereco.component';
import { FormRegraNegocioComponent } from './components/filial/modal-filial/form-regra-negocio/form-regra-negocio.component';
import { FormMetodoPagamento } from './components/filial/modal-filial/form-metodo-pagamento/form-metodo-pagamento.component';
import { FormTipoServicoMultiploComponent } from './components/filial/modal-filial/form-tipo-servico-multiplo/form-tipo-servico-multiplo.component';
import { FormTipoServicoUnico } from './components/filial/modal-filial/form-tipo-servico-unico/form-tipo-servico-unico.component';

registerLocaleData(ptBr);

@NgModule({
	declarations: [
		PageUsuarioComponent,
		PageTabelaComponent,
		PageProdutoComponent,
		PageEnderecoComponent,
		PageEquipeComponent,
		PageBannerComponent,
		PageRelatorioComponent,
		PageContratoComponent,
		PageTipoServicoComponent,
		PageCanalVendasComponent,
		PageFilialComponent,
		PageSeguroSaudeComponent,
		
		ModalUsuario,
		ModalTabelaComponent,
		ModalProdutoComponent,
		ModalEnderecoComponent,
		ModalEquipeComponent,
		ModalBannerComponent,
		ModalTipoServicoComponent,
		ModalCanalVendasComponent,
		ViewEquipeComponent,
		ViewUsuarioComponent,
		ModalFilialComponent,
		ModalSeguroSaudeComponent,

		FormEnderecoComponent,
		FormRegraNegocioComponent,
		FormMetodoPagamento,
		FormTipoServicoMultiploComponent,
		FormTipoServicoUnico,
	],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		ECommerceModule,
		UserManagementModule,
		SharedVisualModule, // Meu modulo de compartilhamento
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatDialogModule,
		MatSnackBarModule,
		MatSelectModule,
		MatAutocompleteModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatDatepickerModule,
		MomentDateModule,
		RouterModule,
		MatCheckboxModule,
		CurrencyMaskModule,
		NgxPhoneMaskBrModule,
		MatChipsModule,
		MatSlideToggleModule,
		AngularEditorModule
	],
	providers: [
		{
			provide : MAT_DATE_FORMATS,
			useValue: {
				parse: {
					dateInput: 'DD/MM/YYYY',
				  },
				  display: {
					dateInput: 'DD/MM/YYYY',
					monthYearLabel: 'YYYY',
					dateA11yLabel: 'LL',
					monthYearA11yLabel: 'YYYY',
				  },
			}
		},
		{provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
		{
			provide: LOCALE_ID,
			useValue: "pt"
		},
		{provide: MatPaginatorIntl, useValue:changePaginator()},
	],
	entryComponents : [
		ModalUsuario,
		ModalTabelaComponent,
		ModalProdutoComponent,
		ModalEnderecoComponent,
		ModalEquipeComponent,
		ModalBannerComponent,
		ModalTipoServicoComponent,
		ModalCanalVendasComponent,
		ModalFilialComponent,
		ModalSeguroSaudeComponent
	]
})
export class PagesModule {
}
