import {Component,OnDestroy} from "@angular/core";
import {FormGroup,FormControl,NG_VALUE_ACCESSOR,FormBuilder, ControlValueAccessor} from "@angular/forms";
import { Subscription } from "rxjs";
import { Filial } from "./../../../../../../core/_base/crud/models/class/filial.model";

@Component({
    selector: "m-form-regra-negocio",
    templateUrl : "./form-regra-negocio.component.html",
    styleUrls: ["./form-regra-negocio.component.scss"],
    providers : [{
        provide : NG_VALUE_ACCESSOR,
        multi: true,
        useExisting : FormRegraNegocioComponent
    }]
})
export class FormRegraNegocioComponent implements ControlValueAccessor, OnDestroy {
    private subs:Subscription = new Subscription();
    public form:FormGroup;
    disabled: boolean = false;
    touched: boolean = false; 
    onChangeSubs: Subscription[] = [];

    onChange(t?:any){}
    onTouched = () => {};   
    constructor(
        private fb:FormBuilder
    ){}
    writeValue(obj: any): void {
       this.form = this.fb.group(new Filial(obj).getRegraNegocio());
    }

    registerOnChange(fn: any): void {
        const sub = this.form.valueChanges.subscribe(fn);
        this.onChangeSubs.push(sub);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }


    setDisabledState(isDisabled: boolean){
        isDisabled ? this.form.disable() : this.form.enable();
    }
    
    ngOnDestroy(): void {
        this.subs.unsubscribe();
        for (let sub of this.onChangeSubs) {
            sub.unsubscribe();
        }
    }
}