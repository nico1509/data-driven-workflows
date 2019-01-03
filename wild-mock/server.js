// Node Modules
var http = require('http');
const { parse } = require('querystring');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// IoT Device Definitions

var speaker = {
    speakingPrefix: '<?xml version="1.0" encoding="utf-8" ?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns0="http://example.org/"><rdf:Description rdf:about="#spk"><ns0:speaking rdf:datatype="http://www.w3.org/2001/XMLSchema#boolean">',
    speaking: "false",
    speakingSuffix: '</ns0:speaking></rdf:Description></rdf:RDF>',
};

var light = {
    lightValuePrefix: '<?xml version="1.0" encoding="utf-8" ?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns0="http://example.org/"><rdf:Description rdf:about="#Light"><ns0:hasLightValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double">',
    lightValue: '0.2',
    lightValueSuffix: '</ns0:hasLightValue></rdf:Description></rdf:RDF>'
};

var rfid_submit = {
    sensorValuePrefix: '<?xml version="1.0" encoding="utf-8" ?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="#sensor"><rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#boolean">',
    sensorValue: 'false',
    sensorValueSuffix: '</rdf:value></rdf:Description></rdf:RDF>'
};

var rfid_bright = {
    sensorValuePrefix: '<?xml version="1.0" encoding="utf-8" ?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="#sensor"><rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#boolean">',
    sensorValue: 'false',
    sensorValueSuffix: '</rdf:value></rdf:Description></rdf:RDF>'
};

var rfid_dark = {
    sensorValuePrefix: '<?xml version="1.0" encoding="utf-8" ?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="#sensor"><rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#boolean">',
    sensorValue: 'false',
    sensorValueSuffix: '</rdf:value></rdf:Description></rdf:RDF>'
};


// SERVER

http.createServer(function(req,res,err) {

    console.log(" ");    
    console.log("[ " + new Date().toLocaleString("de") + " - Incoming request ]");
    console.log(" - Method: " + req.method);
    console.log(" - Host:   " + req.headers.host);
    console.log(" - URL:    " + req.url);
    
    
    // get/set speaker state
    if (req.headers.host === 't2-rest-speaker.lan') {
        if (req.method === 'GET') {
            console.log(" > Sending Speaker state");
            
            res.setHeader('Content-type', 'application/xml');
            res.end(
                speaker.speakingPrefix + speaker.speaking + speaker.speakingSuffix
            );        

        } else if (req.method === 'POST') {
            console.log(" > Now speaking");

            speaker.speaking = 'true';
            
            async function spdSay() {
                await exec('spd-say "I am currently speaking. I am still speaking!" -r -50 --wait');
                speaker.speaking = 'false';
                console.log(" ");
                console.log("[ " + new Date().toLocaleString("de") + " - stopped speaking ]");
                
            }
            spdSay();
            
            res.end('ok');

        } else {
            console.log(' > Method not allowed');
            
            res.end("Not Allowed", 405);

        }

    // get/set ambient light sensor
    } else if (req.headers.host === 't2-rest-rfid-ambient.lan' 
                && req.url.includes('/ambient/light')) {
        if (req.method === 'GET') {
            console.log(" > Sending light sensor state");
            
            res.setHeader('Content-type', 'application/xml');
            res.end(
                light.lightValuePrefix + light.lightValue + light.lightValueSuffix
            );

        } else if (req.method === 'POST') {
            console.log(" > Setting light value");
            
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string

            });
            req.on('end', () => {
                let postValue = parse(body).value;

                console.log(" > to " + postValue);
                
                light.lightValue = postValue;
                res.end('ok');

            });

        } else {
            console.log(' > Method not allowed');
            
            res.writeHead(405);
            res.end("Not Allowed");

        }

    // get/set rfid submit
    } else if (req.headers.host === 't2-rest-rfid-ambient.lan' 
                && req.url.includes('/rfid')) {
        if (req.method === 'GET') {
            console.log(" > Sending rfid submit state");
            
            res.setHeader('Content-type', 'application/xml');
            res.end(
                rfid_submit.sensorValuePrefix + rfid_submit.sensorValue + rfid_submit.sensorValueSuffix
            );
            
        } else if (req.method === 'POST') {
            console.log(" > Setting rfid submit value");
            
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string

            });
            req.on('end', () => {
                let postValue = parse(body).value;

                console.log(" > to " + postValue);
                
                rfid_submit.sensorValue = postValue;
                res.end('ok');

            });

        } else {
            console.log(' > Method not allowed');
            
            res.writeHead(405);
            res.end("Not Allowed");

        }

    // get/set rfid bright
    } else if (req.headers.host === 't2-rest-bright.lan') {
        if (req.method === 'GET') {
            console.log(" > Sending rfid bright state");
            
            res.setHeader('Content-type', 'application/xml');
            res.end(
                rfid_bright.sensorValuePrefix + rfid_bright.sensorValue + rfid_bright.sensorValueSuffix
            );

        } else if (req.method === 'POST') {
            console.log(" > Setting rfid bright value");
            
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string

            });
            req.on('end', () => {
                let postValue = parse(body).value;

                console.log(" > to " + postValue);
                
                rfid_bright.sensorValue = postValue;
                res.end('ok');

            });

        } else {
            console.log(' > Method not allowed');
            
            res.writeHead(405);
            res.end("Not Allowed");

        }
    
        // get/set rfid dark
    } else if (req.headers.host === 't2-rest-dark.lan') {
        if (req.method === 'GET') {
            console.log(" > Sending rfid dark state");
            
            res.setHeader('Content-type', 'application/xml');
            res.end(
                rfid_bright.sensorValuePrefix + rfid_bright.sensorValue + rfid_bright.sensorValueSuffix
            );

        } else if (req.method === 'POST') {
            console.log(" > Setting rfid dark value");
            
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string

            });
            req.on('end', () => {
                let postValue = parse(body).value;

                console.log(" > to " + postValue);
                
                rfid_bright.sensorValue = postValue;
                res.end('ok');

            });

        } else {
            console.log(' > Method not allowed');
            
            res.writeHead(405);
            res.end("Not Allowed");

        }
    
    // wrong requests here
    } else {
        console.log(" > URL not found");
        
        res.writeHead(404);
        res.end("Not Found");
    }

}).listen(80);

