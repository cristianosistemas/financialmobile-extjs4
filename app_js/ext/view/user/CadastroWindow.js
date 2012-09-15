Ext.define("FM.view.user.CadastroWindow", {
	extend : "FM.abstract.ModalWindow",
	requires : [ "FM.view.user.CadastroForm" ],
	
	alias : 'widget.cadastrarusuariowindow',

	width : 360,
	height : 240,
	//modal : true,
	//draggable : true,
	title : 'Cadastro de Us&aacute;rio',
	//layout : 'fit',
	//center : true,
	//closable : true,
	//resizable : true,
	//animate : true,
	//border : true,
	//closeAction : 'hide',
	iconCls : 'icone-usuario',

	initComponent : function() {
		this.items = this.buildItems();
		this.callParent();
	},

	buildItems : function() {
		return [ Ext.create("FM.view.user.CadastroForm") ];
	}
});