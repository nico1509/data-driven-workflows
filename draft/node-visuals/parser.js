var xmlParser = require('xml2js').parseString;

var rdfhost_ip = "129.13.28.47";
var rdfhost_port = "8080";

exports.getRessources = function (callback) {
    
    var url = 'http://' + rdfhost_ip + ':' + rdfhost_port + '/ldbbc/';
    const curl = new (require('curl-request'))();
    curl.setHeaders([
        'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'accept: application/rdf+xml'
    ])
    .get(url)
    .then(({statusCode, body, headers}) => {
        
       // res.send(body);

        var xml = body;
        xmlParser(xml, function (err, result) {
            
            //res.send(JSON.stringify(result));

            /// find ressources
            var ressources = [];
            var description = result['rdf:RDF']['rdf:Description'];
            var description_node = null;
            var description_ressource = null;
            for(var i in description){
                description_node = description[i];
               
                Object.keys(description_node).forEach(function(key, index) {
                    
                    if(key.substr(key.length - 9) == ':contains'){
                        
                        description_ressource = description_node[key][0]['$']['rdf:resource'];

                        if(/^\d+$/.test(description_ressource)){
                            //console.log(description_ressource);
                            ressources.push(description_ressource);
                        }
                        
                    }

                }); 

            }


            // output
            //res.send(JSON.stringify(ressources));

            callback(ressources);


        });


    })
    .catch((e) => {
        console.log(e);
        callback([]);
    });

}; 

exports.getRessource = function (ressource_id, callback) {

    var url = 'http://' + rdfhost_ip + ':' + rdfhost_port + '/ldbbc/' + ressource_id;
    const curl = new (require('curl-request'))();
    curl.setHeaders([
        'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'accept: application/rdf+xml'
    ])
    .get(url)
    .then(({statusCode, body, headers}) => {
        
       

        var xml = body;
        xmlParser(xml, function (err, result) {
           
            var ressources = [];
            var description = result['rdf:RDF']['rdf:Description'];

            /// get ressource type out of first $.rdf:about
            var about = description[0]['$']['rdf:about'];
            var type = about.split("#")[1];

            console.log('TYPE: ' + type)

            var attributes = ['hasState', 'isInstanceOf', 'forStageModel'];
            var values = {};
            
            var description_node = null;
            var description_ressource = null;
            for(var i in description){
                description_node = description[i];
               
                Object.keys(description_node).forEach(function(key, index) {
                    
                    for(var a in attributes){
                        var attribute = attributes[a];
                        if(key.substr(key.length - (attribute.length + 1)) == ':' + attribute){
                        
                            description_ressource = description_node[key][0]['$']['rdf:resource'];
                            values[attribute] = description_ressource.split('#')[1];
                            
                        }
                    }


                }); 

            }
            
            
            var json = {
                id: ressource_id,
                type: type,
                attributes: attributes, 
                values: values
            }
            

            //callback(result);
            callback(json);

        });

    })
    .catch((e) => {
        console.log(e);
    });
};


exports.getStages = function(callback){


    module.exports.getRessources(function(ressourceIds){

        var stages = {};
        var milestones = {};
        var tasks = {};

        var stagesParsed = function(){

            for(var i in milestones)
                 stages[milestones[i].stage].milestones.push(milestones[i]);
            
            
            for(var i in tasks)
                stages[tasks[i].stage].tasks.push(tasks[i]);

            callback(stages);
        };
        
        for(var i = 0; i < ressourceIds.length; i++){
            var ressourceId = ressourceIds[i];
            var ressources_fetch_cnt = 0;

            //console.log('--id->' + ressourceId);

            module.exports.getRessource(ressourceId, function(ressource){

                console.log('PARSING: ' + ressource.id + ' - ' + ressource.type);

                switch(ressource.type){
                    case 'StageInstance':

                        stages[ressource.values.isInstanceOf] = {
                            id: ressource.id,
                            name: ressource.values.isInstanceOf,
                            state: ressource.values.hasState,
                            guards: null,
                            milestones: [],
                            tasks: []
                        };

                    break;
                    case 'MilestoneInstance':


                        milestones[ressource.values.forStageModel] = {
                            id: ressource.id,
                            name: ressource.values.isInstanceOf,
                            state: ressource.values.hasState,
                            stage: ressource.values.forStageModel
                        };

                    break;
                    case 'TaskInstance':

                        tasks[ressource.values.forStageModel] = {
                            id: ressource.id,
                            name: ressource.values.isInstanceOf,
                            state: ressource.values.hasState,
                            stage: ressource.values.forStageModel
                        };


                    break;
                    
                }

                if(++ressources_fetch_cnt == ressourceIds.length){
                    console.log('DONE');
                    stagesParsed();
                }
                
            });

        }
    });


}