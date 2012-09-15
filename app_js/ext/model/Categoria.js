Ext.define('FM.model.Categoria', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'idCategoria',
						type : 'int'
					}, {
						name : 'descCategoria',
						type : 'string'
					}, {
						name : 'descCompletaCategoria',
						type : 'string'
					}, {
						name : 'idUsuario',
						type : 'int'
					},{
						name : 'cor',
						type : 'string'
					}],

			idProperty : 'idCategoria',

			associations : [{
						type : 'belongsTo',
						model : 'FM.model.Usuario',
						foreignKey : 'idUsuario',
						getterName : 'getUsuario',
						setterName : 'setUsuario'
					}]
		});