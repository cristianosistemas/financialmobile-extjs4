Ext.define('FM.store.Receitas', {
			extend : 'Ext.data.Store',
			model : 'FM.model.Entrada',

			proxy : {
				type : 'ajax',
				api : {
					read : Financial.BASE_PATH + 'entrada/read',
					create : Financial.BASE_PATH + 'entrada/create',
					update : Financial.BASE_PATH + 'entrada/update',
					destroy : Financial.BASE_PATH + 'entrada/delete'
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