Ext.define('FM.view.portal.GridCustosCategoriaPortlet', {

	extend : 'Ext.grid.Panel',
	alias : 'widget.gridCustosCategoriaPortlet',

	initComponent : function() {

		Ext.apply(this, {
			height : 300,
			store : Ext.create('Ext.data.JsonStore', {
				fields : [ {
					name : 'descricaoGasto'
				}, {
					name : 'dataVencimento',
					type : 'date',
					dateFormat : 'Y-m-d'
				}, {
					name : 'numeroParcela',
					type : 'int'
				}, {
					name : 'valorParcela',
					type : 'float'
				} ],
				scope : this,
				proxy : {
					type : 'ajax',
					url : Financial.BASE_PATH + 'custo/buscarCustosPeriodoPelaCategoria',
					reader : {
						type : 'json',
						root : 'data',
						successProperty : 'success'
					}
				}
			}),
			stripeRows : true,
			columnLines : true,
			features: [{
	            id: 'group',
	            ftype: 'summary',
	            hideGroupedHeader: false,
	            enableGroupingMenu: false
	        }],
			columns : [ {
				text : 'Descri&ccedil;&atilde;o',
				flex : 3,
				sortable : true,
				dataIndex : 'descricaoGasto',
				summaryType: 'count',
	            summaryRenderer: function(value, summaryData, dataIndex) {
	                return ((value === 0 || value > 1) ? '(' + value + ' Custos)' : '(1 Custo)');
	            }
			}, {
				text : 'Vencimento',
				flex : 2,
				dataIndex : 'dataVencimento',
				renderer : Ext.util.Format.dateRenderer('d/m/Y')
			}, {
				text : 'Parc.',
				flex : 1,
				dataIndex : 'numeroParcela'
			}, {
				text : 'Valor',
				flex : 2,
				dataIndex : 'valorParcela',
				summaryType: 'sum',
				renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
				summaryRenderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true)
			} ]
		});
		
	 	this.addEvents({
			"updateGrid" : true
		});

		this.callParent(arguments);
	},
	
	updateTitle : function(param){
		this.ownerCt.setTitle('Custos da categoria: '+param);
	}
});
