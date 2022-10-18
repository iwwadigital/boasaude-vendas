import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Equipe } from './../../../../../core/_base/crud/models/class/equipe.model';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
import { FunctionsService } from "./../../../../../core/_base/crud/utils/functions.service";
import { Subscription } from "rxjs";
  
@Component({
    selector: 'kt-progress-equipes',
	templateUrl : './progress-equipes.component.html',
    styleUrls : ['./progress-equipes.component.scss'],
    animations: [
		trigger('hide',[
		transition(':enter', [
			style({
					'height': '0',
					overflow:'hidden',
				}),  // initial
			animate('350ms',
				style({
					'height': '*'
				}))  // final
			]),
			transition(':leave', [
			style({
				'height': '*',
				overflow:'hidden'
			}),  // initial
			animate('350ms',
				style({
					'height': '0',
					overflow:'hidden'
				}))  // final
			]),
		]),
	]
})
export class ProgressEquipeComponent implements OnInit,OnDestroy{
    public equipes:Equipe[]= [];
    private subs:Subscription = new Subscription();
    public pagination:any= {};
    public limit:number = 25;
    public is_down:boolean = false;
    public is_loading:boolean = false;
    constructor(
        private _http:HttpService,
        private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
        this.get({
            filial: localStorage.getItem("filial")
        });
        this.subs.add(
            this.functions.$filial.subscribe((value) =>{
                if(typeof value == "string"){
                    this.get({
                        filial:value
                    });
                }
            })
        );
    }

    public get(params:any = {}){
        this.is_loading = true;
        this.equipes = [];
        this.cdr.detectChanges();
        params.limit = this.limit;
        params.percent = 1;
        params.has_meta = 1;
        this.subs.add(
            this._http.get("equipe",params).subscribe((response:any)=>{
                this.equipes = response.equipes;
                this.pagination = response.pagination;
                this.is_loading = false;
                this.cdr.detectChanges();
            },(erro:any)=>{
                this.is_loading = false;
                
                this.cdr.detectChanges();
            })
        );
    }

    public changeSlide(){
        this.is_down = !this.is_down;
    }

    public click_pagination(type){
        let page:number;
        if(type == "prev"){
            page = parseInt(this.pagination.current_page) - 1;
        }else{
            page = parseInt(this.pagination.current_page) + 1;
        }
        this.get({page : page})
    }

    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}
