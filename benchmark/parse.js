#!/usr/bin/node

var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);
var inFile = path.join(__dirname, args[0]);

var rawData = fs.readFileSync(inFile, 'utf8');
var captures = rawData.split('\n\n\n');

var cpuRegExp = /^Cpu\(s\):([^\n]*)$/m;
var memRegExp = /^Mem:([^\n]*)$/m;

var processNames = [
	'asterisk',
	'voiceglue',
	'phoneglue',
	'node',
	'mongod'
];

var header = {
	PID: 0,
	USER: 1,
	PR: 2,
	NI: 3,
	VIRT: 4,
	RES: 5,
	SHR: 6,
	S: 7,
	CPU_PERC: 8,
	MEM_PERC: 9,
	TIME: 10,
	COMMAND: 11
};

function parseCapture (capture) {
	var result = {};
	var captureLines = capture.split(/\n/).slice(6).map(function (line) {
		return line.trim().split(/\s+/);
	}).slice(1);

	captureLines.forEach(function (line) {
		var procName = getFieldFromLine(line, 'COMMAND');

		if (processNames.indexOf(procName) > -1) {
			result[procName] = result[procName] || [];

			// CPU, MEM
			result[procName].push([ parseFloat(getFieldFromLine(line, 'CPU_PERC')) / 100, parseFloat(getFieldFromLine(line, 'MEM_PERC')) / 100 ]);
		}
	});

	// zgrupovani podle nazvu procesu, protoze muze bezet vice instanci stejneho procesu
	for (var processName in result) {
		result[processName] = result[processName].reduce(function (pv, cv) {
			return [ pv[0] + cv[0], pv[1] + cv[1] ];
		}, [ 0, 0 ]);
	}

	// pridani totail info
	result.total = [ parseCPU(capture), parseMem(capture) ];

	return result;
}

function parseCPU (capture) {
	// bez cekani na IO

	//return cpuRegExp.exec(capture)[1].trim().split(/,\s*/).map(function (val) {
	//	return parseFloat(val, 10);
	//}).slice(0, 3).reduce(function (pv, cv) { return pv + cv; }, 0);

	// 100 - idleProc
	return 1 - (parseFloat(cpuRegExp.exec(capture)[1].trim().split(/,\s*/)[3]) / 100);
}

function parseMem (capture) {
	var info = memRegExp.exec(capture)[1].trim().split(/,\s*/).slice(0, 2).map(function (val) {
		return parseFloat(val, 10);
	});

	return info[1] / info[0];
}

function parseProcess (captureLines, name) {
	getFieldFromLine(captureLines[1], 'MEM_PERC')
}

function getFieldFromLine (line, fieldName) {
	return line[header[fieldName]];
}

// zparsovani
covertToCSV(captures.map(function (capture) {
	return parseCapture(capture);
}));

function covertToCSV (results) {
	var header = processNames.concat([]);
	header.unshift('total');

	console.log(header.map(function (headerItem) {
		return [ headerItem + '_cpu', headerItem + '_mem'];
	}).join(','));

	results.forEach(function (item) {
		var orderedItems = [];

		header.forEach(function (headerItem) {
			orderedItems.push(item[headerItem]);
		});

		console.log(orderedItems.join(','));
	});
}
