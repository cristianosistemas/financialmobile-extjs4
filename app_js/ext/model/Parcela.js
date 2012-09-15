Ext.define('FM.model.Parcela', {
			extend : 'Ext.data.Model',
			fields : [{
				name : 'id',
				type : 'string',
				convert : function(value, record) {
					return record.get('idCusto') + '-'+ record.get('numeroParcela');
				}
			}, {
				name : 'idCusto',
				type : 'int'
			}, {
				name : 'numeroParcela',
				type : 'int'
			}, {
				name : 'dataVencimento',
				type : 'date',
				dateFormat : 'Y-m-d'
			}, {
				name : 'valorParcela',
				type : 'float'
			}, {
				name : 'idStatus',
				type : 'int'
			}],

			idProperty : 'id',

			associations : [{
						type : 'belongsTo',
						model : 'FM.model.Custo',
						foreignKey : 'idCusto',
						associationKey: 'custo',
						getterName: 'getCusto',
						setterName: 'setCusto'
					}],

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
		});