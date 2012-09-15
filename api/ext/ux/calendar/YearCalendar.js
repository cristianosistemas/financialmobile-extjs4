Ext.define("Ext.ux.calendar.YearCalendar", {
	extend : "Ext.container.Container",
	mixins : {
		observable : 'Ext.util.Observable'
	},
	layout : {
		type : 'hbox',
		align : 'center'
	},

	items : [
			{
				xtype : 'button',
				text : '<',
				flex: 2,
				handler : function() {
					var dataSel = Ext.Date.parse(this.up('component').items.get('txData').value, 'Y');
					var dataNew = Ext.Date.add(dataSel, Ext.Date.YEAR, - 1);
					this.up('component').items.get('txData').setValue(Ext.util.Format.date(dataNew, 'Y'));
					this.up('component').fireEvent('onBackYear', this.up('component'));
				}
			},
			{
				xtype : 'textfield',
				name : 'txData',
				itemId : 'txData',
				fieldStyle : 'text-align: center',
				flex: 3,
				readOnly : true
			},
			{
				xtype : 'button',
				text : '>',
				flex : 2,
				handler : function() {
					var dataSel = Ext.Date.parse(this.up('component').items.get('txData').value, 'Y');
					var dataNew = Ext.Date.add(dataSel, Ext.Date.YEAR, 1);
					this.up('component').items.get('txData').setValue(Ext.util.Format.date(dataNew, 'Y'));
					this.up('component').fireEvent('onForwardYear',	this.up('component'));
				}
			} ],

	initComponent : function() {
		if (this.defaultValue) {
			this.items[1].value = Ext.util.Format.date(this.defaultValue, 'Y');
		} else {
			this.items[1].value = Ext.util.Format.date(new Date(), 'Y');
		}
		this.callParent();
	},

	constructor : function(config) {
		Ext.apply(this, config || {});
		this.addEvents({
			"onBackYear" : true,
			"onForwardYear" : true
		});
		this.listeners = config.listeners;
		this.callParent();
	},

	getYear : function() {
		var dataSel = Ext.Date.parse(this.items.get('txData').value, 'Y');
		return dataSel.getFullYear();
	}
});