
var selectedFileFolderPath;
var selectedFileFolderName;
var currentOpenedFilePath;
var projectName = "userTest";
var projectPath = "/home/abumuslim/PycharmProjects/userTest";
var port = "8081"
var taps = new Array();
var selectedTapPath;

$(document).ready(function()
{
    $('#runButton').click(
        function()
        {
            compileAndLoad();
            runServer();
        });

    $('#openProjectButton').click(
        function()
        {
            var request = $.ajax(
            {
                type: "POST",
                url: "/loadTProjectree/",
                dataType: "json",
                accepts: "json",
                headers:
                {
                    "X-CSRFToken": getCookie('csrftoken')
                },
                data:
                {
                    'projectPath': projectPath,
                    'projectName': projectName
                },
                success: function(data)
                {
                    loadProjectTree(data.htmlCode);
                }
            });
        });

    $('#saveButton').click(
        function()
        {
            saveFile(selectedTapPath);
        });

    $(".inline_rename").colorbox(
        {
            inline:true,
            width:"500px",
            onOpen: function()
                {
                    console.log("inside onOpen");
                    var currentName = $('.selected').text();
                    $('#newname').val(currentName);
                }
        });

    $(".iframe_run").colorbox(
        {
            iframe: true,
            width:"80%",
            height: "80%"
        });

});// end of doc.ready event

function saveFile(filePath)
{
    var fileData = getEditorData(filePath);
    var request = $.ajax(
    {
        type: "POST",
        url: "/saveFile/",
        //dataType: "json",
        accepts: "json",
        headers:
        {
            "X-CSRFToken": getCookie('csrftoken')
        },
        data:
        {
            'filePath': filePath,
            'fileData': fileData
        }
    });
}

function getEditorData(filePath)
{
    for(var tapIndx in taps)
    {
        if(taps[tapIndx].filePath == filePath)
            return taps[tapIndx].editor.getValue();
    }
}

function refreshTapsHandlers()
{
    $('.tap').click(
        function()
        {
            // get clicked filefolderid path
            selectedTapPath = $(this).children('.tap_mid').children('.tapfilefolderid').html();
            activateTap(selectedTapPath);
        });

    $('.tapclosebutton').click(
        function()
        {
            var tapPath = $(this).siblings('.tapfilefolderid').html();

            // remove tap from taps bar
            $(this).parent().parent().remove();

            closeTap(tapPath);
        });
}

function closeTap(tapPath)
{
    // 0) save tap
    saveFile(tapPath);

    // 1) delete the textarea
    var textArea = document.getElementById(tapPath);
    $(textArea).remove();

    // 2) delete the editor
    var editorPoo = document.getElementById(tapPath+"poo");
    $(editorPoo).remove();


    // delete it from the opened taps
    for(var tapIndx in taps)
    {
        if(taps[tapIndx].filePath == tapPath)
        {
            taps.splice(tapIndx, 1);
            break;
        }
    }

    if(taps.length > 0)
        activateTap(taps[0].filePath);
}

function runServer()
{
    console.log("starting runserver");
    // runserver
    $.ajax(
    {
        type: "POST",
        url: "/runRemoteServer/",
        //dataType: "json",
        accepts: "json",
        headers:
        {
            "X-CSRFToken": getCookie('csrftoken')
        },
        data:
        {
            'port': port
        },
        success: function()
        {
            //console.log("starting success of runserver");
            //$('inline_run').open();
            //console.log("ending success of runserver");
        },
        error: function(e)
        {
            console.log(e);
        }
    });
    console.log("ending runserver");
}

function compileAndLoad()
{
    //console.log("starting compile and load");
    $.ajax(
    {
        type: "POST",
        url: "/compileAndLoad/",
        dataType: "json",
        accepts: "json",
        headers:
        {
            "X-CSRFToken": getCookie('csrftoken')
        },
        data:
        {
            'port': port
        },
        success: function(data)
        {
            //console.log("dah elly rage3: " + data.url);
            //console.log("starting runButton success event");

            //$('.iframe_run').attr("href", data.url);
            $('#koko').attr("href", data.url);

            //console.log("ending runButton success event");
        }
    });
    //console.log("ending compile and load");
}

function loadProjectTree(htmlCode)
{
    $('#projectTreeView').html(htmlCode);
    refreshTreeHandlers();
}

function closeRenameForm()
{
    $.colorbox.close();
}

