Ext.define('FM.view.portal.Portal', {

	extend : 'Ext.container.Viewport',

	alias : 'widget.portal',

	requires : ['Ext.ux.portal.Portlet', 'Ext.ux.portal.PortalPanel', 'Ext.ux.portal.PortalColumn', 'Ext.ux.portal.PortalDropZone',
				'FM.view.portal.GridCustosDiaPortlet', 'FM.view.portal.CustoEntradaAnualChartPortlet',
				'FM.view.portal.CustoEntradaChartPortlet', 'FM.view.portal.CustoEntradaChartPortlet',
				'FM.view.portal.GridEntradasPortlet', 'FM.view.portal.CustoCategoriaChartPortlet',
				'FM.view.portal.GridCustosCategoriaPortlet'],

	initComponent : function() {
		Ext.apply(this, {
			itemId : 'app-viewport',
			layout : {
				type : 'border',
				padding : '0 5 5 5'
			},
			items : [{
						xtype : 'container',
						region : 'north',
						height : 42,
						layout : 'column',
						autoScroll : false,
						items : [{
									xtype : 'box',
									id : 'app-header',
									html : 'Financial Mobile',
									columnWidth : 0.40
								},
								Ext.create('Ext.ux.calendar.MonthCalendar', {
											id : 'cldMesSelecionado',
											columnWidth : 0.20,
											height : 42,
											padding : '10 0 0 0'
										}), {
									xtype : 'container',
									columnWidth : 0.40,
									items : [{
												xtype : 'button',
												text : 'Sair',
												iconCls : 'porta-fora',
												height : 40,
												action : 'logout',
												style : {
													float : 'right'
												}
											}]
								}]
					}, {
						id : 'app-options',
						title : 'Op&ccedil;&otilde;es',
						region : 'west',
						animCollapse : true,
						width : 200,
						minWidth : 150,
						maxWidth : 400,
						split : true,
						collapsible : true,
						layout : 'accordion',
						layoutConfig : {
							animate : true
						},
						items : [{
							title : 'Cadastros',
							autoScroll : true,
							border : false,
							iconCls : 'icone-software-update',
							items : [Ext.create('Ext.tree.Panel', {
										id : 'menus',
										store : Ext.create(
												'Ext.data.TreeStore', {
													proxy : {
														type : 'ajax',
														url : Financial.BASE_PATH + 'usuario/getMenus',
														reader : {
															type : 'json',
															root : 'data',
															successProperty : 'success'
														}
													}
												}),
										hideHeaders : true,
										rootVisible : false,
										height : 250,
										bodyBorder : false,
										bodyStyle : 'border-style: none'
									})]
						}, {
							title : 'Configura&ccedil;&otilde;es',
							iconCls : 'icone-configuracoes',
							items : [{
								id : 'formConfiguracoes',
								bodyPadding : 5,
								layout : 'anchor',
								xtype : 'form',
								border : false,
								autoScroll : true,
								dockedItems : [{
									xtype : 'toolbar',
									dock : 'top',
									items : ['->', {
												text : "Salvar",
												scope : this,
												action : 'salvar_configuracoes',
												iconCls : 'icone-salvar'
											}]
								}],
								items : [{
											fieldLabel : 'Formato Email',
											name : 'formato_email',
											id : 'formato_email',
											xtype : 'combobox',
											anchor : '100%',
											store : Ext.create(
													'Ext.data.ArrayStore', {
														autoLoad : true,
														idIndex : 0,
														fields : [{
																	name : 'valor'
																}],
														data : [['html'],
																['texto']]
													}),
											valueField : 'valor',
											displayField : 'valor',
											queryMode : 'local'
										}, {
											boxLabel : 'Aviso parcelas atrazadas?',
											name : 'email_atrazados',
											id : 'email_atrazados',
											xtype : 'checkbox',
											anchor : '100%'
										}, {
											boxLabel : 'Aviso dias antes do vencimento?',
											name : 'email_anteceden',
											id : 'email_anteceden',
											xtype : 'checkbox',
											anchor : '100%',
											listeners : {
												'change' : function(field, newValue, oldValue) {
													var panel = field.up();
													if (newValue) {
														panel.down('numberfield').setDisabled(false);
													} else {
														panel.down('numberfield').setDisabled(true);
													}
												}
											}
										}, {
											fieldLabel : 'Qtde dias anterior vencimento',
											xtype : 'numberfield',
											name : 'dias_antecedenc',
											id : 'dias_antecedenc',
											minValue : 1,
											maxValue : 30,
											anchor : '100%'
										}]
							}]
						}
						
						//TODO: Esse modulo de compartilhamento fica fora por enquanto, vai dar 
						//mto trabalho construi-lo agora.
						/*,{
							title : 'Compartilhamento',
							iconCls : 'icone-social',
							layout : 'fit',
							items : [{
								xtype : 'panel',
								layout : 'accordion',
								border : false,
								autoScroll : true,
								items : [{
									title : 'Compartilhados com você',
									xtype : 'panel',
									layout : 'fit',
									items : {
										xtype : 'gridpanel',
										store : Ext.create(
												'Ext.data.JsonStore', {
													fields : [{
																name : 'ativo',
																type : 'boolean'
															}, {
																name : 'nomeUsuario'
															}, {
																name : 'tipoAcesso'
															}],
													scope : this,
													autoLoad : true,
													proxy : {
														type : 'ajax',
														url : Financial.BASE_PATH
																+ 'usuario/get_usuarios_compartilhadores',
														reader : {
															type : 'json',
															root : 'data',
															successProperty : 'success'
														}
													}
												}),
										stripeRows : true,
										columnLines : true,
										columns : [{
													xtype : 'checkcolumn',
													text : '',
													dataIndex : 'ativo',
													flex : 1
												}, {
													text : 'Usuário',
													dataIndex : 'nomeUsuario',
													flex : 3
												}, {
													text : 'Acesso',
													dataIndex : 'tipoAcesso',
													renderer : function(value) {
														if (value === 'w') {
															return 'Completo';
														}
														return 'Visualização';
													},
													flex : 2
												}]
									}
								}, {
									title : 'Compartilhados por voc&ecirc;',
									xtype : 'panel',
									html : 'empty pane'
								}]
							}]
						}*/
						]
					}, {
						id : 'tabpanel-dash',
						xtype : 'tabpanel',
						region : 'center',
						resizeTabs : true,
						enableTabScroll : true,
						defaults : {
							autoScroll : true,
							bodyPadding : 2
						},
						items : [{
							title : 'Painel Geral',
							iconCls : 'icone-dashboard',
							layout : 'border',
							items : [{
								id : 'app-portal',
								xtype : 'portalpanel',
								region : 'center',
								items : [{
									id : 'col-1',
									items : [{
										id : 'portlet-gastos-dia',
										title : 'Despesas do Dia: '	+ Ext.ComponentQuery.query('#cldMesSelecionado')[0].getFormatedDate('d/m/Y'),
										closable : false,
										collapsible : true,
										items : Ext.create('FM.view.portal.GridCustosDiaPortlet')
									}, {
										id : 'portlet-chart-custo-entrada-anual',
										title : 'Consolidado de: ' + Ext.ComponentQuery.query('#cldMesSelecionado')[0].getFormatedDate('Y'),
										closable : false,
										collapsible : true,
										items : Ext
												.create(
														'FM.view.portal.CustoEntradaAnualChartPortlet',
														{
															listeners : {
																'afterrender' : function(obj) {
																	this.fireEvent('updateChart', this);
																}
															}
														})
									}]
								}, {
									id : 'col-2',
									items : [{
										id : 'portlet-entradas-custos-chart',
										closable : false,
										collapsible : true,
										title : 'Receitas X Despesas de: '
												+ Ext.ComponentQuery
														.query('#cldMesSelecionado')[0]
														.getFormatedDate('F/Y'),
										items : Ext.create('FM.view.portal.CustoEntradaChartPortlet',{
															listeners : {
																'afterrender' : function(obj) {
																	this.fireEvent('updateChart',this);
																}
															}
														})
									}, {
										id : 'portlet-entradas-mes',
										closable : false,
										collapsible : true,
										title : 'Receitas de: '	+ Ext.ComponentQuery.query('#cldMesSelecionado')[0].getFormatedDate('F/Y'),
										items : Ext.create('FM.view.portal.GridEntradasPortlet')
									}]
								}, {
									id : 'col-3',
									items : [{
										id : 'portlet-custo-categoria-chart',
										closable : false,
										collapsible : true,
										title : 'Despesas x Categoria',
										items : Ext
												.create(
														'FM.view.portal.CustoCategoriaChartPortlet',
														{
															listeners : {
																'afterrender' : function(
																		obj) {
																	this
																			.fireEvent(
																					'updateChart',
																					this);
																}
															}
														})
									}, {
										id : 'portlet-custos-categoria',
										closable : false,
										collapsible : true,
										title : 'Despesas da categoria: ',
										items : Ext.create('FM.view.portal.GridCustosCategoriaPortlet')
									}]
								}]
							}]
						}]
					}]
		});
		this.callParent(arguments);
	}
});
