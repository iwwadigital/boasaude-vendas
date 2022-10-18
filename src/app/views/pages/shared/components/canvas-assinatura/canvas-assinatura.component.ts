import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit, Output, EventEmitter } from "@angular/core";
import { FunctionsService } from './../../../../../core/_base/crud/utils/functions.service';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
    selector: 'kt-canvas-assinatura',
	templateUrl: './canvas-assinatura.component.html',
	styleUrls: ['./canvas-assinatura.component.scss']
})
export class CanvasAssinaturaComponent  implements OnInit,AfterViewInit{
    // a reference to the canvas element from our template
	@ViewChild('canvas',{static: false}) public canvas: ElementRef;

	// setting a width and height for the canvas
	@Input() public width = 900;
	@Input() public height = 300;
	@Input() public set setProposta_id(id){
		if(!this.functions.isEmpty(id)){
			this.proposta_id = id;
		}
    }
    @Input() public set getImageCanvas(value){
        if(value == true){
            let image=  this.getImage();
            this.sendImage.emit(image);
        }
    }

    @Output() sendImage = new  EventEmitter();

	public proposta_id:number;
	private cx: CanvasRenderingContext2D;
	
	
	public padding = 50;

	constructor(
		private functions:FunctionsService
	){}
	ngOnInit(){}
	ngAfterViewInit(){
	// get the context
		const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
		this.cx = canvasEl.getContext('2d');

		// set the width and height
		canvasEl.width = this.width;
		canvasEl.height = this.height;
		// if(window.screen.availWidth < 938){
		if(window.screen.availWidth < 1024){
			if(window.screen.availWidth < 575){
				this.padding = 20;
			}
			var content_canvas = document.getElementById("content-canvas");
			canvasEl.width = content_canvas.offsetWidth;
			canvasEl.height =content_canvas.offsetHeight - this.padding;
		}
		// set some default properties about the line
		this.cx.lineWidth = 3;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#000';

		// we'll implement this method to start capturing mouse events
		this.captureEvents(canvasEl);
		this.handleWithScroll(canvasEl);
	}


	private handleWithScroll(canvas){
		// Prevent scrolling when touching the canvas
		document.body.addEventListener("touchstart", function (e) {
			if (e.target == canvas) {
				e.preventDefault();
			}
		}, false);
		document.body.addEventListener("touchend", function (e) {
			if (e.target == canvas) {
				e.preventDefault();
			}
		}, false);
		document.body.addEventListener("touchmove", function (e) {
			if (e.target == canvas) {
				e.preventDefault();
			}
		}, false);
	}

    public getImage(){
		let c:any = document.getElementById("MySing");
		let img = c.toDataURL("image/png");
		let file = this.dataURLtoFile(img,`sing-${this.proposta_id}.png`);
		return file;
	}

	public dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type:mime});
    }
	private resetCanvas(){
		this.cx.clearRect(0, 0, this.width, this.height);
	}
	private captureEvents(canvasEl: HTMLCanvasElement) {
		fromEvent(canvasEl, 'mousedown')
		.pipe(
			switchMap((e) => {
			return fromEvent(canvasEl, 'mousemove')
				.pipe(
					takeUntil(fromEvent(canvasEl, 'mouseup')),
					takeUntil(fromEvent(canvasEl, 'mouseleave')),
					pairwise()
				)
			})
		)
		.subscribe((res: [MouseEvent, MouseEvent]) => {
			const rect = canvasEl.getBoundingClientRect();
			const prevPos = {
				x: res[0].clientX - rect.left,
				y: res[0].clientY - rect.top
			};
			const currentPos = {
				x: res[1].clientX - rect.left,
				y: res[1].clientY - rect.top
			};
			this.drawOnCanvas(prevPos, currentPos);
		});

		//TOUCH
		fromEvent(canvasEl, 'touchstart')
		.pipe(
			switchMap((e) => {
				return fromEvent(canvasEl, 'touchmove')
					.pipe(
						takeUntil(fromEvent(canvasEl, 'touchend')),
						takeUntil(fromEvent(canvasEl, 'touchleave')),
						pairwise()
					)
				})
		).subscribe((res: [TouchEvent, TouchEvent]) => {
			const rect = canvasEl.getBoundingClientRect();
			const prevPos = {
				x: res[0].touches[0].clientX - rect.left,
				y: res[0].touches[0].clientY - rect.top
			};
			const currentPos = {
				x: res[1].touches[0].clientX - rect.left,
				y: res[1].touches[0].clientY - rect.top
			};
			this.drawOnCanvas(prevPos, currentPos);
		});
	}
	private drawOnCanvas(
		prevPos: { x: number, y: number },
		currentPos: { x: number, y: number }
		) {
		// incase the context is not set
		if (!this.cx) { return; }

		// start our drawing path
		this.cx.beginPath();

		// we're drawing lines so we need a previous position
		if (prevPos) {
			// sets the start point
			this.cx.moveTo(prevPos.x, prevPos.y); // from

			// draws a line from the start pos until the current position
			this.cx.lineTo(currentPos.x, currentPos.y);

			// strokes the current path with the styles we set earlier
			this.cx.stroke();
		}
	}
}