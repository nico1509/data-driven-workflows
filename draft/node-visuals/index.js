
var express = require('express');
var bodyParser = require("body-parser");

var parser = require('./parser.js');
var fs = require('fs');
 
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var rdfhost_ip = "xxx.xxx.xxx.xxx";
var rdfhost_port = "8080";

var milestoneValues = {
    firealarmButtonPressed: false,
    temperature: 45,
    emergencyArrived: false,
    peopleEvacuated: false,
    cntPeople: 0,
    peopleCounted: false,
    peopleComplete: false,
    peopleIncomplete: false,
    fireExtinguished: false
};

var milestoneRDF = {
    firealarmButtonPressed: {name: 'AlarmButton', predicate: 'isPressed'},
    temperature: {name: 'Temperature', predicate: 'value'},
    emergencyArrived: {name: 'Emergency', predicate: 'isArrived'},
    peopleEvacuated: {name: 'People', predicate: 'evacuated'},
    cntPeople: {name: 'People', predicate: 'count'},
    peopleCounted: {name: 'People', predicate: 'counted'},
    peopleComplete: {name: 'People', predicate: 'complete'},
    peopleIncomplete: {name: 'People', predicate: 'incomplete'},
    fireExtinguished: {name: 'Fire', predicate: 'extinguished'}
}

// ressources (html)
app.get('/res/jQuery.js', function(req, res){
    fs.readFile('res/jQuery.js', "utf8", function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
    });  
});

app.get('/res/fa.css', function(req, res){
    fs.readFile('res/fa.css', "utf8", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
    });  
});

// setup the mock
app.get('/mock/setup', function(req, res){
    
    
    var ldbbc = "http://"+rdfhost_ip+":"+rdfhost_port+"/ldbbc/";

    var script = `curl -f -X DELETE `+ldbbc+` && 
    curl -f -X PUT -T ../workflow/evacuation-workflow.ttl `+ldbbc+` -Hcontent-type:text/turtle && 
    curl -f -X PUT -T ../ontology/ibm-vocab.ttl `+ldbbc+` -Hcontent-type:text/turtle && 
    curl -f -X PUT -T ../ontology/list-vocab.ttl `+ldbbc+` -Hcontent-type:text/turtle && 
    curl -f -X PUT -T ../workflow/evacuation-workflow-instance.ttl `+ldbbc+` -Hcontent-type:text/turtle`;

    const shellExec = require('shell-exec')
 
    shellExec(script).then(function(x){
        console.log(x); res.send('done'); 
    }).catch(function(x){
        console.log(x); res.send('err'); 
    });

});

// get mock milestone values as rdf+xml
app.get('/mock/rdf', function(req, res){

    var name = 'Worker';
    var predicate = 'didSomething';

    var xmlStr = '<?xml version="1.0" encoding="utf-8" ?>';
    xmlStr += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns0="http://example.org/">';
    

    for(i in milestoneValues){

        var dataType = /^\d+$/.test(milestoneValues[i]) ? 'integer' : 'boolean';
        var name = milestoneRDF[i].name;
        var predicate = milestoneRDF[i].predicate;

        xmlStr += '<rdf:Description rdf:about="#'+name+'">';
        xmlStr += '<ns0:'+predicate+' rdf:datatype="http://www.w3.org/2001/XMLSchema#'+dataType+'">';
        
        switch(dataType){
            case 'boolean':
                xmlStr += (milestoneValues[i] ? 'true' : 'false');
            break;
            case 'integer':
                xmlStr += milestoneValues[i];
            break;
        }

        xmlStr += '</ns0:'+predicate+'></rdf:Description>';
    }

    
    xmlStr += '</rdf:RDF>';

    res.writeHead(200, {'Content-Type': 'application/rdf+xml'});
    res.write(xmlStr);
    res.end();
});

// get mock milestone values as json 
app.get('/mock/json', function(req, res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(milestoneValues));
    res.end();
});

