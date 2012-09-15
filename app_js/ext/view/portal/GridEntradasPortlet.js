Ext.define('FM.view.portal.GridEntradasPortlet', {

	extend : 'Ext.grid.Panel',
	alias : 'widget.gridEntradasPortlet',

	initComponent : function() {
		Ext.apply(this, {
			height : 300,
			store : Ext.create('Ext.data.JsonStore', {
				fields : [ {
					name : 'descricao'
				}, {
					name : 'dataEntrada',
					type : 'date',
					dateFormat : 'Y-m-d'
				}, {
					name : 'valorEntrada',
					type : 'float'
				} ],
				scope : this,
				proxy : {
					type : 'ajax',
					url : Financial.BASE_PATH + 'entrada/buscarEntradasPeriodo',
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
	                tooltip: 'Nova Entrada',
	                text: 'Nova Entrada',
	                iconCls : 'icone-adicionar',
	                handler : function() {
	                	winEntrada = Ext.create('FM.view.receita.ManterWindow');
	                	winEntrada.show();
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
				emptyText : '<center>Nenhuma entrada em: '+Ext.ComponentQuery.query('#cldMesSelecionado')[0].getFormatedDate('F/Y')+'</center>'
			},
			features: [{
	            id: 'group',
	            ftype: 'summary',
	            hideGroupedHeader: false,
	            enableGroupingMenu: false
	        }],
			columns : [ {
				text : 'Descri&ccedil;&atilde;o',
				flex : 1,
				sortable : true,
				dataIndex : 'descricao',
				summaryType: 'count',
	            summaryRenderer: function(value, summaryData, dataIndex) {
	                return ((value === 0 || value > 1) ? '(' + value + ' Receitas)' : '(1 Receita)');
	            }
			}, {
				text : 'Data',
				width : 75,
				sortable : true,
				dataIndex : 'dataEntrada',
				renderer: Ext.util.Format.dateRenderer('d/m/Y')
			}, {
				text : 'Valor',
				width : 90,
				dataIndex : 'valorEntrada',
				summaryType: 'sum',
				renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
				summaryRenderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true)
			} ]
		});
		this.callParent(arguments);
	},
	
	updateTitle : function(param){
		this.ownerCt.setTitle('Receitas de: '+param);
	},
	
	updateEmptyText : function(param){
		this.getView().emptyText = '<center>Nenhuma receita em: '+param+'</center>';
	}
});
