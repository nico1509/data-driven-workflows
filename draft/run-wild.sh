#!/bin/sh

ldf=/home/nico/Dokumente/Workspaces/semantic-iot/linked-data-fu-0/bin/ldfu.sh

#curl -f -X DELETE http://tok450s.lan:8080/ldbbc/ || exit 1
#curl -f -X PUT -T workflow/wild-workflow.ttl http://tok450s.lan:8080/ldbbc/ -Hcontent-type:text/turtle || exit 2
#curl -f -X PUT -T ontology/ibm-vocab.ttl http://tok450s.lan:8080/ldbbc/ -Hcontent-type:text/turtle || exit 3
#curl -f -X PUT -T ontology/list-vocab.ttl http://tok450s.lan:8080/ldbbc/ -Hcontent-type:text/turtle || exit 4

$ldf -p ontology/rules/data-retrieval-ldpc.n3 -p ontology/rules/ibm-semantics.n3 -p ontology/rules/list-semantics.n3 -p ontology/rules/selected_ontology_semantics.n3 -p ontology/rules/spin_sparql_ask_where_query_processing.n3 -p workflow/rules/lightCheck.n3 #-n 100 # arguments
