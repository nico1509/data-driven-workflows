#!/bin/sh
ldf=/Users/benjaminjochum/workspace/semantic-iot/linked-data-fu-0/bin/ldfu.sh

curl -f -X DELETE localhost/ldbbc/ || exit 1
curl -f -X PUT -T workflow/ibm-workflow.ttl localhost/ldbbc/ -Hcontent-type:text/turtle || exit 2
curl -f -X PUT -T ontology/ibm-vocab.ttl localhost/ldbbc/ -Hcontent-type:text/turtle || exit 3
curl -f -X PUT -T ontology/list-vocab.ttl http://localhost/ldbbc/ -Hcontent-type:text/turtle || exit 4
curl -f -X PUT -T workflow/ibm-workflow-instance.ttl http://localhost/ldbbc/ -Hcontent-type:text/turtle || exit 5

JAVA_OPTS=-Dldfu.optimiser=OFF $ldf -p ontology/rules/data-retrieval-ldpc.n3 -p ontology/rules/ibm-semantics.n3 -p ontology/rules/spin_sparql_ask_where_query_processing.n3 -p ontology/rules/selected_ontology_semantics.n3 -n 1500 #fish-sync...

