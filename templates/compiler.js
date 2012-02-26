/**
* Created by PyCharm.
* User: abumuslim
* Date: 2/2/12
* Time: 11:42 PM
* To change this template use File | Settings | File Templates.
*/


function compileCode()
{
    //console.log("Here!");

    var code = $('#code').val();
    var code2 = document.getElementById('code').value;

    console.log( putDelimiterPerLine(code, '$') );
    console.log( "new: " + replaceAll(code, '\n', '$'));

    var request = $.ajax(
    {
        type: "POST",
        url: "/compile/",
        dataType: "json",
        accepts: "json",
        headers:
        {
            "X-CSRFToken": getCookie('csrftoken')
        },
        data:
        {
            'code': code
        },

        success: function(compilation)
        {
            if (compilation.success == 1)
            {
                $('#notificationsID').css("backgroundColor", "#00FF00");
                $('#notificationsID').html("FOLL!");
            }
            else
            {
                $('#notificationsID').css("backgroundColor", "#FF0000");
                $('#notificationsID').html("Failed!");
            }
            $('#results').val(compilation.result);
        }
    });

    request.fail( function(jqXHR, textStatus)
    {
        alert(textStatus);
    });
}

function replaceAll(txt, replace, with_this)
{
    return txt.replace(new RegExp(replace, 'g'), with_this);
}


function putDelimiterPerLine(str, d)
{
    return str.replace(/\r\n|\r|\n/, d);
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