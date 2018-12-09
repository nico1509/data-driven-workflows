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


http.createServer(function (req, res) {
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
    } else if (req.url.startsWith("/button/reset")) { // press the Button
        buttonPressed = "false";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, button reset!");
    } else if (req.url.startsWith("/worker/doWork")) { // simulate task
        workerDone = "true";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ok, did work");
        /*setTimeout(() => {
            workerDone = "true";
        }, 5000)*/
    } else if (req.url.startsWith("/worker/state")) { // get state of task
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(workerStatePrefix + workerDone + workerStateSuffix);
    } else {                                    // 404
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.end('Error 404');
    }
    
    
	
}).listen(8080);