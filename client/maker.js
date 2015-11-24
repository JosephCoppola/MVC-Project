"use strict";

var rColor = 100;
var gColor = 100;
var bColor = 100;

var count = 0;
var currentLevelArray = [];

$(document).ready(function() {
    
    $(".domoName").each(function(index,obj){
        var color = $(this).html();
        $(this).empty();
        
        var colorArray = color.split(',');
       
        for(var x = 0; x < colorArray.length; x+=3)
        {
            var colorString = "rgb(" + colorArray[x] + "," + colorArray[x+1] + "," + colorArray[x+2] + ")";
            
            $(this).append("<div class = \"color\" style = \"background: " + colorString + "\"></div>");
        }
        
         $(this).parent().append("<h3 class = \"domoAge\">" + (colorArray.length/3) + " guesses</h3>")
    });
    
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
       if(count < 14)
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
            handleError("Can't be adding so many colors in there");  
       }
    });
    
    $("#makeLevelButton").on("click", function(e) {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if(currentLevelArray.length == 0)
        {
            handleError("Add one little color to your masterpiece");
            return;     
        }
        
        var data = 
         {
            levelArray: currentLevelArray,
            _csrf:$("#security").val()
         };

        sendAjax("/maker", data);
        
        return false;
    });
});