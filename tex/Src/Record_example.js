var recording =
	new vxml.Record('Please record your information after the beep.');

var recordingState = vxml.State.create('getRecording', recording)
	.addOnExitAction(function* (cf, state, event) {
		var recordingDataBuffer = event.data;
		var path = __dirname + '/recordings/recording.wav';

		yield writeFile(recordingDataBuffer, path);
	});
