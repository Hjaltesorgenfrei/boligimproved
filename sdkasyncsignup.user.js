// ==UserScript==
// @name         S.dk Async sign up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://s.dk/studiebolig/*
// @grant       GM_cookie
// @grant       GM.cookie
// ==/UserScript==

var cookievalues = {};

function submit(values, button) {
    var formData = "";
    formData += 'csrfmiddlewaretoken=' + cookievalues.csrfmiddlewaretoken + '&'
    formData += 'submit=' + values;
    fetch(window.location.href, {
        method: "POST",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': window.location.href,
            'Origin': 'https://s.dk',
            'DNT': '1',
            'Cookie': 'csrftoken=' + cookievalues.csrftoken + '; sessionid=' + cookievalues.sessionid
        },

        //make sure to serialize your JSON body
        body: formData
    })
        .then( (response) => {
        var p = button.parentElement;
        if(p.className == 'd-md-inline-block mr-md-3'){

            button.parentElement.parentElement.appendChild(button);
            p.remove();
            button.className = "btn btn-outline-primary btn-loading";
            button.innerText = "Sign up for this tenancy";
        }
        else if(p.className == 'tenancy-signup d-block d-md-table-cell'){

            var para = document.createElement("p");
            para.className = 'd-md-inline-block mr-md-3';
            p.appendChild(para);
            para.appendChild(button);
            button.className = "btn btn-outline-danger btn-loading";
            button.innerText = "Delete application";
        }
    });
}

function get_cookie_by_name(name)
    {
    return GM.cookie.list({ name: name }).then(function(cookies) {
        cookievalues[name] = cookies[0].value;
        return cookies;
    });
   }

(async function() {
    'use strict';
    document.getElementsByClassName("spinner")[0].remove();
    cookievalues.csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    await Promise.all([get_cookie_by_name("csrftoken"), get_cookie_by_name("sessionid")]);
    let [csrftoken, sessionid] = ([cookievalues.csrftoken, cookievalues.sessionid]);
    var buttons = document.querySelectorAll(".btn-loading");
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function (e) {
            event.preventDefault();
            var target = e.target || e.srcElement;
            submit(target.value, target);
        })
    }
})();