"use strict";

var rColor = 100;
var gColor = 100;
var bColor = 100;

var count = 0;
var currentLevelArray = [];

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
    
    $("#addColor").on("click",function(e){
       if(count < 8)
       {   
            if($('#currentLevel').find('h3.blankTitle').length != 0)
            {
                $("#currentLevel").empty();  
            }
            
            currentLevelArray.push($("#red").val());
            currentLevelArray.push($("#green").val());
            currentLevelArray.push($("#blue").val());
            
            var rgbString = "rgb(" + $("#red").val() + "," + $("#green").val() + "," + $("#blue").val() + ")";
            
            $("#currentLevel").append("<div class=\'color\' style = background:" + rgbString + "></div>"); 
            count++;
       }
       else
       {
            handleError("Already at max allowed guesses");  
       }
    });
    
    $("#makeLevelButton").on("click", function(e) {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if(currentLevelArray.length == 0)
        {
            handleError("Add at least one color to guess");
            return;     
        }
        
        var data = 
         {
            levelArray:JSON.stringify(currentLevelArray),
            _csrf:$("#security").val()
         };


        sendAjax("/maker", data);
        
        return false;
    });
});