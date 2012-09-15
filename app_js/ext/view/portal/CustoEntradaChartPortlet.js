Ext.define('FM.view.portal.CustoEntradaChartPortlet', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.custoEntradaChartPortlet',

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
				animate : {
					easing : 'bounceOut',
					duration : 750
				},
				store : Ext.create('Ext.data.JsonStore', {
					fields : [ 'name', 'valor' ],
					scope : this,
					proxy : {
						type : 'ajax',
						url : Financial.BASE_PATH
								+ 'custo/buscarCustosEntradaAcumuladoPeriodo',
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
							color : 'rgb(252, 42, 42)'
						},
						100 : {
							color : 'rgb(181, 27, 27)'
						}
					}
				}, {
					'id' : 'v-2',
					'angle' : 0,
					stops : {
						0 : {
							color : 'rgb(126, 252, 176)'
						},
						100 : {
							color : 'rgb(10, 181, 78)'
						}
					}
				} ],
				axes : [ {
					type : 'Numeric',
					position : 'left',
					fields : [ 'valor' ],
					label : {
						renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true)
					},
					grid : true
					//,minimum : 0
				}, {
					type : 'Category',
					position : 'bottom',
					fields : [ 'name' ]
				} ],
				series : [ {
					type : 'column',
					axis : 'left',
					highlight : true,
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
						display : 'insideEnd', 
						'text-anchor' : 'middle',
						field : 'valor',
						renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
						orientation : 'vertical',
						color : '#333'
					},
					renderer : function(sprite, record, atributes, i, store) {
						if (record.get('name') == 'Receitas') {
							atributes.fill = 'url(#v-2)';
						} else if (record.get('name') == 'Despesas') {
							atributes.fill = 'url(#v-1)';
						}else if (record.get('name') == 'Diferenca') {
							if(record.get('valor') < 0){
								atributes.fill = '#FF8989';
							}else{
								atributes.fill = '#8BFF89';
							}
						}
						return atributes;
					},
					style : {
						opacity : 0.95
					},
					xField : 'name',
					yField : 'valor'
				} ]
			}
		});
		
		this.addEvents({
			"updateChart" : true
		});
		
		this.callParent(arguments);
	},
	updateTitle : function(param){
		this.ownerCt.setTitle('Receitas X Despesas de: '+param);
	}
});
