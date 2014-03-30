var recording =
	new vxml.Record('Record your message after the beep.');

// NEBO

var recording =
	new vxml.Record({
		prompt: 'Record your message after the beep.',
		maxTime: 60,
		beep: true,
		finalSilence: '2500ms',
		type: 'audio/wav'
	});

var recordingState = vxml.State.create('getRecording', recording)
	.addOnExitAction(function* (cf, state, event) {
		var recordingDataBuffer = event.data;
		var path = __dirname + '/recordings/recording.wav';

		yield writeFile(recordingDataBuffer, path);
	});
