Ext.define("FM.view.portal.receita.ReceitasAnualWindow",{
					extend : "Ext.Window",
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					modal : true,
					draggable : true,
					resizable : true,
					alias : 'widget.receitasanualwindow',
					width : 800,
					height : 600,
					frame : true,
					bodyPadding : 5,
					title : 'Demononstrativo Anual de Receitas',
					y : 100,

					constructor : function(config) {
						if (config) {
							Ext.applyIf(this, config || {});
						}
						this.callParent(config);
					},

					initComponent : function() {
						this.items = this.buildItems();
						this.callParent();
					},

					buildItems : function() {
						return [
								{
									layout : {
										type : 'vbox',
										align : 'center'
									},
									margin : '0 0 3 0',
									border : false,
									bodyStyle : 'background-color: transparent',
									flex : .5,
									items : [{
										xtype:'container',
										items:[Ext.create('Ext.ux.calendar.YearCalendar', {
											itemId : 'cldAnoSelecionado',
											padding : '7 0 0 0'
										})]
									}]
								},
								{
									flex : 5,
									margin : '0 0 3 0',
									layout : 'fit',
									items : [ {
										xtype : 'chart',
										shadow : true,
										animate : true,
										store : Ext.create('Ext.data.JsonStore', {
											fields : [ {
													name : 'mes'
												}, {
													name : 'valor',
													type : 'float'
												}, {
													name : 'media',
													type : 'float'
												} ],
											scope : this,
											proxy : {
												type : 'ajax',
												url : Financial.BASE_PATH + 'entrada/buscarPorAnoAgrupadosMes',
												reader : {
													type : 'json',
													root : 'data',
													successProperty : 'success'
												}
											}
										}),
										 legend: {
								                position: 'right'
								         },
										axes : [
												{
													type : 'Numeric',
													position : 'left',
													fields : ['valor', 'media'],
													minimum : 0,
													label: {
														renderer: Ext.util.Format.maskRenderer('R$ #9.999.990,00', true)
													}
												},
												{
													type : 'Category',
													position : 'bottom',
													fields : [ 'mes' ],
													label : {
														renderer : function(v) {
															return Ext.String.ellipsis(Ext.Date.monthNames[v-1], 15, false);
														},
														font : '9px Arial',
														rotate : {
															degrees : 320
														}
													}
												} ],
										series : [ {
											type : 'column',
											axis : 'left',
											highlight : true,
											tips: {
					                             trackMouse: true,
					                             width: 140,
					                             height: 28, 
					                             renderer: function(record) {
					                             	Ext.util.Format.TextMask.money = true;
					                               this.setTitle(Ext.Date.monthNames[record.get('mes')-1] + ': '+ Ext.util.Format.TextMask.setMask('R$ #9.999.990,00').mask(record.get('valor')));
					                             }
					                         },
					                         style : {
													fill : '#148D46'
												},
											 renderer: function(sprite, record, atributes, i, store) {
					                        	   atributes.fill = '#148D46'; 
					                               return atributes;
					                         },
											label : {
												contrast : true,
												display : 'insideEnd',
												field : 'valor',
												renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
												color : '#000',
												orientation : 'vertical',
											   'text-anchor' : 'middle'
											},
											xField : 'mes',
											yField : ['valor'],
											listeners: {
					                               'itemmousedown': function(obj, evt){
					                            	   var me = this;
					                            	   me.chart.up('receitasanualwindow').fireEvent('atualizarValores', me.chart.up('receitasanualwindow'), obj);
					                               }
				                             }
										},{
							                type: 'line',
							                highlight: {
							                    size: 7,
							                    radius: 7
							                },
							                axis: 'left',
							                smooth: true,
							                fill: true,
							                fillOpacity: 0.5,
							                markerConfig: {
							                    type: 'circle',
							                    size: 2,
							                    radius: 2,
							                    'stroke-width': 0
							                },
							                style : {
												fill : '#F4F00E'
											},
											tips: {
					                             trackMouse: true,
					                             width: 140,
					                             height: 28, 
					                             renderer: function(record) {
					                             	Ext.util.Format.TextMask.money = true;
					                               this.setTitle('M&eacute;dia: '+ Ext.util.Format.TextMask.setMask('R$ #9.999.990,00').mask(record.get('media')));
					                             }
					                         },
							                xField: 'mes',
							                yField: ['media']
							            }]
									} ]
								}, {
									xtype : 'grid',
									flex : 2,
									title : 'Detalhes de: ',
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
									columns : [ {
										text : 'Descri&ccedil;&atilde;o',
										flex : 3,
										dataIndex : 'descricao'
									}, {
										text : 'Data',
										dataIndex : 'dataEntrada',
										flex : 1,
										renderer : Ext.util.Format.dateRenderer('d/m/Y')
									}, {
										text : 'Valor',
										align : 'right',
										dataIndex : 'valorEntrada',
										renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
										flex : 1
									} ]
								} ];
					}
				});