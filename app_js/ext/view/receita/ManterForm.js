Ext.define("FM.view.receita.ManterForm", {
	extend : "FM.abstract.Form",
	alias : "widget.manterReceitaForm",

	initComponent : function() {
		this.items = this.createFields();
		this.fbar = this.createButtons();
		this.callParent();
		this.down('textfield[name=descricao]').focus(true, 1000);
	},

	createButtons : function() {
		return [{
					text : "Salvar",
					scope : this,
					action : 'cadastrar',
					iconCls : 'icone-salvar',
					width: 90
				}, {
					text : "Cancelar",
					scope : this,
					action : 'cancelar',
					iconCls : 'icone-cancelar',
					width: 90
				}];
	},

	createFields : function() {
		return [{
					xtype : "fieldset",
					title : 'Informa&ccedil;&otilde;es Principais',
					defaultType : "textfield",
						items : [{
									xtype : 'hiddenfield',
									name : 'idEntrada',
									itemId : 'idEntrada'
								}, {
								fieldLabel : 'Descri&ccedil;&atilde;o',
								name : 'descricao',
								itemId : 'descricao',
								msgTarget : 'side',
								allowBlank : false
							}, {
								fieldLabel : 'Data',
								name : 'dataEntrada',
								xtype : 'datefield',
								value : new Date(),
								allowBlank : false
							}, {
								xtype : 'textfield',
								fieldLabel : 'Valor',
								name : 'valorEntrada',
								plugins : 'textmask',
								mask : 'R$ #9.999.990,00',
								money : true,
								allowBlank : false
							}]

				}];
	}
});