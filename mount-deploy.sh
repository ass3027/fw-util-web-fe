#!/bin/bash

server=lsjin@192.168.50.62
serverPort=2233
feDeployPoint=/home/workspace/fw_cctv_log_monitor/fe/dist

echo $serverPort $server:$feDeployPoint

ssh -p $serverPort $server rm -r $feDeployPoint/*

scp -r -P 2233 ./dist/* $server:$feDeployPoint