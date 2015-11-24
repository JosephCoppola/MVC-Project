"use strict";

$(document).ready(function() {

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
    
    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("Don't forget to fill out those happy fields");
            return false;
        }
        
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Make sure those passwords match");
            return false;           
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        
        return false;
    });

    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Don't forget to fill out those happy fields");
            return false;
        }
    
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });
});