import { ChangeDetectorRef, Component, OnDestroy} from "@angular/core";
import { ControlValueAccessor, FormGroup,FormControl, NG_VALUE_ACCESSOR, FormBuilder } from "@angular/forms";
import { of, Subscription } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { Filial } from "./../../../../../../core/_base/crud/models/class/filial.model";
import { HttpService } from "./../../../../../../core/_base/crud/services/http.service";
import { FunctionsService } from "./../../../../../../core/_base/crud/utils/functions.service";

@Component({
    selector : "m-form-endereco",
    templateUrl: './form-endereco.component.html',
    styleUrls: ["./form-endereco.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting : FormEnderecoComponent
        }
    ]
})
export class FormEnderecoComponent implements ControlValueAccessor,OnDestroy {
    private subs:Subscription = new Subscription();
    public form:FormGroup;
    public isLoading:Boolean = false;
    disabled: boolean = false;
    touched: boolean = false; 
    onChangeSubs: Subscription[] = [];

    onChange(t?:any){}
    onTouched = () => {};    
    constructor(
        private fb:FormBuilder,
        private _http:HttpService,
        private cdr:ChangeDetectorRef,
        private functions:FunctionsService
    ){}

    private getCep(value){
        this._http.get(`search-cep/${value}`).subscribe((response:any) =>{
            if(response.bairro || response.localidade || response.logradouro){
                this.form.patchValue({
                    bairro : response.bairro,
                    cidade : response.localidade,
                    rua : response.logradouro,
                    estado : this.functions.getEstado(response.uf)
                });
            }
            this.isLoading = false;
            this.cdr.detectChanges();
        },(erro:any) =>{
            this.functions.printMsgError(erro);
            this.isLoading = false;
            this.cdr.detectChanges();
        })
    }

    writeValue(obj: any){
        this.form = this.fb.group(new Filial(obj).getEndereco());
        this.subs.add(
            this.form.get("cep").valueChanges.pipe(
				debounceTime(250),
				switchMap((value:string) =>{
					if(!this.functions.isEmpty(value) && typeof value === 'string' && value.length === 8){
						this.isLoading = true;
						this.cdr.detectChanges();
						this.getCep(value);
					}
					return of(value);
				})
			).subscribe()
        );
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