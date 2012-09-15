Ext.define('FM.view.portal.GridCustosDiaPortlet', {

	extend : 'Ext.grid.Panel',
	alias : 'widget.gridCustoDiaportlet',
	

	initComponent : function() {

		Ext.apply(this, {
			height : 300,
			store : Ext.create('Ext.data.JsonStore', {
				fields : [ {
					name : 'descricaoGasto'
				}, {
					name : 'descCategoria'
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
					url : Financial.BASE_PATH + 'custo/buscarCustosData',
					reader : {
						type : 'json',
						root : 'data',
						successProperty : 'success'
					}
				}
			}),
			stripeRows : true,
			columnLines : true,
			 dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [{
		                tooltip: 'Novo Custo',
		                text: 'Novo Custo',
		                iconCls : 'icone-adicionar',
		                handler : function() {
							winCusto = Ext.create('FM.view.custo.ManterWindow');
							winCusto.show();
						}
		            },{
		                tooltip: 'Atualizar Lista',
		                text: 'Atualizar',
		                iconCls : 'icone-atualizar',
		                action : 'atualizar'
		            }]
		        }],
		        viewConfig : {
					forceFit : true,
					emptyText : '<center>Nenhum gasto para a data '+Ext.ComponentQuery.query('#cldMesSelecionado')[0].getFormatedDate('d/m/Y')+'</center>'
				},
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
				text : 'Categoria',
				flex : 2,
				sortable : true,
				dataIndex : 'descCategoria'
			}, {
				text : 'Parc.',
				flex : 1,
				dataIndex : 'numeroParcela'
			}, {
				text : 'Valor',
				flex : 2,
				dataIndex : 'valorParcela',
				renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
				summaryRenderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
				summaryType: 'sum'
			} ]
		});

		this.callParent(arguments);
	},
	
	updateEmptyText : function(param){
		this.getView().emptyText = '<center>Nenhum gasto para a data: '+param+'</center>';
	},
	
	updateTitle : function(param){
		this.ownerCt.setTitle('Gastos do Dia: '+param);
	}
	
});
