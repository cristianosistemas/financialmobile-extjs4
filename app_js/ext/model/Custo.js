Ext.define('FM.model.Custo', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'idCusto',
						type : 'int'
					}, {
						name : 'descricaoGasto',
						type : 'string'
					}, {
						name : 'idCategoriaGasto',
						type : 'int'
					}, {
						name : 'idUsuario',
						type : 'int'
					}],

			idProperty : 'idCusto',

			associations : [{
						type : 'belongsTo',
						model : 'FM.model.Categoria',
						foreignKey : 'idCategoriaGasto',
						getterName : 'getCategoria',
						setterName : 'setCategoria'
					}, {
						type : 'belongsTo',
						model : 'FM.model.Usuario',
						foreignKey : 'idUsuario',
						getterName : 'getUsuario',
						setterName : 'setUsuario'
					}, {
						type : 'hasMany',
						model : 'FM.model.Parcela',
						name : 'parcelas',
						filterProperty : 'idCusto',
						associationKey : 'parcelas'
					}],
					
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