Ext.define("FM.view.user.RecuperarSenhaForm", {
	extend : "FM.abstract.Form",
	alias : "widget.recuperarSenhaForm",

	initComponent : function() {
		this.items = this.createFields();
		this.fbar = this.createButtons();
		this.callParent();
	},

	createButtons : function() {
		return [ {
			text : 'Recuperar Senha',
			action : 'recuperarSenha',
			iconCls : 'icone-email-enviar',
			scope : this
		} ];
	},

	createFields : function() {
		return [ {
			xtype : "fieldcontainer",
			defaultType : "textfield",
			items : [ {
				fieldLabel : 'Email',
				name : 'email',
				allowBlank : false,
				id : 'email',
				vtype : 'email'
			} ]
		} ];
	}
});