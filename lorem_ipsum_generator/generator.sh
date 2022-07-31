#!/bin/bash

read -p 'Number of paragraphs: ' n_para
echo

if [ -z "$n_para" ]
then
	echo 'Number of paragraphs not specified. Generating a single paragraph.'
	echo
fi

if ! [[ "$n_para" =~ ^[+-]?[0-9]+\.?[0-9]*$ ]]
then 
    echo 'Inputs must be a number'
    exit 0 
fi

python3 lorem_ipsum.py $n_para

echo
echo 'Copied to clipboard'
