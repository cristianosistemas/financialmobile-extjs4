Ext.define('FM.controller.Receita', {
	extend : 'Ext.app.Controller',

	stores : ['Custos', 'Parcelas', 'QuantidadeParcelas', 'RepeticaoParcelas', 'StatusParcela', 'ParcelaCustoCategoria', 'Receitas'],

	models : ['Custo', 'Categoria', 'Parcela', 'Usuario', 'Entrada'],

	views : ['receita.Manter', 'receita.ManterWindow'],

	refs : [{
				ref : 'manterreceita',
				selector : 'manterreceita'
			}, {
				ref : 'manterreceitawindow',
				selector : 'manterreceitawindow'
			}],

	init : function() {
		FM.log('Inicializando o controller de Receitas');
		
		this.control({
			'manterreceita gridpanel' : {
			
			},
			
			'manterreceita gridpanel button[action=novo]' : {
				click : function(button) {
					this.getReceitaManterWindowView().create().show();
				}
			},
			
			'manterreceita gridpanel button[action=editar]' : {
				click : this.iniciarEdicaoCategoria
			},
			
			'manterreceita gridpanel button[action=excluir]' : {
				click : this.excluirReceitas
			},
			
			'manterreceitawindow button[action=cadastrar]' : {
				click : function(button) {
					var panel = button.up('manterReceitaForm');
					if (panel.getForm().isValid()) {
						var parametros = panel.getForm().getValues();
						
						FM.Ajax.request({
							url : Financial.BASE_PATH + 'entrada/salvar_alterar',
							params : {
								receita : Ext.JSON.encode(parametros)
							},
							el : button.up("manterreceitawindow").el,
							scope : this,
							success : function(data, response) {
								panel.getForm().setValues(data.data);
								if (!Ext.isEmpty(parametros['idEntrada'])) {
									successMsg = '';
									panel.up('manterreceitawindow').close();
									FM.Msg.info('Altera&ccedil;&atilde;o realizada com sucesso!');
								} else {
									FM.Msg.info('Inclus&atilde;o realizada com sucesso!');
								}
							}
						});
					}
				}
			},
		})
	},
	
	iniciarEdicaoCategoria : function(){
		
	},
	
	excluirReceitas : function(){
		
	}
});
