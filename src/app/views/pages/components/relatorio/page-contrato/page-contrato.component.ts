import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Subscription, of } from 'rxjs';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Tabela } from './../../../../../core/_base/crud/models/class/tabela.model';
import { Produto } from './../../../../../core/_base/crud/models/class/produto.model';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { TipoServico } from './../../../../../core/_base/crud/models/class/tipo_servico.model';
import { PagamentoTipo } from './../../../../../core/_base/crud/models/class/pagamento_tipo.model';
import { API_URL } from './../../../../../api';

@Component({
    selector : 'kt-page-contrato',
    templateUrl: 'page-contrato.component.html',
    styleUrls: ['page-contrato.component.scss']
})
export class PageContratoComponent implements OnInit, OnDestroy{
    private subs:Subscription = new Subscription();
    public search:any = {
        order: "propostas.id",
        sort: "DESC",
        status:"Aprovado",
        is_exportado : 0,
        filial : localStorage.getItem("filial")
    }
    
    public list_tabelas:Tabela[];
    public list_pagamentos:PagamentoTipo[];
    public list_tipos:TipoServico[];
    public list_produtos:Produto[];
    public is_exportado:number = 1;
    public displayedColumns:string[] = ["id","data_aprovacao","cliente","tipo_servico","tabela","visualizar"];
    public form:FormGroup = new FormGroup({
        data_inicial : new FormControl(null),
        data_final : new FormControl(null),
        tabela : new FormControl(null),
        pagamento_tipo : new FormControl(null),
        tipo_servico : new FormControl(null),
        filtro : new FormControl(null),
        is_inclusao : new FormControl(null)
    })


