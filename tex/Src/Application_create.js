Application.create({
	route: '/menu-example',
	controller: MenuExampleCtrl,
	config: {
		io: io
	},
	server: appServer
});
