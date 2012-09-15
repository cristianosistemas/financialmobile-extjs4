Ext.define('FM.store.RepeticaoParcelas', {
			extend : 'Ext.data.ArrayStore',
			storeId : 'storeRepeticaoParcela',
			idIndex : 0,
			autoLoad : true,
			fields : [{
						name : 'id'
					}, {
						name : 'desc'
					}],
			data : [[1, 'Semanas'], [2, 'Quinzenas'], [3, 'Meses'],
					[4, 'Bimestres'], [5, 'Trimestrais'], [6, 'Semestres']]
		});