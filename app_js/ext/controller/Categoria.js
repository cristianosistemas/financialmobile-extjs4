Ext.define('FM.controller.Categoria', {
	extend : 'Ext.app.Controller',

	stores : ['Custos', 'Parcelas', 'QuantidadeParcelas', 'RepeticaoParcelas', 'StatusParcela', 'ParcelaCustoCategoria', 'Categorias'],

	models : ['Custo', 'Categoria', 'Parcela', 'Usuario'],

	views : ['categoria.Manter', 'categoria.ManterWindow'],

	refs : [{
				ref : 'mantercategoria',
				selector : 'mantercategoria'
			}, {
				ref : 'mantercategoriawindow',
				selector : 'mantercategoriawindow'
			}],

	init : function() {
		this.control({
			'mantercategoria gridpanel' : {
				afterrender : this.carregarGrid,
				
				edit : function(editor, obj, eOpts) {
					obj.record.stores[0].sync();
				}
			},
			
			'mantercategoria gridpanel button[action=novo]' : {
				click : function(button) {
					this.getCategoriaManterWindowView().create().show();
				}
			},
			
			'mantercategoria gridpanel button[action=editar]' : {
				click : this.iniciarEdicaoCategoria
			},
			
			'mantercategoria gridpanel button[action=excluir]' : {
				click : this.excluirCategorias
			}
		})
	},
	
	carregarGrid : function(grid){
		grid.getStore().load()
	},
	
	iniciarEdicaoCategoria : function(){
		
	},
	
	excluirCategorias : function(){
		
	}
});
