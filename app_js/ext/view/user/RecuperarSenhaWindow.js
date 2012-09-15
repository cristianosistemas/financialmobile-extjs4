Ext.define("FM.view.user.RecuperarSenhaWindow", {
	extend : "FM.abstract.ModalWindow",
	requires : [ "FM.view.user.RecuperarSenhaForm" ],
	
	alias : 'widget.recuperarsenhawindow',

	width : 280,
	height : 130,
	//modal : true,
	//draggable : true,
	title : 'Recuperar Senha',
	//layout : 'fit',
	//center : true,
	//closable : true,
	//resizable : true,
	//animate : true,
	//border : true,
	//closeAction : 'hide',
	iconCls : 'icone-email-enviar',

	initComponent : function() {
		this.items = this.buildItems();
		this.callParent();
	},

	buildItems : function() {
		return [Ext.create("FM.view.user.RecuperarSenhaForm")];
	},
});