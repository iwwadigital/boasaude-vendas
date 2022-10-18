import { AbstractControl } from '@angular/forms';
import { FunctionsService } from './functions.service';


export function validateCpf(control: AbstractControl){
    let functions:FunctionsService = new FunctionsService(null,null);
    if(!functions.isEmpty(control.value) && control.value.length == 11 && !functions.validarCPF(control.value)){
        return {validCpf : true};
    }
    return null;
}


export function validateCnpj(control: AbstractControl){
    let functions:FunctionsService = new FunctionsService(null,null);
    if(!functions.isEmpty(control.value) && control.value.length == 14 && !functions.validarCNPJ(control.value)){
        return {validCnpj : true};
    }
    return null;
}

export function validateAutocomplete(control: AbstractControl){
    let functions:FunctionsService = new FunctionsService(null,null);
    if(!functions.isEmpty(control.value) && typeof control.value !== "object"){
        return {validObject : true};
    }
    return null;
}