Ext.define("FM.view.categoria.ManterForm", {
	extend : "FM.abstract.Form",
	alias : "widget.manterCategoriaForm",

	initComponent : function() {
		this.items = this.createFields();
		this.fbar = this.createButtons();
		this.callParent();
		this.down('textfield[name=descCategoria]').focus(true, 1000);
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
									name : 'idCategoria',
									itemId : 'idCategoria'
								},{
									fieldLabel : 'Nome',
									name : 'descCategoria',
									itemId : 'descCategoria',
									msgTarget : 'side',
									allowBlank : false
								},{
									fieldLabel : 'Descri&ccedil;&atilde;o',
									name : 'descCompletaCategoria',
									itemId : 'descCompletaCategoria',
									msgTarget : 'side',
									allowBlank : false
								},{
									fieldLabel : 'Cor da Categoria',
									xtype: 'ux.colorpickerfield',
									itemId : 'cor',
									name: 'cor',
									msgTarget : 'side',
									allowBlank : false
								}]
				}];
	}
});