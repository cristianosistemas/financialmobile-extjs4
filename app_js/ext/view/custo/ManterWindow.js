Ext.define("FM.view.custo.ManterWindow", {
			extend : "FM.abstract.ModalWindow",
			alternateClassName : 'FM.ManterWindow',
			alias : 'widget.mantercustowindow',
			iconCls : 'icone-dinheiro',
			requires : ['FM.view.custo.ManterForm'],
			width : 530,
			height : 320,
			title : 'Manter Custo',
			y : 100,

			constructor : function(config) {
				if(config){
					Ext.applyIf(this, config || {});
				}
				this.callParent(config);
			},

			initComponent : function() {
				this.items = this.buildItems();
				if(this.idCusto){
					this.title = 'Alterando Custo - '+this.idCusto;
				}
				
				this.callParent();
			},

			buildItems : function() {
				return [Ext.create("FM.view.custo.ManterForm")];
			}
		});