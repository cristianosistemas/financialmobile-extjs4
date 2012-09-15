var timeTest = /^([1-9]|1[0-9]):([0-5][0-9])(\s[a|p]m)$/i;

Ext.apply(Ext.form.field.VTypes, {
			// vtype validation function
			time : function(val, field) {
				return timeTest.test(val);
			},
			// vtype Text property: The error text to display when the
			// validation function returns false
			timeText : 'Not a valid time.  Must be in the format "12:34 PM".',
			// vtype Mask property: The keystroke filter mask
			timeMask : /[\d\s:amp]/i
		});
		
Ext.apply(Ext.form.field.VTypes, {
	dataMenor : function(value, field) {
		if (field.cpDateCompare) {
			var dataFim = Ext.ComponentQuery.query('#'+field.cpDateCompare)[0];
			if(!Ext.isEmpty(dataFim) && !Ext.isEmpty(dataFim.getValue())){
				return ((dataFim.getValue().getTime() - field.getValue().getTime()) >= 0);
			}
		}
		return true;
	},
	dataMenorText : 'Data inicial deve ser menor ou igual a data final'
});

Ext.apply(Ext.form.field.VTypes, {
	dataMaior : function(value, field) {
		if (field.cpDateCompare) {
			var dataInicio = Ext.ComponentQuery.query('#'+field.cpDateCompare)[0];
			if(!Ext.isEmpty(dataInicio) && !Ext.isEmpty(dataInicio.getValue())){
				return ((field.getValue().getTime() - dataInicio.getValue().getTime()) >= 0);
			}
		}
		return true;
	},
	dataMaiorText : 'Data final deve ser maior ou igual a data inicial'
});

Ext.apply(Ext.form.field.VTypes, {
	password : function(value, field) {
		var erroInitial = false;
		var erroLenght = false;
		if (field.initialPasswordField) {
			var pwd = Ext.getCmp(field.initialPasswordField);
			erroInitial = !(value == pwd.getValue());
		}
		erroLenght = !(value.length >= 8);
		
		if(erroInitial){
			this.passwordText = 'Confirma&ccedil;&atilde;o de senha inv&aacute;lida!';
			return false;
		}else if(erroLenght){
			this.passwordText = 'Senha deve conter no m&iacute;nimo 8 caracteres!';
			return false;
		}
		return true;
	},
	passwordText : 'Senha deve conter no m&iacute;nimo 8 caracteres!'
});

