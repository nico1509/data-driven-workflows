
var express = require('express');
var parser = require('./parser.js');



var app = express();

app.get('/test', function (req, res) {

    parser.getRessource(15, function(ressource){

        res.send(JSON.stringify(ressource));

    });

});

app.get('/', function (req, res) {
    //res.send('Hello World!');

    

    /// test
    parser.getRessources(function(ressourceIds){

        var stages = {};
        var stagesParsed = function(){
            res.send(JSON.stringify(stages));
        };
        
        for(var i = 0; i < ressourceIds.length; i++){
            var ressourceId = ressourceIds[i];
            var ressources_fetch_cnt = 0;

            console.log('--id->' + ressourceId);

            parser.getRessource(ressourceId, function(ressource){

                console.log('PARSING: ' + ressource.id + ' - ' + ressource.type);

                switch(ressource.type){
                    case 'StageInstance':

                        stages[ressource.id] = {
                            id: ressource.id,
                            name: ressource.values.isInstanceOf,
                            state: ressource.values.hasState,
                            guards: [],
                            milestones: []
                        };

                    break;
                    case 'MilestoneInstance':


                    break;
                    case 'TaskInstance':


                    break;
                    
                }

                if(++ressources_fetch_cnt == ressourceIds.length){
                    console.log('DONE');
                    stagesParsed();
                }
                
            });

        }
    });

    


});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
