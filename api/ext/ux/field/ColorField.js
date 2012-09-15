Ext.define('Ext.ux.field.ColorField', {
	extend: 'Ext.form.field.Trigger',
	alias: 'widget.colorfield',
	triggerTip: 'Selecione uma cor.',
 	onTriggerClick: function() {
	  var me = this;
	  picker = Ext.create('Ext.picker.Color', {
				pickerField: this,
				ownerCt: this,
				renderTo: document.body,
				floating: true,
				hidden: true,
				focusOnShow: true,
				style: {
		            	backgroundColor: "#fff"
		        	} ,
				listeners: {
		            	scope:this,
		            	select: function(field, value, opts){
							me.setValue('#' + value);
							me.inputEl.setStyle({backgroundColor:value});
							picker.hide();
						},
						show: function(field,opts){
							field.getEl().monitorMouseLeave(500, field.hide, field);
						}
					}
				});
       picker.alignTo(me.inputEl, 'tl-bl?');
       picker.show(me.inputEl);
	}
});
