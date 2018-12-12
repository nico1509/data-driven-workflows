var http = require('http');
var fs = require('fs');

var buttonPressed = "false";
var buttonStatePrefix = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>"
    + "<rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" "
    + "xmlns:ns0=\"#\">"
    + "<rdf:Description rdf:about=\"#Btn\">"
    + "<ns0:isPressed rdf:datatype=\"http://www.w3.org/2001/XMLSchema#boolean\">";
    
var buttonStateSuffix = "</ns0:isPressed></rdf:Description></rdf:RDF>";
    
var workerDone = "false";
var workerStatePrefix = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>"
    + "<rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" "
    + "xmlns:ns0=\"#\">"
    + "<rdf:Description rdf:about=\"#Worker\">"
    + "<ns0:didSomething rdf:datatype=\"http://www.w3.org/2001/XMLSchema#boolean\">";
    
var workerStateSuffix = "</ns0:didSomething></rdf:Description></rdf:RDF>";

var workerTwoDone = "false";
var workerTwoStatePrefix = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>"
    + "<rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" "
    + "xmlns:ns0=\"#\">"
    + "<rdf:Description rdf:about=\"#Worker2\">"
    + "<ns0:didSomething rdf:datatype=\"http://www.w3.org/2001/XMLSchema#boolean\">";
    
var workerTwoStateSuffix = "</ns0:didSomething></rdf:Description></rdf:RDF>";



http.createServer(function (req, res) {
    console.log(new Date() + " - incoming request to " + req.url);
       /*
        *   BUTTON
        */
    if (req.url.startsWith("/button/ui")) { // get clickable button
        fs.readFile('ui/button.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (req.url.startsWith("/button/state")) { // get Button State
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(buttonStatePrefix + buttonPressed + buttonStateSuffix);
    } else if (req.url.startsWith("/button/pressButton")) { // press the Button
        buttonPressed = "true";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, button pressed!");
    } else if (req.url.startsWith("/button/reset")) { // reset the Button
        buttonPressed = "false";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, button reset!");
    } 
        /*
        *   WORKER 1
        */
    else if (req.url.startsWith("/worker/doWork")) { // simulate task
        workerDone = "true";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, did work");
        /*setTimeout(() => {
            workerDone = "true";
        }, 5000)*/
    } else if (req.url.startsWith("/worker/state")) { // get state of task
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(workerStatePrefix + workerDone + workerStateSuffix);
    } 
        /*
        *   WORKER 2
        */
    else if (req.url.startsWith("/worker-two/doWork")) { // simulate task
        workerTwoDone = "true";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, did work 2");
        /*setTimeout(() => {
            workerDone = "true";
        }, 5000)*/
    } else if (req.url.startsWith("/worker-two/state")) { // get state of task
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(workerTwoStatePrefix + workerTwoDone + workerTwoStateSuffix);
    } 
        /*
        *   RESET ALL
        */
    else if (req.url.startsWith("/reset")) {
        buttonPressed = "false";
        workerDone = "false";
        workerTwoDone = "false";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, all reset");
    }
        /*
        *   ERROR HANDLING
        */
    else {
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.end('Error 404');
    }
    
    
	
}).listen(8080);