Ext.define("FM.abstract.Form",{
	extend 			: "Ext.form.Panel",
	
	columns			: 1,
	border			: false,
	defaultType		: 'textfield',
	fieldDefaults	: {
		labelAlign	: 'left',
		msgTarget	: 'side',
		//width		: 180,
		anchor : '90%',
		labelWidth : 180
	},
	layout			: 'anchor',
	bodyPadding		: 5,
	autoScroll		: true,

	initComponent	: function(){
		this.layout.columns = this.columns;
		this.callParent();
	}
});