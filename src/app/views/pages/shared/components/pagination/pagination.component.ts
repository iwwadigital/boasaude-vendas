import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'kt-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements AfterViewInit{
    public pagination_number:any[] = [];
    public pagination_config:any;
    public search:any;
    @Input() set setPagination_config(value){
        if(value !== undefined && value !== null){
            this.setPagination(value.pagination);
            this.pagination_config = value.pagination;
            this.search = value.search;
        }
    };
    
    public prev:any = 0;
    public next:any = 0;
    public current:number = 0;
    public path:string;

    constructor(
        private cdr:ChangeDetectorRef,
        private route:ActivatedRoute,
        private router:Router
    ){
        this.path = `/${this.route.routeConfig.path}`;
    }
    ngAfterViewInit(){}

    public setPagination(pagination){
        this.pagination_number = [];
		this.pagination_number.push(parseInt(pagination.current_page));
		for(let i = 1 ; i <= 2;i++ ){
			if(parseInt(pagination.current_page)-i > 0){
				this.pagination_number.push(parseInt(pagination.current_page)-i);
			}
			if(parseInt(pagination.current_page) + i <= pagination.last_page){
				this.pagination_number.push(parseInt(pagination.current_page) + i);
			}
        }
        this.pagination_number.sort(this.page);
        this.current = parseInt(pagination.current_page);
        this.prev = parseInt(pagination.current_page)-1;
        this.next = parseInt(pagination.current_page)+1;
        this.cdr.detectChanges();
    }


    public routerChange(page){
        this.search.page = page;
       this.router.navigate([this.path],{ queryParams:  this.search});
    }
    page(a,b){
        if(a > b){
            return 1;
        }
        if(a < b){
            return -1;
        }
        return 0;
    }
}