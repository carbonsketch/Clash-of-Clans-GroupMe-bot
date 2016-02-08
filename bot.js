var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

// This module is used to permanently store global variables
var stateModule = (function() {
    var ccLink; // Private Variable for ClashCaller link
    var wsImage; // Private Variable for war sheet image
    
    var pub = {}; // public object - returned at end of module

    // Changes the ClashCaller link
    pub.changeccLink = function(newstate) {
        ccLink = newstate;
    };
    // Changes the WarSheet image
    pub.changewsImage = function(newstate) {
        wsImage = newstate;
    };

    // Returns ClashCaller link
    pub.getccLink = function() {
        return ccLink;
    }
    // Returns WarSheet image
    pub.getwsImage = function() {
        return wsImage;
    }

    return pub; // Exposes the requested variable
}());

function respond() {
    var request = JSON.parse(this.req.chunks[0]),
        botCommands = /^\/commands/; // Prints a list of commands
        botCool = /^\/cool/; // Prints a random face
        botSaveCC = /^\/setcc/i; // Saves a ClashCaller link
        botPrintCC = /^\/cc/; // Prints the ClashCaller link
        botSaveWS = /^\/setws/i; // Saves a War Sheet
        botPrintWS = /^\/ws/; // Prints the War Sheet
        botPrintCW = /^\/cw/; // Prints the ClashCaller and WarSheet together

    console.log('----------Begin Message----------')
    console.log('Sender: ' + request.name);
    console.log('Sender ID: ' + request.sender_id);
    console.log('Message: ' + request.text);

    
    if (request.sender_type === 'bot') {
        console.log('Ignoring message sent by bot.');
        console.log('----------End Message----------')
        this.res.writeHead(200);
        this.res.end();
    } else {
//commands    
        if (request.text && botCommands.test(request.text)) {
            this.res.writeHead(200);
            postMessage("List of commands: \n \
                    /commands - Prints this list \n \
                    /setcc - Sets the ClashCaller link \n \
                    /cc - Prints the ClashCaller link \n \
                    /setws - Sets the War Sheet \n \
                    /ws - Prints the War Sheet \n \
                    /cw - Prints the ClashCaller and War Sheet");
            this.res.end();
        }
// cool
        if (request.text && botCool.test(request.text)) {
            this.res.writeHead(200);
            postMessage(cool());
            this.res.end();
// setcc
        } else if (request.text && botSaveCC.test(request.text)) {
            var someText = request.text.slice(7);
            this.res.writeHead(200);
            postMessage(checkccLink(someText));
            this.res.end();
// cc
        } else if (request.text && botPrintCC.test(request.text)) {
            var theState = stateModule.getccLink();
            this.res.writeHead(200);
            postMessage(checkUndefinedLink(theState));
            this.res.end();
// setws
        } else if (request.text && botSaveWS.test(request.text)) {
            this.res.writeHead(200);
            postMessage(savewsImg(request.attachments, request.text));
            this.res.end();
// ws
        } else if (request.text && botPrintWS.test(request.text)) {
            this.res.writeHead(200);
            if (typeof stateModule.getwsImage() === 'undefined') {
                postMessage("Image has not been set!")
            } else {
                postMessage(null, stateModule.getwsImage());
            }
            this.res.end();
// cw
        } else if (request.text && botPrintCW.test(request.text)) {
            this.res.writeHead(200);
            if (typeof stateModule.getccLink() === 'undefined' && typeof stateModule.getwsImage() === 'undefined') {
                postMessage("There is currently no ClashCaller link, or war sheet image saved!");
            } else if (typeof stateModule.getwsImage() === 'undefined') {
                postMessage(stateModule.getccLink() + " - No war sheet image saved!");
            } else if (typeof stateModule.getccLink() === 'undefined') {
                postMessage("No ClashCaller link saved!", stateModule.getwsImage());
            } else {
                postMessage(stateModule.getccLink(), stateModule.getwsImage());
            }
            this.res.end();
// end of commands
        } else {
            console.log("Bot: No command detected.");
            console.log('----------End Message----------')
            this.res.writeHead(200);
            this.res.end();
        }
    }
}

function postMessage(response, img) {
    var botResponse, options, body, botReq, botUrl;

    botResponse = response;
    botUrl = img;
    
    if (typeof img === 'undefined') {
        attachment = [];
    } else {
        var attachment = [{
        "type": "image",
        "url": botUrl
        }]
    };

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };
    body = {
        "bot_id": botID,
        "text": botResponse,
        "attachments": attachment,
    };
    
    console.log('sending ' + botResponse + ' to ' + botID);
    console.log('contents of body: ' + JSON.stringify(body))
    console.log('----------End Message----------');

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

// Saves a war sheet image by attachment or as a link
function savewsImg (attachment, linkText) {
    if (attachment.length === 0) {
        substring = "https://i.groupme.com/";
        if (linkText.indexOf(substring) > -1) {
            var someText = linkText.slice(7);
            stateModule.changewsImage(someText);
            return "Image saved!";
        } else {
            return "Sorry, did not detect an image. Make sure you have attached an image, or linked an image already uploaded to GroupMe.";
        }
    } else {
        var imageLink = attachment[0].url;
        stateModule.changewsImage(imageLink);
        return "Image saved!";
    }
}

// Checks if the ClashCaller link is valid
function checkccLink(linkText) {
    substring = "//clashcaller.com/war";
    if (linkText.indexOf(substring) > -1) {
        stateModule.changeccLink(linkText);
        return "ClashCaller Link Saved!";
    } else {
        return "Sorry, " + "\"" + linkText + "\"" + " is not a valid clashcaller link.";
    }
}

// Checks if a link has been set
function checkUndefinedLink(someText) {
    if(typeof someText === 'undefined'){
        return "No link has been set!";
    } else {
        return nothing, someText;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.respond = respond;
