Ext.define('FM.controller.Portal', {
	extend : 'Ext.app.Controller',

	stores : ['Custos'],

	models : ['Custo', 'Categoria', 'Parcela', 'Usuario'],

	views : ['portal.Portal'],

	refs : [{
				ref : 'portal',
				selector : 'portal'
			}],

	init : function() {
		this.control({
			'#portlet-custos-categoria > gridCustosCategoriaPortlet' : {
				updateGrid : function(obj) {
					this.atualizarGridGastosCategoria(obj);
				}
			},

			'#portlet-entradas-custos-chart > custoEntradaChartPortlet' : {
				updateChart : function(obj) {
					var dtCalendar = Ext.ComponentQuery.query('#cldMesSelecionado')[0];
					var chart = obj.child('chart');
					chart.setLoading(true);
					chart.store.load({
						scope : this,
						params : {
							dataInicial : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getFirstDate()),
							dataFinal : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getLastDate())
						},
						callback : function(obj1, obj2, obj3) {
							obj.updateTitle(dtCalendar.getFormatedDate('F/Y'));
							this.atualizaGridGastosDiario();
							this.atualizaGridEntradas();
							chart.redraw();
							chart.setLoading(false);
						}
					});
				}
			},
			
			'#portlet-gastos-dia > gridCustoDiaportlet button[action=atualizar]' : {
				click : function(button) {
					this.atualizaGridGastosDiario();
				}
			},
			
			'#portlet-entradas-mes > gridEntradasPortlet button[action=atualizar]': {
				click : function(button) {
					this.atualizaGridEntradas();
				}
			},

			'#portlet-custo-categoria-chart > custoCategoriaChartPortlet' : {
				updateChart : function(obj) {
					var dtCalendar = Ext.ComponentQuery.query('#cldMesSelecionado')[0];
					var chart = obj.child('chart');
					chart.setLoading(true);
					chart.store.load({
						scope : this,
						params : {
							dataInicial : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getFirstDate()),
							dataFinal : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getLastDate())
						},
						callback : function(obj1, obj2, obj3) {
							if (Ext.isEmpty(obj.getCategoriaSelecionada()) && obj2.resultSet.count > 0){
								obj.setCategoriaSelecionada(Ext.create(
										'FM.model.Categoria', {
											'idCategoria' : obj2.resultSet.records[0].data.idCategoria,
											'descCategoria' : obj2.resultSet.records[0].data.name
										}));
							}
							
							var maior = 500.00;
							Ext.Array.each(obj1, function(item, i, items) {
							   if(parseFloat(item.data.valor) > maior){
								   maior = parseFloat(item.data.valor);
							   }
							});
							chart.axes.items[0].maximum = (maior+100);
							
							this.atualizarGridGastosCategoria(obj);
							chart.redraw();
							chart.setLoading(false);
						}
					});
				}
			},

			'#portlet-chart-custo-entrada-anual > custoEntradaAnualChartPortlet' : {
				updateChart : function(obj) {
					var dtCalendar = Ext.ComponentQuery
							.query('#cldMesSelecionado')[0];
					var chart = obj.child('chart');
					chart.setLoading(true);

					chart.store.load({
								params : {
									ano : dtCalendar.getFormatedDate('Y')
								},
								callback : function() {
									obj.updateTitle(dtCalendar
											.getFormatedDate('Y'));
									chart.setLoading(false);
								}
							});
				}
			},

			'#cldMesSelecionado' : {
				onBackMonth : function(obj) {
					this.atualizarDashBoard();
				},
				onForwardMonth : function(obj) {
					this.atualizarDashBoard();
				}
			},

			'button[action=logout]' : {
				click : this.logout
			},

			'#menus' : {
				itemclick : function(view, data) {
					switch (data.data.id) {
						case '4' :
							this.abrirTabCategoria();
							break;
						case '6' :
							this.abrirTabCustos();
							break;
						case '5' :
							this.abrirTabReceita();
							break;
						case '3' :
							break;
						default :
							break;
					}
				}
			},

			'#formConfiguracoes button[action=salvar_configuracoes]' : {
				click : function(btn) {
					FM.Ajax.request({
								url : Financial.BASE_PATH
										+ 'configuracao/atualizar',
								params : btn.up('form').getForm().getValues(),
								el : btn.up('form').up().el,
								success : function(data, response) {
									FM.Msg.info2('Informa&ccedil;&atilde;o', 'Configura&ccedil;&otilde;es atualizadas com sucesso!');
								}
							});
				}
			},
			'portal' : {
				'afterrender' : function(obj) {
					FM.Ajax.request({
								url : Financial.BASE_PATH
										+ 'categoria/categoriasUsuario',
								success : function(data, response) {

									Financial.categoriasUsuario = Ext.create(
											'Ext.data.ArrayStore', {
												fields : [{
															name : 'idCategoria',
															type : 'int'
														}, {
															name : 'descCategoria',
															type : 'string'
														}]
											});
									Financial.categoriasUsuario.loadData(data.data);
								}
							});

					// registra o acesso do usuario.
					FM.Ajax.request({
								url : Financial.BASE_PATH
										+ 'usuario/registrarAcesso',
								success : function(data, response) {
									FM.log('Acesso registrado');
								}
							});

					// obtem as configuracoes do usuario, para setar no form.
					FM.Ajax.request({
								url : Financial.BASE_PATH
										+ 'usuario/obter_configuracoes_usuario',
								success : function(data, response) {
									var form = Ext.ComponentQuery.query('#formConfiguracoes')[0];
									form.getForm().setValues(data.data);
									if(data.data.email_antecedente === '0'){
										form.down('numberfield').setDisabled(true);
									}
								}
							});
				}
			}
		});
	},

	atualizarDashBoard : function() {
		var dtCalendar = Ext.ComponentQuery.query('#cldMesSelecionado')[0];
		var chart1 = Ext.ComponentQuery.query('#portlet-entradas-custos-chart > custoEntradaChartPortlet')[0];
		var chart2 = Ext.ComponentQuery.query('#portlet-custo-categoria-chart > custoCategoriaChartPortlet')[0];

		// atualiza o grafico consolidado anual caso tenha trocado de ano
		if (dtCalendar.getFormatedDate('m') == 01 || dtCalendar.getFormatedDate('m') == 12) {
			var chart3 = Ext.ComponentQuery.query('#portlet-chart-custo-entrada-anual > custoEntradaAnualChartPortlet')[0];
			chart3.fireEvent('updateChart', chart3);
		}

		var grid = Ext.ComponentQuery.query('#portlet-gastos-dia > gridCustoDiaportlet')[0];
		var gridEntradas = Ext.ComponentQuery.query('#portlet-entradas-mes > gridEntradasPortlet')[0];
		chart1.fireEvent('updateChart', chart1);
		chart2.fireEvent('updateChart', chart2);
		grid.fireEvent('afterrender', grid);
		gridEntradas.fireEvent('afterrender', gridEntradas);
	},

	atualizarGridGastosCategoria : function(custoCategoriaPanel) {
		var dtCalendar = Ext.ComponentQuery.query('#cldMesSelecionado')[0];
		var gridCustosCategoria = Ext.ComponentQuery.query('#portlet-custos-categoria > gridCustosCategoriaPortlet')[0];
		gridCustosCategoria.store.load({
			params : {
				dataInicial : FM.utils.DateUtils.formatarDataMysql(dtCalendar
						.getFirstDate()),
				dataFinal : FM.utils.DateUtils.formatarDataMysql(dtCalendar
						.getLastDate()),
				idCategoria : custoCategoriaPanel.getCategoriaSelecionada().data.idCategoria
			},
			callback : function() {
				gridCustosCategoria.updateTitle(custoCategoriaPanel.getCategoriaSelecionada().data.descCategoria);
			}
		});
	},

	// atualiza os gatos da grid de custos diario.
	atualizaGridGastosDiario : function(grid) {
		var dtCalendar = Ext.ComponentQuery.query('#cldMesSelecionado')[0];
		if (!grid) {
			grid = Ext.ComponentQuery.query('#portlet-gastos-dia > gridCustoDiaportlet')[0];
		}
		grid.store.load({
					params : {
						data : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getDate())
					},
					callback : function() {
						grid.updateEmptyText(dtCalendar.getFormatedDate('d/m/Y'));
						grid.updateTitle(dtCalendar.getFormatedDate('d/m/Y'));
						grid.getView().refresh();
					}
				});
	},

	// atualiza os valores da grid de entradas.
	atualizaGridEntradas : function(grid) {
		if (!grid) {
			grid = Ext.ComponentQuery.query('#portlet-entradas-mes > gridEntradasPortlet')[0];
		}
		var dtCalendar = Ext.ComponentQuery.query('#cldMesSelecionado')[0];
		grid.store.load({
					params : {
						dataInicial : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getFirstDate()),
						dataFinal : FM.utils.DateUtils.formatarDataMysql(dtCalendar.getLastDate())
					},
					callback : function() {
						grid.updateTitle(dtCalendar.getFormatedDate('F/Y'));
						grid.updateEmptyText(dtCalendar.getFormatedDate('F/Y'));
					}
				});
	},

	abrirTabCustos : function() {
		var tabcustos = Ext.ComponentQuery.query('#tab-custos')[0];
		var tabdash = Ext.ComponentQuery.query('#tabpanel-dash')[0];
		if (!tabcustos) {
			FM.showLoading();
			Ext.defer(function() {
						tabcustos = Ext.create('FM.view.custo.Manter', {
									id : 'tab-custos',
									closable : true
								});
						tabdash.add(tabcustos);
						tabdash.setActiveTab(tabcustos);
						FM.hideLoading();
					}, 100);
		} else {
			tabdash.setActiveTab(tabcustos);
		}
	},
	
	abrirTabCategoria : function() {
		var tabcategoria = Ext.ComponentQuery.query('#tab-categoria')[0];
		var tabdash = Ext.ComponentQuery.query('#tabpanel-dash')[0];
		if (!tabcategoria) {
			FM.showLoading();
			Ext.defer(function() {
						FM.log('Criando a tela de categoria');
						tabcategoria = Ext.create('FM.view.categoria.Manter', {
									id : 'tab-categoria',
									closable : true
								});
						tabdash.add(tabcategoria);
						tabdash.setActiveTab(tabcategoria);
						FM.hideLoading();
					}, 100);
		} else {
			tabdash.setActiveTab(tabcategoria);
		}
	},
	
	abrirTabReceita : function() {
		var tabreceita = Ext.ComponentQuery.query('#tab-receita')[0];
		var tabdash = Ext.ComponentQuery.query('#tabpanel-dash')[0];
		if (!tabreceita) {
			FM.showLoading();
			Ext.defer(function() {
						FM.log('Criando a tela de receita');
						tabreceita = Ext.create('FM.view.receita.Manter', {
									id : 'tab-receita',
									closable : true
								});
						tabdash.add(tabreceita);
						tabdash.setActiveTab(tabreceita);
						FM.hideLoading();
					}, 100);
		} else {
			tabdash.setActiveTab(tabreceita);
		}
	},

	logout : function() {
		FM.log('Saindo');
		
		FM.Ajax.request({
					url : Financial.BASE_PATH + 'usuario/logout',
					el : Ext.getBody(),
					success : function(data, response) {
						FM.showLoading();
						document.location = Financial.BASE_PATH;
					},
					failure : function(data, response) {
						FM.Msg.error(data.message);
					}
				});
	}
});
