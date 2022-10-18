import { NgControl } from '@angular/forms';
import { Input, Directive } from '@angular/core';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]({ emitEvent: false }); // O EMITEVENT É PARA QUANDO O CAMPO FOR ATIVO ELE NÃO EXECUTAR O VALUECHANGES
  }

  constructor( private ngControl : NgControl ) {
  }

}
