
function changeTheme()
{
    var selectedTheme = $('#selectThemeID').val(); // .options[ $('#selectThemeID').selectedIndex ].innerHTML;
    editor.setOption("theme", selectedTheme);
    editor.refresh();
}

/*
var editor;
$(document).ready(function()
{
    editor = CodeMirror.fromTextArea(document.getElementById("code"),
    {
        lineNumbers: true,
        extraKeys: {"Ctrl-Space": function(cm) {CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);}},
        theme: "night",
        smartIndent: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: true,
        lineWrapping: true,
        gutter: true,
        fixedGutter: true,
    });
});
*/

function addEditor()
{
}
