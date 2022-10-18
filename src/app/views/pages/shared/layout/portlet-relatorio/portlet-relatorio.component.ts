import { Component, Input } from "@angular/core";

@Component({
    selector: 'kt-portlet-relatorio',
    templateUrl:'./portlet-relatorio.component.html',
    styleUrls: ['./portlet-relatorio.component.scss']
})
export class PortletRelatorioComponent{
    @Input() asset_icon:string;
    @Input() title_text:string;
    @Input() sub_title_text:string;
}