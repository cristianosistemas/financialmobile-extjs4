Ext.define('FM.model.Usuario', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'idUsuario',
		type : 'int'
	}, {
		name : 'nomeUsuario',
		type : 'string'
	}, {
		name : 'emailUsuario',
		type : 'string'
	}, {
		name : 'loginUsuario',
		type : 'string'
	}, {
		name : 'senhaUsuario',
		type : 'string'
	}, {
		name : 'ativo',
		type : 'int'
	}, {
		name : 'idPerfil',
		type : 'int'
	} ],

	idProperty : 'idUsuario',

	associations : [{
		type : 'hasMany',
		model : 'FM.model.Custo'
	} ]
});