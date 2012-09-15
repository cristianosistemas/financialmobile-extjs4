Ext.define('FM.store.StatusParcela', {
			extend : 'Ext.data.ArrayStore',
			storeId : 'storeStatusParcela',
			idIndex : 0,
			autoLoad : true,
			fields : [{
						name : 'id'
					}, {
						name : 'desc'
					}],
			data : [[1, 'Pago'], [2, 'Nao Pago']]
		});