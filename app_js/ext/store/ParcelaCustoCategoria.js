Ext.define('FM.store.ParcelaCustoCategoria', {
			extend : 'Ext.data.Store',
			autoSave : false,
			fields : [{
				name : 'id',
				type : 'string',
				convert : function(value, record) {
					return record.get('idCusto') + '-'
							+ record.get('numeroParcela');
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
			}, {
				name : 'descricaoGasto'
			}, {
				name : 'idCategoriaGasto',
				type : 'int'
			}, {
				name : 'idUsuario',
				type : 'int'
			}],

			proxy : {
				type : 'ajax',
				api : {
					read : Financial.BASE_PATH + 'parcela/buscarParcelasCustoCategorias',
					update : Financial.BASE_PATH + 'parcela/atualizar'
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