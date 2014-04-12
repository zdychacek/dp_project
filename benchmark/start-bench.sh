#!/bin/bash

outDir=out
outFile=./$outDir/`date "+%H_%M_%S"`
capture_delay=$1
total_calls=$2
concurrent_calls=$3
local_ip=192.168.1.100
remote_ip=192.168.1.112

mkdir $outDir 2> /dev/null
sshpass -p '12345' ssh ondrej@$remote_ip "top -b -d ${capture_delay}" > $outFile.temp &
sudo sipp -sf scenario.xml -s dp $remote_ip -m $total_calls -l $concurrent_calls -i $local_ip -nd -trace_stat -fd $capture_delay 2> ./$outDir/err.log
sshpass -p '12345' ssh ondrej@$remote_ip "killall top"
./parse.js $outFile.temp > $outFile.csv
rm $outFile.temp
