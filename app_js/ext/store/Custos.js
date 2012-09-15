Ext.define('FM.store.Custos', {
			extend : 'Ext.data.Store',
			model : 'FM.model.Custo',

			proxy : {
				type : 'ajax',
				api : {
					read : Financial.BASE_PATH + 'custo/read',
					create : Financial.BASE_PATH + 'custo/create',
					update : Financial.BASE_PATH + 'custo/update',
					destroy : Financial.BASE_PATH + 'custo/update'
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
			}
		});