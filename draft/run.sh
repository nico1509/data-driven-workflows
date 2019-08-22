#!/bin/sh

#
# RUN THIS FILE IN ITS DIRECTORY!
#

ldf=../linked-data-fu-0/bin/ldfu.sh

$ldf -p ontology/rules/data-retrieval-ldpc.n3 -p ontology/rules/gsm-semantics.n3 -p ontology/rules/list-semantics.n3 -p ontology/rules/selected_ontology_semantics.n3 -p ontology/rules/spin_sparql_ask_where_query_processing.n3 -p workflow/rules/evacuation-temperature.n3 -n 20 # -o - | rapper -i nquads -o turtle -I http://example.org/ - | less # # arguments
