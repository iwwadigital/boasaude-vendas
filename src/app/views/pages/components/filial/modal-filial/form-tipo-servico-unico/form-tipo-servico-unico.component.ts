import { ChangeDetectorRef, Component,Input,OnDestroy} from '@angular/core';
import {FormGroup,FormControl,NG_VALUE_ACCESSOR,FormBuilder, ControlValueAccessor} from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { TipoServico } from '../../../../../../core/_base/crud/models/class/tipo_servico.model';
import { HttpService } from '../../../../../../core/_base/crud/services/http.service';
import { FunctionsService } from '../../../../../../core/_base/crud/utils/functions.service';

@Component({
    selector: 'm-tipo-servico-unico',
    templateUrl: './form-tipo-servico-unico.component.html',
    styleUrls: ['./form-tipo-servico-unico.component.scss'],
    providers : [{
        provide : NG_VALUE_ACCESSOR,
        multi: true,
        useExisting : FormTipoServicoUnico
    }]
})
export class FormTipoServicoUnico implements ControlValueAccessor, OnDestroy {
    private subs:Subscription = new Subscription();
    @Input() labelTitle:string;
    public form:FormGroup;
    public tipos_servico:TipoServico[] = [];
    onChangeSubs: Subscription[] = [];
    touched: boolean = false;
    disabled: boolean = false;

    constructor(
        private _http:HttpService,
        private fb : FormBuilder,
        private functions:FunctionsService,
        private cdr:ChangeDetectorRef
    ){}

    onChange(t?:any){}
    onTouched = () => {};

    writeValue(obj: any): void {
        this.form = this.fb.group({
            tipo_servico_universitario: new FormControl(obj)
        })
        this.handleForm();
        this.getTiposServico();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    private handleForm(){
        this.subs.add(
			this.form.get("tipo_servico_universitario").valueChanges.pipe(
				debounceTime(500),
				switchMap(value =>{
					if(value !== null && typeof value !== 'object'){
						this.getTiposServico({q:value});
					}
                    this.onChange(value);
					return of(null);
				})
			).subscribe()
		);
    }

    public getTiposServico(parameter?:any){
        this.subs.add(
            this._http.get("tipo-servico",parameter).pipe(
                catchError((err,caught)=>{
                    this.functions.printSnackBar(`Nenhum tipo de servico encontrado.`);
                    return of(err);
                })
            ).subscribe((response:any)=>{
                this.tipos_servico = response.tipos_servico;
                this.cdr.detectChanges();
            })
        );
	}

    setDisabledState(isDisabled: boolean){
        isDisabled ? this.form.disable() : this.form.enable();
    }

    public displayFn(value:any): string{
        return value ?  `${value.cidade} - ${value.nome}` : "";
    }

    public ngOnDestroy():void{
        this.subs.unsubscribe();
    }
}