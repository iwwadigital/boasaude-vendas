import { PartialsModule } from './../../partials/partials.module';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CreatePropostaComponent } from './create-proposta/create-proposta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// CRUD
import { MarkInputsDirective, MarkInputsPhoneDirective } from './../../../core/_base/crud';

import {
    MatIconModule,
    MatInputModule,
	MatFormFieldModule,
	MatAutocompleteModule,
	MatProgressSpinnerModule,
	MatSelectModule,
	MatRadioModule,
	MatDatepickerModule,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	MatDialogModule,
	MatSlideToggleModule,
	MatTableModule,
	MatTooltipModule,
	MatCheckboxModule
 } from '@angular/material';
 import { NgxPhoneMaskBrModule } from 'ngx-phone-mask-br';
import {NgxMaskModule} from 'ngx-mask';
import { MaskBrasilModule } from 'ng2-brasil/dist';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalDadosClinicosComponent } from './create-proposta/modal-dados-clinicos/modal-dados-clinicos.component';
import { CreateAceiteVozComponent } from './create-proposta/create-aceite-voz/create-aceite-voz.component';
import { CreateAssinaturaComponent } from './create-proposta/create-assinatura/create-assinatura.component';
import { ModalMessageComponent } from './create-proposta/modal-message/modal-message.component';
import { SharedVisualModule } from '../shared/shared-visual.module';
import { ViewPropostaComponent } from './view-proposta/view-proposta.component';
import { PropostaComponent } from './proposta.component';
import { AuthGuard } from './../../../core/auth_new/auth.guard';
import { ModalValidatePropostaComponent } from './modal-validate-proposta/modal-validate-proposta.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalEnderecoVidaComponent } from './create-proposta/modal-endereco/modal-endereco.component';
import { ModalLogHistoryComponent } from './modal-log-history/modal-log-history.component';
import { SideMenuComponent } from './view-proposta/side-menu/side-menu.component';


const routes: Routes = [
	{
		path: '',
		component: PropostaComponent,
		children : [
			{
				path: 'create',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							'proposta-criar',
						],
						redirectTo: ''
					}
				},
				component: CreatePropostaComponent,
			},
			{
				path: 'view/:id',
				canActivate: [AuthGuard],
				data: {
					permissions: {
						only: [
							'proposta-ver',
						],
						redirectTo: ''
					}
				},
				component : ViewPropostaComponent
			}
		]
    }
];
@NgModule({
    declarations: [
		PropostaComponent,
		CreatePropostaComponent,
		CreateAceiteVozComponent,
		CreateAssinaturaComponent,
		ViewPropostaComponent,
		ModalDadosClinicosComponent,
		ModalValidatePropostaComponent,
		ModalMessageComponent,
		// MarkInputsDirective,
		MarkInputsPhoneDirective,
		ModalEnderecoVidaComponent,
		ModalLogHistoryComponent,
		SideMenuComponent
    ],
    imports: [
		PartialsModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        MatIconModule,
        MatInputModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatDialogModule,
		NgxPhoneMaskBrModule,
		NgxMaskModule,
		MaskBrasilModule,
		MatDatepickerModule,
		MomentDateModule, // DATA
		MatRadioModule,
		CurrencyMaskModule,
		MatSlideToggleModule,
		SharedVisualModule,
		NgbModule,
		MatTooltipModule,
		MatCheckboxModule,
		NgxMaskModule.forRoot()
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
	],
	entryComponents : [
		ModalDadosClinicosComponent,
		ModalMessageComponent,
		ModalValidatePropostaComponent,
		ModalEnderecoVidaComponent,
		ModalLogHistoryComponent
	]
})
export class PropostaModule{}
