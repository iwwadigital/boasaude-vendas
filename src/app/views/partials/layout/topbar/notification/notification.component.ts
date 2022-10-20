// Angular
import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import {Notificacao} from '../../../../../core/_base/crud/models/class/notificacao.model';
import { Subscription, Observable, interval } from 'rxjs';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
@Component({
	selector: 'kt-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['notification.component.scss']
})
export class NotificationComponent implements OnDestroy {
	private sub:Subscription = new Subscription();
	private startCounter:Observable<any>;
	// Show dot on top of the icon
	@Input() dot: string;

	// Show pulse on icon
	@Input() pulse: boolean;

	@Input() pulseLight: boolean;

	// Set icon class name
	@Input() icon = 'flaticon2-bell-alarm-symbol';
	@Input() iconType: '' | 'success';

	// Set true to icon as SVG or false as icon class
	@Input() useSVG: boolean;

	// Set bg image path
	@Input() bgImage: string;

	// Set skin color, default to light
	@Input() skin: 'light' | 'dark' = 'light';

	@Input() type: 'brand' | 'success' = 'success';

	@Input() color : string = "var(--color-green-dark)";

	public titleQtdNotificacao:string = "Sem Notificação";
	public hasNotificacao:boolean = false;
	public isVisualizado:boolean = false;
	public intervalGetNotificacao:number = 600;
	public notificacoes:Notificacao[] = [];

	/**
	 * Component constructor
	 *
	 * @param sanitizer: DomSanitizer
	 */
	constructor(
		private sanitizer: DomSanitizer,
		private functions:FunctionsService,
		private cdr:ChangeDetectorRef,
		private _http:HttpService
	) {
		this.getNotificacao();
		this.startCounter = interval(1000);
		this.sub.add(
			this.startCounter.subscribe((tempo) =>{
				if(tempo !== 0 && tempo % this.intervalGetNotificacao == 0){
					this.getNotificacao();
					// this.isTokenValid();
				}
			})
		)
	}

	backGroundStyle(): string {
		// if (!this.bgImage) {
		// 	return 'none';
		// }

		// return 'url(' + this.bgImage + ')';
		return this.color;
	}


	public getNotificacao(){
		this.sub.add(
			this._http.get("notificacao").subscribe((response:any)=>{
				this.notificacoes = response.notificacoes;
				if(this.notificacoes.length > 1){
					this.titleQtdNotificacao = this.notificacoes.length + ' Notificações';
				}else{
					this.titleQtdNotificacao = this.notificacoes.length + ' Notificação';
				}
				this.hasNotificacao = true;
				this.isVisualizado = false;
				this.pulse = true;
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.pulse = false;
				this.pulseLight = false;
				this.hasNotificacao = false;
				this.isVisualizado = false;
				this.titleQtdNotificacao = "Sem Notificação";
				this.cdr.detectChanges();
			})
		);
	}

	public visualizeiNotificacao(){
		let visualizei:any = {notificacoes:[]};

		if(this.notificacoes.length > 0 && !this.isVisualizado){
			visualizei.notificacoes = this.notificacoes;
			visualizei.id = this.functions.getUsuario().id;
			this._http.put("notificacao",visualizei).subscribe((resp:any)=>{
				this.pulse = false;
				this.hasNotificacao = false;
				this.pulseLight = false;
				this.isVisualizado = true;
				// this.notificacoes = [];
				this.cdr.detectChanges();
			},(erro:any)=>{
				// console.log(erro.error);
			})
		}
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}
}
