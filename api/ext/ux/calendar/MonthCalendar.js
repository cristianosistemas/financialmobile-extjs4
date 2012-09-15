Ext.define("Ext.ux.calendar.MonthCalendar", {
	extend : "Ext.container.Container",
	mixins : {
		observable : 'Ext.util.Observable'
	},
	layout : 'column',
	
	items : [
			{
				xtype : 'button',
				text : '<',
				columnWidth : 0.20,
				handler : function() {
					var dataSel = Ext.Date.parse(this.up('component').items.get('txData').value, 'F/Y');
					var dataNew = Ext.Date.add(dataSel, Ext.Date.MONTH, -1);
					this.up('component').items.get('txData').setValue(Ext.util.Format.date(dataNew, 'F/Y'));
					this.up('component').fireEvent('onBackMonth', this.up('component'));
				}
			},
			{
				xtype : 'textfield',
				name : 'txData',
				id : 'txData',
				fieldStyle : 'text-align: center',
				columnWidth : 0.60,
				readOnly : true
			},
			{
				xtype : 'button',
				text : '>',
				columnWidth : 0.20,
				handler : function() {
					var dataSel = Ext.Date.parse(this.up('component').items.get('txData').value, 'F/Y');
					var dataNew = Ext.Date.add(dataSel, Ext.Date.MONTH, 1);
					this.up('component').items.get('txData').setValue(Ext.util.Format.date(dataNew, 'F/Y'));
					this.up('component').fireEvent('onForwardMonth', this.up('component'));
				}
			} ],

	initComponent : function() {
		if (this.defaultValue) {
			this.items[1].value = Ext.util.Format.date(this.defaultValue, 'F/Y');
		} else {
			this.items[1].value = Ext.util.Format.date(new Date(), 'F/Y');
		}
		this.callParent();
	},

	constructor : function(config) {
		Ext.apply(this, config || {});
		this.addEvents({
			"onBackMonth" : true,
			"onForwardMonth" : true
		});
		this.listeners = config.listeners;
		this.callParent();
	},

	getFirstDate : function() {
		var dataSel = Ext.Date.parse(this.items.get('txData').value, 'F/Y');
		return Ext.Date.getFirstDateOfMonth(dataSel);
	},

	getLastDate : function() {
		var dataSel = Ext.Date.parse(this.items.get('txData').value, 'F/Y');
		return Ext.Date.getLastDateOfMonth(dataSel);
	},
	
	getDate : function() {
		var dataSel = Ext.Date.parse(this.items.get('txData').value, 'F/Y');
		return dataSel;
	},
	getFormatedDate : function(format){
		var dataSel = Ext.Date.parse(this.items.get('txData').value, 'F/Y');
		return Ext.Date.format(dataSel, format);
	}
});