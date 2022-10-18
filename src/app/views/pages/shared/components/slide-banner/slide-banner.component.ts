import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { Usuario } from './../../../../../core/_base/crud/models/class/usuario.model';
import { HttpService } from './../../../../../core/_base/crud/services/http.service';
import { Banner } from './../../../../../core/_base/crud/models/class/banner.model';
declare var Swiper: any;

@Component({
    selector: 'kt-slide-banner',
    templateUrl : 'slide-banner.component.html',
    styleUrls : ['slide-banner.component.scss']
})
export class SlideBannerComponent implements OnInit {
    private usuario:Usuario;
    public list_banner:Banner[] = [];
    public images = [];
    public isLoading:boolean = false;
    constructor(
        private functions:FunctionsService,
        private _http:HttpService,
        private cdr:ChangeDetectorRef
    ){}
    ngOnInit(){
       this.isLoading = true;
        this.usuario = this.functions.getUsuario();
        if(this.usuario && this.usuario.id){
            let equipes = this.functions.array_column(this.usuario.equipes,"id");
            this._http.get("banner",{equipes_id : equipes.join(',')}).subscribe((response:any) =>{
                this.asyncBanner(response.banners);
               
                this.cdr.detectChanges();
            },(e) =>{
                this.isLoading = false;
                this.cdr.detectChanges();
            })
        }
    }

    // Funcao assincrona para chamar o swiper só quando a tiver inserido banners na lista
    public async asyncBanner(banners){
        await this.insertBanner(banners);
        await this.callSwipe();
    }

    public async insertBanner(banners){
        this.list_banner = banners;
    }

    public async callSwipe(){
        var mySwiper = new Swiper ('.swiper-container', {
            slidesPerView: 3,
            // spaceBetween: 10,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
              },
            pagination: {
                el: '.swiper-pagination',
                dynamicBullets: true,
                clickable: true,
            },
        })
    }
}