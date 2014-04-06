#!/bin/bash

outFile=./out/`date "+%H_%M_%S"`
capture_delay=$1
total_calls=$2
concurrent_calls=$3

mkdir out 2> /dev/null
top -b -d $capture_delay > $outFile.temp &
sudo sipp -sf scenario.xml -s dp 127.0.0.1 -m $total_calls -l $concurrent_calls -i 127.0.0.1 -nd -trace_stat -fd $capture_delay 2> ./out/err.log
killall top
./parse.js $outFile.temp > $outFile.csv
rm $outFile.temp
