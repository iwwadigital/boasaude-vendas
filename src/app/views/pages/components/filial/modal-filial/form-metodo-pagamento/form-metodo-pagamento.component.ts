import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { FormGroup, FormControl,FormBuilder, NG_VALUE_ACCESSOR,ControlValueAccessor} from "@angular/forms";
import { Subscription } from "rxjs";
import { HttpService } from "./../../../../../../core/_base/crud/services/http.service";
import { Filial } from "./../../../../../../core/_base/crud/models/class/filial.model";

@Component({
    selector: 'm-form-metodo-pagamento',
    templateUrl: "./form-metodo-pagamento.component.html",
    styleUrls : ["./form-metodo-pagamento.component.scss"],
    providers : [{
        provide : NG_VALUE_ACCESSOR,
        multi: true,
        useExisting : FormMetodoPagamento
    }]
})
export class FormMetodoPagamento implements ControlValueAccessor,OnDestroy{
    private subs:Subscription = new Subscription();
    public pagamentos:any = [];
    public form:FormGroup;
    disabled: boolean = false;
    touched: boolean = false; 
    onChangeSubs: Subscription[] = [];

    onChange(t?:any){}
    onTouched = () => {};   
    constructor(
        private _http:HttpService,
        private cdr:ChangeDetectorRef,
        private fb:FormBuilder
    ){}
    public getPagamentos(){
        this.subs.add(
            this._http.get("pagamento-tipo",{withFilial: 1}).subscribe((resp:any) => {
                this.pagamentos = resp.pagamentos_tipos;
                this.cdr.detectChanges();
            })
        );
    }

    writeValue(obj: any): void {
       this.form = this.fb.group(new Filial(obj).getPagamento());
       this.getPagamentos();
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