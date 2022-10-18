export class BtnConfig{
	public title : string;
	public is_icon : boolean;
	public icon : string;
	public has_class : boolean;
	public class : string;
	public is_disabled:boolean = false;
	public constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}
