CKEDITOR.plugins.add('variable', {
    requires: ['iframedialog'],
    icons: 'variable',
    init: function(editor) {
        
        CKEDITOR.dialog.addIframe('ck-variable-dialogue', 
            editor.insertVariable.title,
            editor.insertVariable.url,
            500,300,function(){ 
                
            });

        editor.addCommand('insertVariable', {
            exec: function(editor){

                editor.insertVariable = function(variable, cb){
					editor.insertHtml(variable);
					CKEDITOR.dialog.getCurrent().hide()
                    if(cb)cb(window.openedEditor);
                    
					window.openedEditor = null;
                }
                window.currentEditor=editor;
                editor.openDialog('ck-variable-dialogue');
            }
        });

        editor.ui.addButton('Variable', {
            label: editor.insertVariable.title,
            command: 'insertVariable'
        });

    }
});