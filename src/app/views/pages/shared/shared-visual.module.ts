import { ColumnActionComponent } from './components/table-geral/action/column-action.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { ColumnComponent } from './components/table-geral/column/column.component';
import { TableGeralComponent } from './components/table-geral/table-geral.component';
import {
	MatIconModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatProgressSpinnerModule,
	MatDialogModule,
	MatProgressBarModule,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	MatTooltipModule,
	MatPaginatorIntl,
	MatFormFieldModule,
	MatSelectModule,
	MatDatepickerModule,
	MatInputModule,
	MatCheckboxModule,
	MatAutocompleteModule,
	MatRadioModule,
 } from '@angular/material';
import { BtnRectangleComponent } from './components/btn-rectangle/btn-rectangle.component';
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TablePropostaComponent } from './components/table-proposta/table-proposta.component';
import { StatusPropostaComponent } from './components/status-proposta/status-proposta.component';
import { ModalAceiteVozComponent } from './components/modal-aceite-voz/modal-aceite-voz.component';
import { PendenciaComponent } from './components/pendencia/pendencia.component';
import { RouterModule } from '@angular/router';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProgressEquipeComponent } from './components/progress-equipes/progress-equipes.component';
import { DisableControlDirective, MarkInputsDirective } from './../../../core/_base/crud';
import { SlideBannerComponent } from './components/slide-banner/slide-banner.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetaUsuarioComponent } from './components/meta-usuario/meta-usuario.component';
import { PartialsModule } from '../../partials/partials.module';
import { IconPortletComponent } from './layout/icon-portlet/icon-portlet.component';
import { PortletRelatorioComponent } from './layout/portlet-relatorio/portlet-relatorio.component';
import { changePaginator } from './../../../PaginatorIntl';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { NgxPhoneMaskBrModule } from 'ngx-phone-mask-br';
import { MaskBrasilModule } from 'ng2-brasil';
import { ModalCreateAceiteVozComponent } from './components/modal-create-aceite-voz/modal-create-aceite-voz.component';
import { CanvasAssinaturaComponent } from './components/canvas-assinatura/canvas-assinatura.component';
import { ModalAssinaturaComponent } from './components/modal-assinatura/modal-assinatura.component';
import { MatSelectSearchComponent } from './components/mat-select-search/mat-select-search.component';
import { ModalGenerateRelatorioComponent } from './components/modal-generate-relatorio/modal-generate-relatorio.component';
import { FichaVisitaComponent } from './components/ficha-visita/ficha-visita.component';
import { ModalFichaVisitaComponent } from './components/modal-ficha-visita/modal-ficha-visita.component';
import { ModalAdesaoOnlineComponent } from './components/modal-adesao-online/modal-adesao-online.component';
import { ModalSelectFilialComponent } from './components/modal-select-filial/modal-select-filial.component';
import { BtnPaymentOnlineComponent } from './components/btn-payment-online/btn-payment-online.component';
import { ModalRegridirDataComponent } from './components/modal-regridir-data/modal-regridir-data.component';


@NgModule({
	declarations: [
		BtnRectangleComponent,
		TableGeralComponent,
		ColumnComponent,
		ModalDeleteComponent,
		ColumnActionComponent,
		TablePropostaComponent,
		StatusPropostaComponent,
		ModalAceiteVozComponent,
		PendenciaComponent,
		ProgressBarComponent,
		ProgressEquipeComponent,
		DisableControlDirective,
		SlideBannerComponent,
		MetaUsuarioComponent,
		IconPortletComponent,
		PortletRelatorioComponent,
		PaginationComponent,
		ModalCreateAceiteVozComponent,
		CanvasAssinaturaComponent,
		ModalAssinaturaComponent,
		MatSelectSearchComponent,
		ModalGenerateRelatorioComponent,
		FichaVisitaComponent,
		ModalFichaVisitaComponent,
		MarkInputsDirective,
		ModalAdesaoOnlineComponent,
		ModalSelectFilialComponent,
		BtnPaymentOnlineComponent,
		ModalRegridirDataComponent
	],
	exports: [
		BtnRectangleComponent,
		TableGeralComponent,
		ColumnComponent,
		ModalDeleteComponent,
		ColumnActionComponent,
		TablePropostaComponent,
		StatusPropostaComponent,
		ModalAceiteVozComponent,
		PendenciaComponent,
		ProgressBarComponent,
		ProgressEquipeComponent,
		DisableControlDirective,
		SlideBannerComponent,
		MetaUsuarioComponent,
		IconPortletComponent,
		PortletRelatorioComponent,
		PaginationComponent,
		ModalCreateAceiteVozComponent,
		CanvasAssinaturaComponent,
		ModalAssinaturaComponent,
		MatSelectSearchComponent,
		ModalGenerateRelatorioComponent,
		FichaVisitaComponent,
		MarkInputsDirective,
		BtnPaymentOnlineComponent,
		ModalRegridirDataComponent
	],
	imports: [
		CommonModule,
		PartialsModule,
		HttpClientModule,
		FormsModule,
		MatIconModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		MatSelectModule,
		ReactiveFormsModule,
		RouterModule,
		MatProgressBarModule,
		MatTooltipModule,
		NgbModule,
		MatDatepickerModule,
		MomentDateModule, // DATA
		NgxPhoneMaskBrModule,
		MaskBrasilModule,
		MatInputModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		MatRadioModule,
	],
	entryComponents: [
		ModalDeleteComponent,
		ModalCreateAceiteVozComponent,
		ModalAceiteVozComponent,
		ModalAssinaturaComponent,
		ModalGenerateRelatorioComponent,
		ModalFichaVisitaComponent,
		ModalAdesaoOnlineComponent,
		ModalSelectFilialComponent,
		ModalRegridirDataComponent
	],
	providers: [
		{provide: MatPaginatorIntl, useValue:changePaginator()},
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
	]
})
export class SharedVisualModule {}
