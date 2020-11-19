import {
    Input,
    NgZone,
    Output,
    OnChanges,
    HostListener,
    ElementRef,
    Directive,
    EventEmitter,
    OnInit,
    Type,
    ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
declare var CKEDITOR: any;

@Directive({
    selector: '[contenteditableModel]',
})
export class ContenteditableModel implements OnChanges {
    @Input('contenteditableModel') model: any;
    @Output('contenteditableModelChange') change = new EventEmitter();
    // @Output() limetValue: EventEmitter<any> = new EventEmitter<any>();
    @Output() blur = new EventEmitter();
    @Output() focus = new EventEmitter();
    @Input() debounce: string;
    changeBySelf = false;
    instance: any;
    cursor: any;
    splitIndex;
    debounceTimeout: any;
    lastRange: any;
    editableEle: any;
    priousV: string;
    private lastViewModel: any;
    constructor(private elRef: ElementRef, public zone: NgZone) {}

    ngOnInit() {
        this.instance = CKEDITOR.replace(this.elRef.nativeElement, {
            startupFocus: false,
            toolbar: 'Basic',
            height: 'auto',
            // height: '440px',
            allowedContent: true,
            toolbar_Basic: [
                [
                    'Font',
                    'FontSize',
                    'Bold',
                    'Underline',
                    'Italic',
                    'JustifyLeft',
                    'JustifyCenter',
                    'JustifyRight',
                    'TextColor',
                    'BGColor',
                ],
            ],
        });
        this.instance.setData(this.model);

        // CKEditor blur event
        this.instance.on('blur', (evt: any) => {
            this.blur.emit(evt);
        });

        // CKEditor focus event
        this.instance.on('focus', (evt: any) => {
            this.focus.emit(evt);
        });

        this.instance.on('change', (evt: any) => {
            let value = this.instance.getData();
            if (this.model !== value) {
                // Debounce update
                if (this.debounce) {
                    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                    this.debounceTimeout = setTimeout(() => {

                        // const description = value.replace(/<.*?>/ig,"");
                        // console.log(value,description);
                        //
                        // if(description.length>10) {
                        //     console.log('超出限制...');
                        //     console.log(this.priousV,'-this.priousV-');
                        //     this.updateValue(this.priousV);
                        //     return;
                        // }else{
                        //     this.updateValue(this.instance.getData());
                        //     this.priousV = value;
                        // }
                        this.updateValue(this.instance.getData());
                        this.debounceTimeout = null;
                    }, parseInt(this.debounce));
                } else {
                    this.updateValue(value);
                }
            }
        });
    }

    doFocus() {
        setTimeout(() => {
            this.instance.focus();
        }, 0);
    }

    insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }

    ngOnChanges(changes) {
        if (changes['model']['currentValue'] != changes['model']['previousValue']) {
            this.lastViewModel = this.model;
            // console.log(changes['model']['currentValue']);
            // if(changes['model']['currentValue'].length>=10) {
            //     console.log('超出限制');
            //     this.limetValue.emit(changes['model']['currentValue'].substring(0, 10));
            // }
            if (this.changeBySelf) {
                this.changeBySelf = false;
            } else {
                this.refreshView();
            }
        }
    }

    onKeyup() {
        var value = this.elRef.nativeElement.innerHTML;
        this.lastViewModel = value;
        this.change.emit(value);
    }

    updateValue(value: any) {
        this.zone.run(() => {
            this.lastViewModel = value;
            this.changeBySelf = true;
            this.change.emit(value);
        });
    }

    private refreshView() {
        if (this.instance) this.instance.setData(this.lastViewModel);
        // this.elRef.nativeElement.innerHTML = this.lastViewModel
    }

    /**
     * On component destroy
     */
    ngOnDestroy() {
        if (this.instance) {
            setTimeout(() => {
                this.instance.removeAllListeners();
                let dom = document.querySelector('#cke_' + this.instance.name);
                if (dom) {
                    dom.parentNode.removeChild(dom);
                }
                CKEDITOR.instances[this.instance.name].destroy(true);
                this.instance.destroy(true);
                this.instance = null;
            });
        }
    }

    repeatStr(str, count) {
        var ret = '';
        for (var i = 0; i < count; i++) {
            ret += str;
        }
        return ret;
    }

    checkAllIsUndline(input) {
        let ret = true;
        for (var i = 0; i < input.length; i++) {
            if (input[i] != '_') {
                ret = false;
            }
        }
        return ret;
    }

    getTextNode(parent) {
        var childNodes = parent.childNodes;
        var childLen = childNodes.length;
        if (childLen > 0) {
            var child = childNodes[0];
            if (child.childNodes.length > 0) {
                return child.childNodes[0];
            } else return child;
        }
        return parent;
    }

    prepareReplace() {
        // 设置最后光标对象
        //console.log(lastRange)
        var startOffset = this.lastRange.startOffset;
        var startText = this.lastRange.startContainer.data;
        var parentTagName = this.lastRange.startContainer.parentNode.nodeName;
        var isBlank =
            this.lastRange.startContainer.parentNode.className.indexOf('mod_fillblank') >= 0;
        //console.log("startText:"+startText)
        if (parentTagName == 'P' || (isBlank && parentTagName == 'SPAN')) {
            if (this.checkAllIsUndline(startText)) {
                this.cursor = startOffset;
            } else if (startText.substr(-1, 1) == '_') {
                //最后一个是_
                var flagCount = 0;
                for (var i = 0; i < startOffset; i++) {
                    if (startText[i] == '_') flagCount++;
                }
                this.cursor = flagCount;
            } else if (startText.indexOf('_') >= 0) {
                //check first is _
                if (startText[0] == '_') {
                    var flagCount = 0;
                    for (var i = 0; i < startOffset; i++) {
                        if (startText[i] == '_') flagCount++;
                    }
                    this.cursor = startOffset - flagCount;
                } else {
                    var flagCount = 0;
                    for (var i = 0; i < startOffset; i++) {
                        if (startText[i] != '_') flagCount++;
                    }
                    this.cursor = startOffset - flagCount;
                }

                //判断左边是非字母的情况
            } else {
                this.cursor = startOffset;
            }
        } else {
            this.cursor = startOffset;
        }

        // console.log('last cursor:' + this.cursor);
        //怎么分段
        var childNodes = this.editableEle.childNodes;
        var childNodeLen = childNodes.length;
        //console.log(childNodes)
        var findIndex;
        var textNode;
        for (var i = 0; i < childNodeLen; i++) {
            textNode = this.getTextNode(childNodes[i]);
            // console.log(textNode)
            if (textNode == this.lastRange.startContainer) {
                //console.log("match")
                findIndex = i;
                var parentTagName = textNode.parentNode.nodeName;
                var isBlank = textNode.parentNode.className.indexOf('mod_fillblank') >= 0;
                if (
                    !this.checkAllIsUndline(textNode.data) &&
                    ((parentTagName == 'SPAN' && isBlank) || parentTagName == 'P')
                ) {
                    if (textNode.data.indexOf('_') >= 0) {
                        findIndex = i + 1;
                    }
                }
            }
        }
        this.splitIndex = findIndex;
        // console.log('index:' + findIndex);
        //this.doReplace()
    }

    doReplace() {
        var innerHTML = this.editableEle.innerHTML;
        //console.log("innerHTML:"+innerHTML)
        var replaceStr = this.getReplaceStr(innerHTML);
        console.log(replaceStr);
        // editableEle.innerHTML = replaceStr
        //this.instance.setData(replaceStr);
        var childNodes = this.editableEle.childNodes;
        // console.log(childNodes);
        //console.log(selection)
        // 判断是否有最后光标对象存在
        if (this.cursor) {
            //console.log("exist range")
            //console.log(childNodes)
            var selection = getSelection();
            var textNode;
            //var rangeNew = document.createRange();
            var range = new CKEDITOR.dom.range(this.instance.document);
            range.selectNodeContents(this.instance.document.getBody());
            for (var i = 0; i < childNodes.length; i++) {
                if (i == this.splitIndex) {
                    textNode = this.getTextNode(childNodes[i]);
                }
            }
            // console.log('textNode:' + textNode);
            if (textNode) {
                //range.setStart(textNode, this.cursor)
                // 使光标开始和光标结束重叠
                //range.collapse(true)
            }

            // 清除选定对象的所有光标对象
            //selection.removeAllRanges()
            // 插入新的光标对象
            //selection.addRange(range)
        }

        // console.log(range)
    }

    getReplaceStr(str) {
        // console.log("origin")
        //console.log(str)
        var regex1 = /<span data-id="fillblank-[\w]+" class="mod_fillblank">([\w|\u4e00-\u9fa5a]+)<\/span>/g;
        // 定义最后光标对象
        var lastEditRange;

        str = str.replace(regex1, function(match, $1) {
            // console.log(match)
            //console.log($1)
            // var formatStr = $1.replace(/[_]+/g,function(match){
            // 	///console.log(match)
            // 	return '<span data-id="fillblank-w71E" class="mod_fillblank">'+match+'</span>'
            // })
            //console.log(str)
            return $1;
        });
        //console.log("step1:")
        // console.log(str)
        str = str.replace(/<([^>]+>)(\w*[_]+\w*)(<[^>]+>)/g, function(match, $1, $2) {
            //console.log(match,$1,$2)
            var formatStr = match.replace(/[_]+/g, function(match) {
                // console.log(match)
                return this.repeatStr('\n', match.length);
            });
            return formatStr;
        }); //去掉所有的html标记
        // console.log(str)
        str = str.replace(/[_]+/g, function(match) {
            //console.log(match)
            return '<span data-id="fillblank-w71E" class="mod_fillblank">' + match + '</span>';
        });
        str = str.replace(/\n+/g, function(match) {
            return this.repeatStr('_', match.length);
        });
        //console.log(str)
        return str;
    }
}
