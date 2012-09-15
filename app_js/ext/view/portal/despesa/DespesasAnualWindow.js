Ext.define("FM.view.portal.despesa.DespesasAnualWindow",{
					extend : "Ext.Window",
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					modal : true,
					draggable : true,
					resizable : true,
					alias : 'widget.despesasanualwindow',
					width : 800,
					height : 600,
					frame : true,
					bodyPadding : 5,
					title : 'Demononstrativo Anual de Despesas',
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
						
						var campos = [{name: 'mes'}, {name: 'valor', type: 'float'}];
						var campos2 = [];
						
						Financial.categoriasUsuario.each(function(item, idx, tam){
							campos.push({name: item.data.descCategoria, type: 'float'});
							campos2.push(item.data.descCategoria);
						});
											
						var chartStore = Ext.create('Ext.data.JsonStore', {
							fields : campos,
							scope : this,
							proxy : {
								type : 'ajax',
								url : Financial.BASE_PATH + 'custo/buscarCustosAnoAgrupadoMesCategoria',
								reader : {
									type : 'json',
									root : 'data',
									successProperty : 'success'
								}
							}
						});
						
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
										store : chartStore,
										axes : [
												{
													type : 'Numeric',
													position : 'left',
													fields : campos2,
													minimum : 0,
													title: false,
									                grid: true,
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
											gutter: 80,
											xField : 'mes',
											yField : campos2,
											stacked: true,
											label : {
												contrast : true,
												display : 'insideEnd',
												field : 'valor',
												renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
												color : '#000',
												font: '15px Helvetica, sans-serif',
												orientation : 'vertical',
											   //'text-anchor' : 'middle'
											},
											listeners: {
					                               'itemmousedown': function(obj, evt){
					                            	   var me = this;
					                            	   me.chart.up('despesasanualwindow').fireEvent('atualizarValores', me.chart.up('despesasanualwindow'), obj);
					                               }
				                             }
										}]
									} ]
								}, {
									xtype : 'grid',
									flex : 2,
									title : 'Detalhes',
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
									columns : [ {
										text : 'Descri&ccedil;&atilde;o',
										flex : 3,
										sortable : true,
										dataIndex : 'descricaoGasto'
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
										renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true)
									} ]
								} ];
					}
				});