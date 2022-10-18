import { Component, Input } from "@angular/core";

@Component({
    selector: 'kt-progress-bar',
	templateUrl : './progress-bar.component.html',
	styleUrls : ['./progress-bar.component.scss'],
})
export class ProgressBarComponent{
    public percent:number = 0;
    @Input() is_percent:boolean = true;
    @Input() set  setPercent(value){
        this.percent = value;
    }

    
}