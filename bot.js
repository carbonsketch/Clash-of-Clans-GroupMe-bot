var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

// This module stores the current ClashCaller link.
var stateModule = (function() {
    var state; // Private Variable
    var state2; // Private Variable 2
    
    var pub = {}; // public object - returned at end of module

    pub.changeState = function(newstate) {
        state = newstate;
    };

    pub.changeState2 = function(newstate) {
        state2 = newstate;
    };
    
    // Returns ClashCaller link.
    pub.getState = function() {
        return state;
    }
    // Returns WarSheet link.
    pub.getState2 = function() {
        return state2;
    }

    return pub; // expose externally
}());

// stateModule.changeState("newstate"); - set state
// var theState = stateModule.getState(); - get state
/*
var stateWS = (function() {
    var state; // Private Variable

    var pub = {}; // public object - returned at end of module

    pub.changeState = function(newstate) {
        state = newstate;
    };

    pub.getState = function() {
        return state;
    }

    return pub; // expose externally
}());
*/
function respond() {
    var request = JSON.parse(this.req.chunks[0]),
        botCommands = /^\/commands/ // Prints a list of commands
    botCool = /^\/cool/; // Prints a random face
    botSaveCC = /^\/setcc/i; // Saves a ClashCaller link
    botPrintCC = /^\/cc/; // Prints the ClashCaller link
    botSaveWS = /^\/setws/i; // Saves a War Sheet
    botPrintWS = /^\/ws/; // Prints the War Sheet


    if (request.text && botCommands.test(request.text)) {
        this.res.writeHead(200);
        postMessage("List of commands:" + "\n" + "/commands" + "\n" + "/setcc" + "\n" + "/cc" + "\n" + "/setws" + "\n" + "/ws" + "\n");
        this.res.end();
    }
    if (request.text && botCool.test(request.text)) {
        this.res.writeHead(200);
        postMessage(cool());
        this.res.end();
    } else if (request.text && botSaveCC.test(request.text)) {
        var someText = request.text.slice(6);
        stateModule.changeState(someText);
        this.res.writeHead(200);
        postMessage("ClashCaller link saved!");
        this.res.end();
    } else if (request.text && botPrintCC.test(request.text)) {
        var theState = stateModule.getState();
        this.res.writeHead(200);
        postMessage(theState);
        this.res.end();
    } else if (request.text && botSaveWS.test(request.text)) {
        var someText = request.text.slice(6);
        stateWS.changeState2(someText);
        this.res.writeHead(200);
        postMessage("War Sheet Saved!");
        this.res.end();
    } else if (request.text && botPrintWS.test(request.text)) {
        var theState = stateWS.getState2();
        this.res.writeHead(200);
        postMessage(theState);
        this.res.end();
    } else {
        console.log("don't care");
        this.res.writeHead(200);
        this.res.end();
    }
}

function postMessage(response) {
    var botResponse, options, body, botReq;

    botResponse = response

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botID,
        "text": botResponse
    };

    console.log('sending ' + botResponse + ' to ' + botID);

    botReq = HTTPS.request(options, function(res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function(err) {
        console.log('error posting message ' + JSON.stringify(err));
    });

    botReq.on('timeout', function(err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.respond = respond;
