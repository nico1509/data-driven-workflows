#!/bin/sh

ldf=/home/nico/Dokumente/Workspaces/semantic-iot/linked-data-fu-0/bin/ldfu.sh

curl -f -X DELETE http://tok450s.lan:8080/ldbbc/ || exit 1
curl -f -X PUT -T workflow/wild-workflow.ttl http://tok450s.lan:8080/ldbbc/ -Hcontent-type:text/turtle || exit 2
curl -f -X PUT -T ontology/ibm-vocab.ttl http://tok450s.lan:8080/ldbbc/ -Hcontent-type:text/turtle || exit 3
curl -f -X PUT -T ontology/list-vocab.ttl http://tok450s.lan:8080/ldbbc/ -Hcontent-type:text/turtle || exit 4
