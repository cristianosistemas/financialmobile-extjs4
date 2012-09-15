Ext.define('FM.store.Categorias', {
			extend : 'Ext.data.Store',
			model : 'FM.model.Categoria',
			storeId : 'categoriaStore',

			proxy : {
				type : 'ajax',
				api : {
					read : Financial.BASE_PATH + 'categoria/categoriasUsuarioCompleto',
					create : Financial.BASE_PATH + 'categoria/salvar_atualizar',
					update : Financial.BASE_PATH + 'categoria/salvar_atualizar',
					destroy : Financial.BASE_PATH + 'categoria/delete'
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