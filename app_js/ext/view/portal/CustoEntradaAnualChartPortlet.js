Ext.define('FM.view.portal.CustoEntradaAnualChartPortlet', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.custoEntradaAnualChartPortlet',

	requires : [ 'Ext.data.JsonStore', 'Ext.chart.theme.Base',
			'Ext.chart.series.Series', 'Ext.chart.series.Line',
			'Ext.chart.axis.Numeric' ],

	initComponent : function() {

		Ext.apply(this, {
			layout : 'fit',
			height : 300,
			items : {
				xtype : 'chart',
				alias : 'widget.chartEntradaCustosMes',
				animate : true,
				store : Ext.create('Ext.data.JsonStore', {
					fields : [ 'name', 'valor' ],
					scope : this,
					proxy : {
						type : 'ajax',
						url : Financial.BASE_PATH
								+ 'custo/buscarCustosEntradaAcumuladoAno',
						reader : {
							type : 'json',
							root : 'data',
							successProperty : 'success'
						}
					}
				}),
				gradients : [ {
					'id' : 'v-1',
					'angle' : 0,
					stops : {
						0 : {
							color : 'rgb(212, 40, 40)'
						},
						100 : {
							color : 'rgb(117, 14, 14)'
						}
					}
				}, {
					'id' : 'v-2',
					'angle' : 0,
					stops : {
						0 : {
							color : 'rgb(43, 221, 115)'
						},
						100 : {
							color : 'rgb(14, 117, 56)'
						}
					}
				} ],
				series : [ {
					type : 'pie',
					animate : true,
					angleField : 'valor',
					lengthField : 'valor',
					highlight : {
						segment : {
							margin : 20
						}
					},
					tips : {
						trackMouse : true,
						width : 140,
						height : 28,
						renderer : function(record) {
							this.setTitle(record.get('name')
									+ ': '
									+ Ext.util.Format.TextMask.setMask('R$ #9.999.990,00').mask(record.get('valor')));
						}
					},
					label : {
						field : 'name',
						display : 'rotate',
						font : '14px Arial',
						contrast : true
					},
					style : {
						'stroke-width' : 1,
						'stroke' : '#fff'
					},
					renderer : function(sprite, record, atributes, i, store) {
						if (record.get('name') == 'Receitas') {
							atributes.fill = 'url(#v-2)';
						} else if (record.get('name') == 'Despesas') {
							atributes.fill = 'url(#v-1)';
						}
						return atributes;
					},
					listeners : {
						'itemmousedown' : function(obj, evt) {
							if(obj.storeItem.data.name == 'Receitas'){
								var me = this;
								me.chart.up('custoEntradaAnualChartPortlet').el.mask('Carregando...');
								Ext.require(["FM.view.portal.receita.ReceitasAnualWindow","FM.controller.portal.receita.Receita"], function(){
									Ext.create("FM.view.portal.receita.ReceitasAnualWindow").show();
									me.chart.up('custoEntradaAnualChartPortlet').el.unmask();
								})
							}else if(obj.storeItem.data.name == 'Despesas'){
								var me = this;
								me.chart.up('custoEntradaAnualChartPortlet').el.mask('Carregando...');
								Ext.require(["FM.view.portal.despesa.DespesasAnualWindow","FM.controller.portal.despesa.Despesa"], function(){
									Ext.create("FM.view.portal.despesa.DespesasAnualWindow").show();
									me.chart.up('custoEntradaAnualChartPortlet').el.unmask();
								})
							}
						}
					}
				} ]
			}
		});

		this.addEvents({
			"updateChart" : true
		});

		this.callParent(arguments);
	},
	updateTitle : function(param) {
		this.ownerCt.setTitle('Consolidado de: ' + param);
	}
});
