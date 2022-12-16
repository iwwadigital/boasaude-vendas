import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';

@Component({
  selector: 'kt-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.scss']
})
export class ModalConfirmacaoComponent implements OnInit {
    @Output() response = new EventEmitter();
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<ModalConfirmacaoComponent>
    ){}

    ngOnInit(): void {
        
    }

    onNoClick(){
		this.dialogRef.close();
	}
	setResponse(response){
		this.response.emit(response);
	}
}