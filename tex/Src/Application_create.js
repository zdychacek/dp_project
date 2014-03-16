Application.create({
	server: appServer,
	route: '/menu-example',
	controller: MenuExampleCtrl,
	config: {
		io: io
	}
});