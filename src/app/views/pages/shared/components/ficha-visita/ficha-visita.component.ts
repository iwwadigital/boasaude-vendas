import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
// Angular
import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

// Services
import { of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FunctionsService } from '../../../../../core/_base/crud/utils/functions.service';
import { FichaVisita } from '../../../../../core/_base/crud/models/class/ficha_visita.model';
import { HttpService } from '../../../../../core/_base/crud/services/http.service';
import { debounceTime, switchMap } from 'rxjs/operators';


@Component({
	selector: 'kt-ficha-visita',
	templateUrl: './ficha-visita.component.html',
	styleUrls: ['ficha-visita.component.scss'],
})
export class FichaVisitaComponent implements OnInit, OnDestroy {
	private subs:Subscription = new Subscription();
    @Input() set setProposta(value){ 
        this.form_proposta = value;
    };
    @Input() proposta_id:number;
    @Output() event_return = new EventEmitter();
    @Output() back_event = new EventEmitter();
    @Input() set setIsCreate(value){
        this.is_create = value;
    }
    @Input() show_back:boolean = false;
    public is_create:boolean = true;
    public form_proposta:any;
    public form:FormGroup;
    public lista_endereco:any = [];
    public titular:any = {};
    public list_options:any[] = [
        {
            item : "Adesão",
            is_checked : false,
            is_checked_create: false
        },
        {
            item: "Adesão + Assinatura",
            is_checked:false,
            is_checked_create: false
        },
        {
            item: "Deixar Envelope",
            is_checked:false,
            is_checked_create: false
        },
        {
            item: "Assinatura + Deixar Envelope",
            is_checked:false,
            is_checked_create: false
        },
        {
            item: "Devolução de valor",
            is_checked:false,
            is_checked_create: false
        }
    ];
	constructor(
		private functions:FunctionsService,
		private router:Router,
        private cdr:ChangeDetectorRef,
        private _http:HttpService,
        private fb:FormBuilder
    ) {}
    

	ngOnInit(): void {
        if(this.is_create){
            this.form = this.fb.group(new FichaVisita());
        }else{
            if(this.form_proposta.oque_fazer && this.form_proposta.oque_fazer != null){
                let arr = this.form_proposta.oque_fazer.split(",");
                this.list_options.map(el => {
                    let is_check = arr.filter(e => el.item == e);
                    if(is_check.length > 0){
                        el.is_checked = true;
                        el.is_checked_create = true;
                    }
                });
            }
            this.form = this.fb.group(new FichaVisita(this.form_proposta));
        }
        let validators_fichaVisita = new FichaVisita().getValidators();
        validators_fichaVisita.map(el =>{
			el.validators.map(val =>{
				this.form.get(el.key).setValidators(val);
			})
		});

        // Pesquisa pelo cep
		this.subs.add(
			this.form.get('cep').valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8 ){
						this.cdr.detectChanges();
						this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
							if(response.bairro || response.localidade || response.logradouro){
								this.form.patchValue({
                                    rua : response.logradouro,
									bairro : response.bairro,
									cidade : response.localidade,
									uf : response.uf
                                });
							}
							this.cdr.detectChanges();
						},(erro:any) =>{
							this.functions.printMsgError(erro);
							this.cdr.detectChanges();
						})

					}
					return of(value);
				})
			).subscribe()
		);
        if(!this.functions.isEmpty(this.form_proposta)){
            this.titular = {
                rua : this.form_proposta.titular_endereco_rua,
                bairro : this.form_proposta.titular_endereco_bairro,
                numero: this.form_proposta.titular_numero ,
                complemento: this.form_proposta.titular_endereco_complemento ,
                referencia: this.form_proposta.titular_endereco_referencia ,
                cidade: this.form_proposta.titular_cidade ,
                uf: this.form_proposta.titular_uf ,
                cep: this.form_proposta.titular_cep 
            };
        }
    }   

    public create(){
        if(this.form.status != "INVALID"){
            let dados = this.getForm();
            this.subs.add(
                this._http.post("ficha-visita",dados).subscribe((resp:any) =>{
                    if(resp.success){
                        this.functions.printSnackBar(resp.message);
                        this.event_return.emit(true);
                    }
                },(e)=>{
                    this.functions.printMsgError(e);
                })
            );
        }else{
            this.functions.printSnackBar("Preencha os campos obrigatórios.");
        }
    }
    public update(){
        if(this.form.status != "INVALID"){
            let dados = this.getForm();
            this.subs.add(
                this._http.put("ficha-visita",dados).subscribe((resp:any) =>{
                    if(resp.success){
                        this.functions.printSnackBar(resp.message);
                        this.event_return.emit(true);
                    }
                },(e)=>{
                    this.functions.printMsgError(e);
                })
            );
        }else{
            this.functions.printSnackBar("Preencha os campos obrigatórios.");
        }
    }

    public back(){
        this.back_event.emit(true);
    }

    public copyTitular(){
        this.form.patchValue(this.titular);
    }

    public checkList(item){
        this.list_options.map((el) =>{
            if(item.item == el.item){
                el.is_checked_create = !el.is_checked_create;
            }
        });
        this.cdr.detectChanges();
    }
    

    public getForm(){
        let dados:FichaVisita = this.form.value;
        dados.data = this.functions.formatData(dados.data,'YYYY-mm-dd');
        dados.oque_fazer = this.list_options.filter((el) => el.is_checked_create).map(el => el.item).join(",");
        dados.proposta_id = this.proposta_id;
        return dados;
    }

	ngOnDestroy(){
        this.subs.unsubscribe();
	}
}
