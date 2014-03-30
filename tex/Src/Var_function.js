// uvnitr metody create
// predpokladame existanci instancni vlastnosti _age
var confirmInputModel = new Say([
	'You are ',
	new Var(this, function () {
		if (this._age > 25) {
			return 'so many';
		}
		else {
			return this._age;
		}
	}),
	' years old.'
]);
