import {ElementRef} from '@angular/core';

export class DomHelper {

    public static matches(element: any, selectorName: string): boolean {

        let proto: any = Element.prototype;

        let func =
            proto['matches'] ||
            proto.matchesSelector ||
            proto.mozMatchesSelector ||
            proto.msMatchesSelector ||
            proto.oMatchesSelector ||
            proto.webkitMatchesSelector ||
            function (s) {
                let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {
                }
                return i > -1;
            };

        return func.call(element, selectorName);
    }

    
    public static addClass(elementRef: ElementRef | any, className: string) {

        let e = this.getElementWithValidClassList(elementRef);

        if (e) {
            e.classList.add(className);
        }
    }

   
    public static removeClass(elementRef: ElementRef | any, className: string) {

        const e = this.getElementWithValidClassList(elementRef);

        if (e) {
            e.classList.remove(className);
        }
    }

   
    private static getElementWithValidClassList(elementRef: ElementRef) {

        let e = elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;

        if (e.classList !== undefined && e.classList !== null) {
            return e;
        }

        return null;
    }
}
