define(['angular'], function (angular) {
	'use strict';
	
	angular.module('i18n.messages', [])
		.constant('I18N_MESSAGES', {
			// COMMON
			'common.save.success': 'Úspěšně uloženo.',
			'common.save.error': 'Během ukládání došlo k chybě.',
			'common.rows': 'řádků',

			// USERS LIST
			'users.title': 'Spravované účty',
			'users.requestAccess.btn': 'Požádat o přístup',
			'users.newMessages': 'Nové zpávy',
			'users.list.relationName': 'Účet',
			'users.list.agencyStatus': 'Práva',
			'users.list.dayBudget': 'Rozpočet',
			'users.list.credit': 'Kredit',
			'users.list.clicks': 'Prokliky',
			'users.list.impressions': 'Zobrazení',
			'users.list.ctr': 'CTR',
			'users.list.avgCpc': 'CPC Ø',
			'users.list.agencyLimit': 'Cena',
			'users.list.total': 'Celkem',
			'users.edit.btn': 'Upravit',

			// FILTER OPTIONS
			'users.filterOptions.all': 'Všechny připojené účty',
			'users.filterOptions.onlyR': 'Účty jen pro čtení',
			'users.filterOptions.onlyRW': 'Účty pro čtení a zápis',

			// PERIOD OPTIONS
			'users.periodOptions.today': 'dnes',
			'users.periodOptions.yesterday': 'včera',
			'users.periodOptions.week': 'tento týden (po-dnes)',
			'users.periodOptions.lastweek': 'minulý týden (po-ne)',
			'users.periodOptions.last7': 'posledních 7 dnů',
			'users.periodOptions.month': 'tento měsíc',
			'users.periodOptions.lastmonth': 'minulý měsíc',
			'users.periodOptions.last30days': 'posledních 30 dnů',
			'users.periodOptions.year': 'tento rok',
			'users.periodOptions.lastyear': 'minulý rok',
			'users.periodOptions.whole': 'celé období',
			'users.periodOptions.other': 'jiné datum',

			'users.agencyStatus.r': 'Jen pro čtení',
			'users.agencyStatus.rw': 'Čtení a zápis',
			'users.agencyStatus.agencyBinding': 'Agenturní vazba',
			'users.credit.siteBilling': 'Zpětná fakturace',
			'users.credit.agencyBilling': 'Inzerci platí agentura',

			// USERS RequestAccessDialog
			'users.requestAccessDialog.title': 'Žádost o přístup',
			'users.requestAccessDialog.userName.label': 'Účet:',
			'users.requestAccessDialog.access.label': 'Práva:',
			'users.requestAccessDialog.submit.btn': 'Požádat o přístup',

			// USERS EditUserDialog
			'users.editUserDialog.title': 'Úprava propojení',
			'users.editUserDialog.account.label': 'Účet:',
			'users.editUserDialog.name.label': 'Název:',
			'users.editUserDialog.access.label': 'Práva:',
			'users.editUserDialog.access.agencyBinding.option': 'Agenturní vazba',
			'users.editUserDialog.sendNotice.label': 'Zasílat emaily:',
			'users.editUserDialog.agencyLimit.label': 'Měsíční limit:',
			'users.editUserDialog.disconnect.btn': 'Odpojit účet',
			'users.editUserDialog.save.btn': 'Uložit změny'
		});
});