function renameFile()
{
    var newName = $('#newname').text();
}

function deleteFile()
{
    console.log("started deleting: " + selectedFileFolderPath);
    var request = $.ajax(
    {
        type: "POST",
        url: "/deleteFile/",
        //dataType: "json",
        accepts: "json",
        headers:
        {
            "X-CSRFToken": getCookie('csrftoken')
        },
        data:
        {
            'filePath': selectedFileFolderPath
        },
        success: function()
        {
            refreshProjectTree();
        },
        error: function(e)
        {
            console.log(e);
        }
    });
    console.log("deleting Done!");
}

function refreshTreeHandlers()
{
    $('.treeItem').dblclick(
        function()
        {
            var filePath = $(this).children('.file_folder_id').html();
            currentOpenedFilePath = filePath;
            selectedFileFolderName =  $(this).children('.treeItemName').html();

            if(tapIsOpened(filePath))
            {
                activateTap(filePath);
            }
            else
            {
                var request = $.ajax(
                {
                    type: "POST",
                    url: "/openFile/",
                    dataType: "json",
                    accepts: "json",
                    headers:
                    {
                        "X-CSRFToken": getCookie('csrftoken')
                    },
                    data:
                    {
                        'filePath': filePath
                    },
                    success: function(file)
                    {
                        addTap(filePath, file.file);
                    }
                });
            }
            selectedTapPath = filePath;
        });

    $('.treeItemName').click( // Select/highlight
        function()
        {
            selectedFileFolderPath = $(this).children('.file_folder_id').html();
            $('.treeItemName').removeClass("selected");
            $(this).addClass("selected");
        });

    $('.treeItemButton').click(
        function()
        {
            if ($(this).hasClass('opened'))
            {
                $(this).removeClass('opened').addClass('closed');
                $(this).parent().siblings('.subtree').animate({
                    opacity: 'toggle'
                }, 200, function() {
                    $(this).css('display', 'none');
                });
            }
            else // has class "closed"
            {
                $(this).removeClass('closed').addClass('opened');
                $(this).parent().siblings('.subtree').animate({
                    opacity: 'toggle'
                }, 200, function() {
                    $(this).css('display', 'block');
                });
            }
        });

    $('.treeItemOpenButton').click(
        function()
        {
            selectedFileFolderPath = $(this).siblings('.file_folder_id').html();
            deleteFolderFromClosedFolders(selectedFileFolderPath);
            //refreshProjectTree();
        });

} // end of refresh

function activateTap(filePath)
{
    for(var tapIndx in taps)
    {
        deactivateTap(taps[tapIndx].filePath);
    }
    document.getElementById(filePath+"poo").style.display = "block";
}

function deactivateTap(filePath)
{
    document.getElementById(filePath+"poo").style.display = "none";
}

function tapIsOpened(filePath)
{
    for(var tapIndx in taps)
    {
        if(taps[tapIndx].filePath == filePath)
            return true;
    }
    return false;
}

function addTap(filePath, fileData)
{
    $('.openedtap').removeClass('openedtap');

    $('#tapsbody').append(
        '<div class="tap openedtap">' +
            '<div class="tap_left"></div>' +
            '<div class="tap_mid">' +
                '<div class="tapname">' + selectedFileFolderName +'</div>'+
                '<div class="tapclosebutton"> X </div>'+
                '<div class="tapfilefolderid">'+ filePath +'</div>'+
            '</div>'+
            '<div class="tap_right"></div>' +
        '</div>'
    );

    var newTabTextarea;
    $('#editors').append(newTabTextarea = $(
        '<textarea id="'+ filePath +'">'+
            '#Write your blody code here!'+
        '</textarea>')
    );

    //var editor = CodeMirror.fromTextArea(document.getElementById(filePath),
    var editor = CodeMirror.fromTextArea(document.getElementById(filePath),
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
            fixedGutter: true
        });
    editor.setValue(fileData);

    var generatedFormattedEditor = newTabTextarea.next("div");
    generatedFormattedEditor.attr("id", filePath+"poo");

    taps.push({
        'filePath': filePath,
        'editor': editor
        });

    activateTap(filePath);
    refreshTapsHandlers();
}

function getCookie(name)
{
    var cookieValue = null;
    if (document.cookie && document.cookie != '')
    {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++)
        {
            var cookie = trim(cookies[i]);

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '='))
            {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function trim(str, chars)
{
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars)
{
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars)
{
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}