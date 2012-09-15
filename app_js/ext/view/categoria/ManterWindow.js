Ext.define("FM.view.categoria.ManterWindow", {
			extend : "FM.abstract.ModalWindow",
			alias : 'widget.mantercategoriawindow',
			iconCls : 'icone-pacote',
			requires : ['FM.view.categoria.ManterForm'],
			width : 530,
			height : 230,
			title : 'Manter Categoria',
			y : 100,

			constructor : function(config) {
				if(config){
					Ext.applyIf(this, config || {});
				}
				this.callParent(config);
			},

			initComponent : function() {
				this.items = this.buildItems();
				if(this.idCategoria){
					this.title = 'Alterando Categoria - '+this.idCategoria;
				}
				
				this.callParent();
			},

			buildItems : function() {
				return [Ext.create("FM.view.categoria.ManterForm")];
			}
		});