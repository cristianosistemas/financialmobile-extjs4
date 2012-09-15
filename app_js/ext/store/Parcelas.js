Ext.define('FM.store.Parcelas', {
			extend : 'Ext.data.Store',
			model : 'FM.model.Parcela',

			proxy : {
				type : 'ajax',
				api : {
					read : Financial.BASE_PATH + 'parcela/read',
					create : Financial.BASE_PATH + 'parcela/create',
					update : Financial.BASE_PATH + 'parcela/update',
					destroy : Financial.BASE_PATH + 'parcela/delete',
					pesquisarCustosPorParametros : Financial.BASE_PATH + 'parcela/buscarParcelasCustoCategorias'
				},
				reader : {
					type : 'json',
					root : 'data',
					successProperty : 'success'
				},
				writer : {
					type : 'json',
					writeAllFields : true,
					allowSingle : false,
					root : 'data',
					encode : true
				},
				listeners : {
					exception : FM.Error.proccess
				}
			},
			
			pesquisarCustosPorParametros : function(config){
				config.action = 'pesquisarCustosPorParametros';
				this.load(config);
			}
		});