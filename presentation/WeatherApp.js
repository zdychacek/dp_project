var vxml = require('../../index'),
	WeatherService = require('./WeatherService');

var WeatherCtrl = vxml.CallFlow.extend({

	constructor: function () {
		WeatherCtrl.super.call(this);
	},

	create: function* () {
		var goodbyeState = vxml.State.create('goodbye', new vxml.Exit('Thank you for using Weather Voice. Goodbye.'));

		var weatherPrompt = new vxml.Prompt([
			'The temperature today is ',
			new vxml.Var(this, 'weather.temp', ' '),
			new vxml.Silence(1000),
			'The conditions are ',
			new vxml.Var(this, 'weather.conditions')
		]);

		var voiceWeatherState = vxml.State.create('voiceWeather', new vxml.Say(weatherPrompt))
			.addTransition('continue', goodbyeState);
			
		var getWeatherState = new vxml.State('getWeather')
			.addOnEntryAction(function* (cf, state, event) {
				var weatherData = yield WeatherService.getWeatherByZipCode(event.data);
				cf.weather = weatherData;
				
				yield cf.fireEvent('continue');
			})
			.addTransition('continue', voiceWeatherState);

		var getZipState = vxml.State.create('getZip',
			new vxml.Ask({
				prompt: 'Enter the five digit zip code for the area where you would like the weather report on.',
				grammar: new vxml.BuiltinGrammar({
					type: 'digits',
					length: 5
				})
			}))
			.addTransition('continue', getWeatherState)

		var greetingState = vxml.State.create('greeting', new vxml.Say('Welcome to Weather Voice.'))
			.addTransition('continue', getZipState);
		
		this
			.addState(greetingState)
			.addState(getZipState)
			.addState(getWeatherState)
			.addState(voiceWeatherState)
			.addState(goodbyeState);
	}
});

module.exports = WeatherCtrl;
