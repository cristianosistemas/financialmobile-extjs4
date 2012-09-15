Ext.define('FM.model.Entrada', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'idEntrada',
						type : 'int'
					},{
						name : 'descricao',
						type : 'string'
					},{
						name : 'dataEntrada',
						type : 'date',
						dateFormat : 'Y-m-d'
					},{
						name : 'idUsuario',
						type : 'int'
					},{
						name : 'valorEntrada',
						type : 'float'
					}],

			idProperty : 'idEntrada',

			associations : [{
						type : 'belongsTo',
						model : 'FM.model.Usuario',
						foreignKey : 'idUsuario',
						getterName : 'getUsuario',
						setterName : 'setUsuario'
					}]
		});