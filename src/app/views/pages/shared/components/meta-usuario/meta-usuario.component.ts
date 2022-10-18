import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';

@Component({
    selector: 'kt-meta-usuario',
    templateUrl : 'meta-usuario.component.html',
    styleUrls : ['meta-usuario.component.scss']
})
export class MetaUsuarioComponent implements OnInit{
    public usuario:Usuario;
    public meta:any;
    public isLoading:boolean = false;
    constructor(
        private functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.isLoading = true;
        this.usuario = this.functions.getUsuario();
        this._http.get("meta-usuario",{usuario_id:this.usuario.id}).subscribe((response:any) =>{
            this.isLoading = false;
            this.meta = response.metas[0];
            this.cdr.detectChanges();
        },(erro:any) => {
            this.isLoading = false;
            this.cdr.detectChanges();
        })
    }
}