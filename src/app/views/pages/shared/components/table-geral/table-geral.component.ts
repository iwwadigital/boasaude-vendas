import { TableGeral } from './../../../../../core/_base/crud/models/layout/table-geral.model';
import { Component,OnInit, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from "@angular/core";
import { PageEvent, MatTableDataSource } from '@angular/material';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import {
	trigger,
	state,
	style,
	animate,
	transition,
  } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'kt-table-geral',
	templateUrl : './table-geral.component.html',
	styleUrls : ['./table-geral.component.scss'],
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
export class TableGeralComponent implements OnInit , OnDestroy{
	private subs:Subscription = new Subscription();
	public typeSearch:any = {};
	//Config view
	public tables_config:TableGeral;
	public action:string[] = ["view","edit","delete"];
	public isLoading:boolean = false;
	//Table
	public data_table:any [] = [];
	public data_table_datasource:MatTableDataSource<any>;
	public is_filter:boolean = false;
	//Paginacao
	public page:number = 0;
	public total:number = 0;
	public currentPage:number = 0;
	public pagination_config:any = {};
	public path:string;

	public form_order : FormGroup = new FormGroup({
		filter : new FormControl(null)
	})
	@Input() set setTables_config (value){
		if(value !== undefined){
			this.tables_config = value;
			if(!this.functions.isEmpty(this.tables_config.page)){
				for(let key in this.tables_config.page){
					this.typeSearch[key] = this.tables_config.page[key];
				}
			}
			if(value.has_search_filial){
				this.typeSearch.filial = localStorage.getItem("filial");
			}
			if(value.has_search_filial_id){
				this.typeSearch.filial_id = JSON.parse(localStorage.getItem("filialObj")).id;
			}
			this.pagination();
		}
	};
	@Input() set setRefresh(value){
		if(!this.functions.isEmpty(value) && value){
			this.pagination();
		}
	}

	@Input() set setSearch(value){
		if(!this.functions.isEmpty(value) && !this.functions.isEmptyObj(value)){
			for(let key in value){
				this.typeSearch[key] = value[key];
			};
			this.pagination();
		}
	}

	@Output() getRefresh = new EventEmitter;
	constructor(
		private _http:HttpService,
		private route:ActivatedRoute,
		private router:Router,
		private functions:FunctionsService,
		private cdr:ChangeDetectorRef
	){
		this.path = this.route.routeConfig.path;
	}
	ngOnInit() {
		this.subs.add(
			this.form_order.get("filter").valueChanges.subscribe((filtro:any)=>{
				this.typeSearch = {
					order : filtro
				}
				this.pagination();
			})
		);
	}

	public pagination(){
		this.subs.add(
			this.route.queryParams.subscribe((params:any)=>{
				if(!this.functions.isEmpty(params.page)){
					// if(!this.functions.isEmptyObj(this.typeSearch)){
					// 	let p: any = {};
					// 	for(let key in this.typeSearch){
					// 		if(!this.functions.isEmpty(this.typeSearch[key])){
					// 			p[key] = this.typeSearch[key];
					// 		}
					// 	}
					// 	params = p;
					// }
					this.currentPage = params.page -1;
					this.typeSearch.page = params.page;
					this.get(this.typeSearch);
					this.sendRefresh();
				}else{
					this.currentPage = 0;
					this.get(this.typeSearch);
				}
			})
		);
	}

	public get(params?:any){
		this.getRefresh.emit(true);
		this.isLoading = true;
		this.data_table = undefined;
		this.cdr.detectChanges();
		this.subs.add(
			this._http.get(this.tables_config.table_api,params).subscribe((response) =>{
				this.data_table_datasource = new MatTableDataSource(response[this.tables_config.return_api]) // Para funcionar a listagem por limit
				this.data_table = response[this.tables_config.return_api];
				if(this.tables_config.is_pagination){
					this.setPagination(response.pagination);
				}
				this.isLoading = false;
				this.cdr.detectChanges();
			},(erro:any) =>{
				this.data_table = undefined;
				this.isLoading = false;
				this.cdr.detectChanges();
			})
		);
	}

	public is_action(val){
		for(let i =0; i < this.action.length; i ++){
			if(this.action[i] === val){
				return true;
			}
		}
		return false;
	}

	public setPagination(pagination){
		this.page = pagination.per_page;
		this.total = pagination.total;
		this.pagination_config  = {
			pagination: pagination,
			search : this.typeSearch
		} ;
		this.cdr.detectChanges();
		// this.currentPage = pagination.page - 1;
	}

	public getPaginatorData(event:PageEvent){
		this.typeSearch.limit = event.pageSize;
		this.currentPage = event.pageIndex;
		this.typeSearch.page = event.pageIndex+1;
		this.router.navigate([`/${this.path}`], {queryParams: this.typeSearch});
	}

	public sendRefresh(){
		this.getRefresh.emit(true);
	}

	
	public toggleMobile(element:any){
		element.is_mobile_dropdown = !element.is_mobile_dropdown;
		this.cdr.detectChanges();
	}
	public toggleMoreMobile(){
		this.is_filter  = !this.is_filter;
		this.cdr.detectChanges();
	}

	public filter(filter){
		this.typeSearch.order = filter;
		this.is_filter = false;
		this.pagination();
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