    constructor(
        public functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    

    ngOnInit(){
        let date_atual = new Date();

        this.getTabelas({is_exportado: this.is_exportado,filial: localStorage.getItem("filial")});
        this.getTipoServico({filial: localStorage.getItem("filial")});
        this.getPagamentosTipo({filial: localStorage.getItem("filial")});

        this.subs.add(
            this.functions.$filial.subscribe((el:any) => {
                if(typeof(el) == "string"){
                    this.getTabelas({is_exportado: this.is_exportado,filial: el });
                    this.getTipoServico({filial: el});
                    this.getPagamentosTipo({filial: el});
                }
            })
        );

        this.subs.add(
            this.form.get("tabela").valueChanges.pipe(
                debounceTime(500),
                switchMap(value =>{
                    if(value !== null && typeof value !== 'object'){
                        this.getTabelas({q:value,is_exportado: this.is_exportado});
                    }else{
                        if(!this.functions.isEmpty(this.form.value.tabela)  && typeof this.form.value.tabela == 'object'){
                            this.list_produtos = [];
                            this.getProdutos({tabela_id: this.form.value.tabela.id })
                        }
                    }
                    return of(null);
                })
            ).subscribe()
        );

        this.subs.add(
            this.form.get("tipo_servico").valueChanges.pipe(
                debounceTime(500),
                switchMap(value =>{
                    if(value !== null && typeof value !== 'object'){
                        this._http.get("tipo-servico",{q:value,filial:localStorage.getItem("filial")}).pipe(
                            catchError((err,caught)=>{
                                this.functions.printSnackBar(`Não tem tipos de serviços cadastrado com esse nome.`);
                                return of(err);
                            })
                        ).subscribe((resp:any)=>{
                            this.list_tipos = resp.tipos_servico;
                            this.cdr.detectChanges();
                        },(erro:any)=>{
                            this.list_tipos = [];
                        })
                    }
                    return of(null);
                })
            ).subscribe()
        );


        this.form.get("filtro").valueChanges.subscribe((value) =>{
            if(!this.functions.isEmpty(value)){
                // this.is_exportado = value == 1 ? 0 : 1;
                this.is_exportado = value;
                this.getTabelas({is_exportado: this.is_exportado});
            }
        })
    }

    public getTabelas(params?:any){
        this._http.get("tabela",params).pipe(
            catchError((err,caught)=>{
                this.functions.printSnackBar(`Não tem tabela encontrada.`);
                return of(err);
            })
        ).subscribe((response:any) =>{
            this.list_tabelas = response.tabelas;
            this.cdr.detectChanges();
        },(e)=>{
            this.list_tabelas = [];
            this.cdr.detectChanges();
        });
    }

    public getPagamentosTipo(params?:any){
        this.subs.add(
            this._http.get("pagamento-tipo",params).subscribe((response:any) =>{
                this.list_pagamentos = response.pagamentos_tipos;
                this.cdr.detectChanges();
            },(e:any)=>{
                this.list_pagamentos = [];
                this.cdr.detectChanges();
            })
        );
    }

    public getTipoServico(params?:any){
        this.subs.add(
            this._http.get("tipo-servico",params).subscribe((response:any) =>{
                this.list_tipos = response.tipos_servico;
                this.cdr.detectChanges();
            })
        );
    }

    public getProdutos(params?:any){
        this.subs.add(
            this._http.get("produto",params).subscribe((response:any) =>{
                this.list_produtos = response.produtos;
            },(e)=>{
                this.list_produtos = [];
                this.cdr.detectChanges();
            })
        )
    }

    public search_form(params?:any){
        let form:any = this.form.value;
        let search:any ={
            order: "id",
            sort: "DESC",
            status:"Aprovado",
            is_exportado : 0
        };
        // if(this.functions.isEmpty(form.data_inicial) && 
        //     this.functions.isEmpty(form.data_final)  && 
        //     this.functions.isEmpty(form.tipo) && 
        //     this.functions.isEmpty(form.is_exportado)){
        //     this.functions.printSnackBar("Digite algo para poder pesquisar.");
        //     return ;
        // }
        if(!this.functions.isEmpty(form.data_inicial)){
            search.data_inicial_aprovacao = this.functions.formatData(new Date(form.data_inicial),"YYYY-mm-dd");
        }
        if(!this.functions.isEmpty(form.data_final)){
            search.data_final_aprovacao = this.functions.formatData(new Date(form.data_final),"YYYY-mm-dd");
        }
        if(!this.functions.isEmpty(form.tabela)){
            search.tabela_id = form.tabela.id;
        }
        if(!this.functions.isEmpty(form.tipo_servico)){
            search.tipo_servico_id = form.tipo_servico.id;
        }
        if(!this.functions.isEmpty(form.pagamento_tipo)){
            search.pagamento_tipo_id = form.pagamento_tipo.id;
        }
        if(!this.functions.isEmpty(form.filtro)){
            search.is_exportado = form.filtro;
        }
        if(!this.functions.isEmpty(form.is_inclusao)){
            search.is_inclusao = form.is_inclusao;
        }
        search.filial = localStorage.getItem("filial");
        if(params){
            return search;
        }else{
            this.search = search;
        }

    }

    public exportacao(){
        // this._http.get("proposta-exportacao",this.search).subscribe((response:any)=>{
        //     // this.functions.printSnackBar(response.message);
        //     // window.open(response.url);
        //     console.log(response);
        //     this.functions.downloadFile(response.url);
        // },(erro:any) =>{
        //     this.functions.printMsgError(erro);
        // })
        let params = '';
        let index = 0;
        let token = localStorage.getItem("accessToken");

        let search = this.search_form(1);
        for(let param in search){
            if(index != 0 ){
                params += "&";
            }
            params += param+"="+search[param];
            index++;
        }
        params += "&filial="+localStorage.getItem("filial");
        params += "&token="+token;
        let url = API_URL+"/proposta-exportacao?"+params;
        window.open(url,'_blank');
    }
    
	displayFn(data?:any){
		return data ? data.nome : undefined;
    }

    ngOnDestroy(){
		this.subs.unsubscribe();
	}
}