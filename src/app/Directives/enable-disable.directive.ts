import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[disableControl]',
    standalone:true
})
export class DisableControlDirective {
        @Input('appDisable') set disableControl( condition : boolean ) {
            const action = condition ? 'disable' : 'enable';
            setTimeout(()=>{
              this.ngControl.control[action]();
            });
       }
    constructor (private ngControl : NgControl){}
}