// set the mock milestone values (json expected)
app.post('/mock',function(request,response){
    //var query1=request.body.var1;
    //var query2=request.body.var2;

   
    milestoneValues = JSON.parse(request.body.data);

    console.log('MilestoneValues Updated!');
});

// reset the mock milestone values
app.get('/mock/reset', function(req, res){
    milestoneValues = {
        firealarmButtonPressed: false,
        temperature: 25,
        cntPeople: 0,
        emergencyArrived: false,
        peopleEvacuated: false,
        peopleCounted: false,
        peopleComplete: false,
        peopleIncomplete: false,
        fireExtinguished: false
    };

    res.send('done');
});

// mock people counter 
app.post('/mock/cntPeople/add', function(req, res){
    milestoneValues.cntPeople++;
    res.end();
});

app.post('/mock/cntPeople/remove', function(req, res){
    milestoneValues.cntPeople--;
    res.end();
});

app.get('/mock/cntPeople/add', function(req, res){
    milestoneValues.cntPeople++;
    res.send('dev: ' + milestoneValues.cntPeople);
});

// display the mock ui (html)
app.get('/mock/ui', function(req, res){
    fs.readFile('html/mock.html', "utf8", function(err, data) {

        data = data.replace('xxx.xxx.xxx.xxx:xxxx', rdfhost_ip + ':' + rdfhost_port);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

// display the stages ui (html)
app.get('/stages', function(req, res){
    fs.readFile('html/stages.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

// get the stages data as json
app.get('/stages/stages.json', function(req, res){

    //stages = {"test": "test"};

    parser.getStages(function(stages){
        //res.send(JSON.stringify(stages));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(stages));
        res.end();
    });  
});

// make an ip handshake to recieve the ldbbc host's ip
app.get('/iphs', function(req, res){

    var ip = req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');

    console.log('iphs: ldbbc running on: ' + ip);

    /// set here 
    rdfhost_ip = ip;
    rdfhost_port = 8080;

    /// set in parser
    parser.setIP(ip, rdfhost_port);
    
    res.end();
});

// fetch the ldbbc host ip:port
app.get('/iphs/host', function(req, res){
    res.send(ip + ':' + rdfhost_port);
});

/*
app.get('/stages', function (req, res) {
    //res.send('Hello World!');

    

    /// test
    parser.getStages(function(stages){
        res.send(JSON.stringify(stages));
    });   


});
*/

// landing page
app.get('/', function (req, res) {
    var self_ip = require('ip');
    var self_host = self_ip.address()+':3000';

    var ldbbc_host = rdfhost_ip + ':' + rdfhost_port;

    res.send('<style type="text/css">body{padding:20px;font-family: Arial;}a{display:inline-block;margin: 3px 0;color:#08729c;}</style><p>Running on '+self_host+'.</p>LDBBC connected on '+ldbbc_host+'. <a href="/iphs">iphs</a><br/><h2>Mock Server</h2><a href="/mock/rdf">Milestone Values (RDF XML)</a><br/><a href="/mock/json">Milestone Values (JSON)</a><br/><a href="/mock/ui">UI</a><br/><h2>Visualization Server</h2><a href="/stages">UI</a><br/><a href="/stages/stages.json">parsed stages json</a><br/><script>setInterval(function(){window.location.reload()}, 2000);</script>');
});

/// testing
app.get('/test', function (req, res) {

    parser.getRessource(18, function(ressource){

        res.send(JSON.stringify(ressource));

    });

});

app.get('/test2', function (req, res) {
    parser.getRessources(function(ids){
        res.send(JSON.stringify(ids));
    });
});

app.get('/test3', function (req, res) {
    parser.getStages(function(stages){
        res.send(JSON.stringify(stages));
    });  
});

// run server
app.listen(3000, function () {
  
    var ip = require('ip');
    console.log('Mock server started on '+ip.address()+':3000.');

});
