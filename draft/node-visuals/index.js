
var express = require('express');
var bodyParser = require("body-parser");

var parser = require('./parser.js');
var fs = require('fs');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var milestoneValues = {
    firealarmButtonPressed: false,
    temperature: 25,
    emergencyArrived: false,
    peopleEvacuated: false,
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
    peopleCounted: {name: 'People', predicate: 'counted'},
    peopleComplete: {name: 'People', predicate: 'complete'},
    peopleIncomplete: {name: 'People', predicate: 'incomplete'},
    fireExtinguished: {name: 'Fire', predicate: 'extinguished'}
}

app.get('/mock', function(req, res){

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

app.post('/mock',function(request,response){
    //var query1=request.body.var1;
    //var query2=request.body.var2;

   
    milestoneValues = JSON.parse(request.body.data);

    console.log('MilestoneValues Updated!');
});

app.get('/mock/reset', function(req, res){
    milestoneValues = {
        firealarmButtonPressed: false,
        temperature: 25,
        emergencyArrived: false,
        peopleEvacuated: false,
        peopleCounted: false,
        peopleComplete: false,
        peopleIncomplete: false,
        fireExtinguished: false
    };

    res.send('done');
});

app.get('/mock/ui', function(req, res){
    fs.readFile('mock.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

app.get('/stages', function(req, res){
    fs.readFile('stages.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

app.get('/stages/stages.json', function(req, res){

    //stages = {"test": "test"};

    parser.getStages(function(stages){
        //res.send(JSON.stringify(stages));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(stages));
        res.end();
    });  
});

app.get('/test', function (req, res) {

    parser.getRessource(41, function(ressource){

        res.send(JSON.stringify(ressource));

    });

});

app.get('/test2', function (req, res) {

    parser.getRessources(function(ids){

        res.send(JSON.stringify(ids));

    });

});

app.get('/iphs', function(req, res){

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    

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

app.get('/', function (req, res) {
    res.send('Hello open World!');
});

app.listen(3000, function () {
  
    var ip = require('ip');
    console.log('Mock server started on '+ip.address()+':3000.');

});
