"use strict";

var rColor = 100;
var gColor = 100;
var bColor = 100;

$(document).ready(function() {
    
    var color = $("#secondaryColor").attr( "color" );
    
    $('body').css('background', color);
    $("#colorZone").css('background',"rgb(" + rColor + "," + gColor + "," + bColor);
    
    $("#red").on("input", function(){rColor = this.value; $("#colorZone").css('background',"rgb(" + rColor + "," + gColor + "," + bColor); });
    $("#green").on("input", function(){gColor = this.value; $("#colorZone").css('background',"rgb(" + rColor + "," + gColor + "," + bColor); });
    $("#blue").on("input", function(){bColor = this.value; $("#colorZone").css('background',"rgb(" + rColor + "," + gColor + "," + bColor); });

    function handleError(message) {
        $("#errorMessage").text(message);
        $("#domoMessage").animate({width:'toggle'},350);
    }
    
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $("#domoMessage").animate({width:'hide'},350);

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
    $("#makeDomoSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#domoName").val() == '' || $("#domoAge").val() == '') {
            handleError("RAWR! All fields are required");
            return false;
        }

        sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());
        
        return false;
    });
});