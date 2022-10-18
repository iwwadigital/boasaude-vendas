import { Component, OnInit, ChangeDetectorRef,ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';

import { Chart } from 'chart.js/dist/Chart.min.js';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalUsuario } from '../modal-usuario/modal-usuario.component';

@Component({
    selector: 'kt-view-usuario',
    templateUrl : './view-usuario.component.html',
    styleUrls: ['./view-usuario.component.scss']
})
export class ViewUsuarioComponent implements OnInit, OnDestroy{
    private subs:Subscription = new Subscription();
    public usuario:Usuario;
    public usuario_logado:Usuario;
    public search:any;
    public url_page:string = "/usuario/view";
    public is_perfil:boolean = false; // Quando é perfil do proprio usuario
    public isLoading:boolean = false; 
    public equipes = [];

    public data: { labels: string[]; datasets: any[] };
    public data_raiting: { labels: string[]; datasets: any[] };
    @ViewChild('chart', {static: true}) chart: ElementRef;
    @ViewChild('chart_raiting', {static: true}) chart_raiting: ElementRef;
    
    public form:FormGroup = new FormGroup({
        filtro : new FormControl(null)
    });
    constructor(
        private _http:HttpService,
        public functions:FunctionsService,
        private route:ActivatedRoute,
        private router:Router,
        private dialog:MatDialog,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.usuario_logado = this.functions.getUsuario();
        this.route.params.subscribe((params:any)=>{
            if(!this.functions.isEmpty(params.id)){
                this.show(params.id);
            }else{
                let usuario = this.functions.getUsuario();
                this.is_perfil = true;
                this.show(usuario.id);
            }
        })
        this.form.get("filtro").valueChanges.subscribe((filtro:any)=>{
            this.search = {vendedor_id: this.usuario.id, order: filtro};
			this.cdr.detectChanges();
		})

        if (!this.data) {
			this.data = {
				labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
				datasets: [
					{
						// label: Aprovadas
						backgroundColor: "#3DB239",
						// backgroundColor: "#34bfa3",
						data: [
							0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
						]
					}, {
						// label: Criadas
						backgroundColor: '#DCDCDC',
						data: [
							0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
						]
					}
				]
            };
        }
        this.data_raiting = {
            labels: ["Propostas criadas","Propostas recusadas","Propostas aprovadas"],
            datasets : [
                {
                    backgroundColor: ['#DCDCDC',"#E43B3B","#3DB239"],
                    data: [0,0,0]
                }
            ]
        }
        
    }
    
    public show(id?:any){
        this.isLoading = true;
        id = id ? id : this.usuario.id;
        if(!this.is_perfil){
            this._http.show("usuario",id).subscribe((response:any) =>{
                this.callGraphic(response);
                this.search = {vendedor_id : this.usuario.id};
                this.url_page = `${this.url_page}/${this.usuario.id}`;
                this.isLoading = false;
                this.equipes = this.usuario.equipes;
                this.cdr.detectChanges();
            },(erro:any)=>{
                this.functions.printMsgError(erro);
                this.equipes = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            })
        }else{
            this._http.get("usuario/profile/view").subscribe((response:any) =>{
                this.callGraphic(response);
                this.search = {vendedor_id : this.usuario.id};
                this.url_page = `${this.url_page}/${this.usuario.id}`;
                this.equipes = this.usuario.equipes;
                this.isLoading = false;
                this.cdr.detectChanges();
            },(erro:any)=>{
                this.functions.printMsgError(erro);
                this.isLoading = false;
                this.equipes = [];
                this.cdr.detectChanges();
            })
        }
    }

    public async callGraphic(response){
        // SET usuario
        await this.setUsuario(response.usuario);
        // SET PROPOSTA/ANO
        await this.setDadosChart(response.usuario.dados_mes);
        // SET RAITTING
        await this.setRaitingChart(response.usuario); 
    }

    public async setUsuario(usuario){
        this.usuario = usuario;
        this.cdr.detectChanges();
    }
    public async setDadosChart(data_month:any[]){
        data_month.map((el,i)=>{
            this.data.datasets[0].data[i] = el.aprovadas;
            this.data.datasets[1].data[i] = el.criadas;
        });
        
        

        const chart = new Chart(this.chart.nativeElement, {
            type: 'bar',
            data: this.data,
            options: {
                title: {
                    display: true,
                },
                tooltips: {
                    intersect: false,
                    mode: 'nearest',
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                barRadius: 4,
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines: true,
                        stacked: true
                    }],
                    yAxes: [{
                        display: true,
                        stacked: true,
                        gridLines: true
                    }]
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        });
        chart.update();
        
        this.cdr.detectChanges();
    }

    public async setRaitingChart(usuario){
        this.data_raiting.datasets[0].data[0] = usuario.propostas_criadas_count;
        this.data_raiting.datasets[0].data[1] = usuario.propostas_recusadas_count;
        this.data_raiting.datasets[0].data[2] = usuario.propostas_aprovadas_count;

        const chart_raiting = new Chart(this.chart_raiting.nativeElement,{
            type: 'doughnut',
            data: this.data_raiting,
        });
        chart_raiting.update();
    }

    public insertImage(event){
		let data = new FormData();
		let file = event.target.files[0];
		if(!file){
			return;
		}
		let size = file.size / 1024 / 1024;

		if(size > 2){
			this.functions.printSnackBar("Arquivo maior que 2mb.");
			return;
		}
		data.append("midia",event.target.files[0]);
		this.subs.add(
			this._http.post(`usuario/profile/${this.usuario.id}`,data).subscribe((response:any)=>{
				this.usuario = response.usuario;
				this.saveStorage(response.usuario);
				this.cdr.detectChanges();
			},(erro:any)=>{
				this.functions.printMsgError(erro);
			})
		);
    }
    
    public saveStorage(usuario){
		localStorage.removeItem('usuario');
		localStorage.setItem('usuario', JSON.stringify(usuario));
    }

    public editUser(){
        let modal_config:MatDialogConfig = new MatDialogConfig();
        modal_config.panelClass = "modal-custom";
        this.usuario.is_perfil = this.is_perfil;
        modal_config.data = this.usuario;

        let dialogRef = this.dialog.open(ModalUsuario,modal_config);
        dialogRef.componentInstance.response.subscribe((resp:any) =>{
			this.dialog.closeAll();
			if(resp.success){
                this.functions.printSnackBar(resp.message);
                this.show();
				this.cdr.detectChanges();
			}else{
				this.functions.printSnackBar(resp.message);
			}
		});
    }
    
    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}