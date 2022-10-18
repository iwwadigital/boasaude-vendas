import {ChangeDetectorRef, Component,Input,OnDestroy} from "@angular/core";
import {FormGroup,FormControl,NG_VALUE_ACCESSOR,FormBuilder, ControlValueAccessor, FormArray} from "@angular/forms";
import { of, Subscription } from "rxjs";
import { catchError, debounceTime, switchMap } from "rxjs/operators";
import { TipoServico } from "../../../../../../core/_base/crud/models/class/tipo_servico.model";
import { HttpService } from "../../../../../../core/_base/crud/services/http.service";
import { FunctionsService } from "../../../../../../core/_base/crud/utils/functions.service";
import { Filial } from "../../../../../../core/_base/crud/models/class/filial.model";

@Component({
    selector: "m-form-tipo-servico-multiplo",
    templateUrl : "./form-tipo-servico-multiplo.component.html",
    styleUrls: ["./form-tipo-servico-multiplo.component.scss"],
    providers : [{
        provide : NG_VALUE_ACCESSOR,
        multi: true,
        useExisting : FormTipoServicoMultiploComponent
    }]
})
export class FormTipoServicoMultiploComponent implements ControlValueAccessor, OnDestroy {
    private subs:Subscription = new Subscription();
    public tipos_servico:TipoServico[] = [];
    private firstCreation:boolean = false;
    @Input() labelTitle:string;
    @Input() labelBtn:string;
    items:FormArray
    form:FormGroup;
    disabled: boolean = false;
    touched: boolean = false; 

    constructor(
        private fb:FormBuilder,
        private functions:FunctionsService,
        private cdr:ChangeDetectorRef,
        private _http:HttpService,
    ){}
    onChange(t?:any){}
    onTouched = () => {};

    public addItem(item?:any){
        this.items.push(this.fb.group({item: item}));
        let index = this.items.length - 1;
        let control = this.items.controls[index];
        this.subs.add(
			control.get("item").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						this.getTiposServico({q:value});
					}
                    if(value !== null && typeof value == 'object'){
                        this.onChange(this.returnStringItem());
                    }
					return of(null);
				})
			).subscribe()
		);
    }

    public removeItem(i){
        this.items.removeAt(i);
    }
    
    writeValue(obj: any): void {
        this.form = this.fb.group({
            items : new FormArray([]),
            tipos_servico_universitario : new FormControl(null),
            strReturn : new FormControl(null)
        });
        this.getTiposServico();
        this.items = this.form.get("items") as FormArray;
        if(obj != null && obj.length > 0){  
            obj.map(el => {
                this.addItem(el);
            });
            this.firstCreation = true;
        }else{
            this.addItem(obj);
        }
    }

    public displayFn(value:any): string{
        return value ?  `${value.cidade} - ${value.nome}` : "";
    }

    public getTiposServico(parameter?:any){
		this._http.get("tipo-servico",parameter).pipe(
			catchError((err,caught)=>{
				this.functions.printSnackBar(`Nenhum tipo de servico encontrado.`);
				return of(err);
			})
		).subscribe((response:any)=>{
			this.tipos_servico = response.tipos_servico;
			this.cdr.detectChanges();
		})
	}

    public returnStringItem(){
        let value = this.items.value.filter(el => el != null && el != "").map(el => el.item.id).join(",");
        return value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
        if(this.firstCreation){
            this.onChange(this.returnStringItem())
        }
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        isDisabled ? this.form.disable() : this.form.enable();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}