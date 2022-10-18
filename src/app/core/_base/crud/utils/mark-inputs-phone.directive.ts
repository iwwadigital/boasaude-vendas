import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[mMarkInputsPhone]',
  providers: [{
	provide:  NG_VALUE_ACCESSOR,
	useExisting: MarkInputsPhoneDirective,
	multi:true
	}]
})
export class MarkInputsPhoneDirective {
	onTouched:any;
	onChange:any;
	private without_prefix:string = "(99) 9999-9999";
  private with_prefix:string = "(99) 99999-9999";
  private mask_actual:string = "";
	constructor(private el: ElementRef) {}

  writeValue(value: any): void {
    if (value) {
      this.el.nativeElement.value = this.aplicarMascara(value);
    }else{
      this.el.nativeElement.value = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    let valor = $event.target.value.replace(/\D/g, '');

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      // return;
    }
    let pad;
    if(!this.mask_actual && this.mask_actual != '' && this.mask_actual != undefined){
      pad = this.with_prefix.replace(/\D/g, '').replace(/9/g, '_');
    }else{
      pad = this.mask_actual.replace(/\D/g, '').replace(/9/g, '_');
    }

    if (valor.length <= pad.length) {
      this.onChange(valor);
    }

    $event.target.value = this.aplicarMascara(valor);
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    if ($event.target.value.length === this.mask_actual.length) {
      return;
    }
    this.onChange('');
    $event.target.value = '';
  }

  aplicarMascara(valor: string): string {
    valor = valor.replace(/\D/g, '');
    if(valor.length > 10){
      this.mask_actual = this.with_prefix;
    }else{
      this.mask_actual = this.without_prefix;
    }
    let pad = this.mask_actual.replace(/\D/g, '').replace(/9/g, '_');
    let valorMask = valor + pad.substring(0, pad.length - valor.length);
    let valorMaskPos = 0;
    valor = '';
    for (let i = 0; i < this.mask_actual.length; i++) {
      if (isNaN(parseInt(this.mask_actual.charAt(i)))) {
        valor += this.mask_actual.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }

    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }
    return valor;
  }

}
