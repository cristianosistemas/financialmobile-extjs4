Ext.define("FM.view.receita.ManterWindow", {
			extend : "FM.abstract.ModalWindow",
			alternateClassName : 'FM.ManterReceitaWindow',
			alias : 'widget.manterreceitawindow',
			iconCls : 'icone-dinheiro',
			requires : ['FM.view.receita.ManterForm'],
			width : 530,
			height : 250,
			title : 'Manter Receita',
			y : 100,

			constructor : function(config) {
				if(config){
					Ext.applyIf(this, config || {});
				}
				this.callParent(config);
			},

			initComponent : function() {
				this.items = this.buildItems();
				if(this.idReceita){
					this.title = 'Alterando Receita - '+this.idReceita;
				}
				this.callParent();
			},

			buildItems : function() {
				return [Ext.create("FM.view.receita.ManterForm")];
			}
		});