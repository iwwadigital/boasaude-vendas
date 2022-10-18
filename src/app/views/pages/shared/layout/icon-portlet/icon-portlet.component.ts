import { Component, Input } from "@angular/core";

@Component({
    selector : 'kt-icon-portlet',
    templateUrl: './icon-portlet.component.html',
    styleUrls : ['./icon-portlet.component.scss']
})
export class IconPortletComponent{
    @Input() asset_icon:string;
}