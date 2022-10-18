import { OnInit, Component, Input, Inject, ChangeDetectorRef, Output,EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector : 'kt-modal-log-history',
    styleUrls : ['./modal-log-history.component.scss'],
    templateUrl : './modal-log-history.component.html'
})
export class ModalLogHistoryComponent implements OnInit{
    public displayedColumns:string[] = [
        "log",
        // "data_horario",
        "usuario",
    ];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialogRef: MatDialogRef<ModalLogHistoryComponent>,
    ){}
    ngOnInit(){}

	onNoClick(){
		this.dialogRef.close(true);
	}
}