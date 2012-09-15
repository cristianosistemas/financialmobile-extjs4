Ext.define('FM.controller.Custo', {
	extend : 'Ext.app.Controller',

	stores : ['Custos', 'Parcelas', 'QuantidadeParcelas', 'RepeticaoParcelas', 'StatusParcela', 'ParcelaCustoCategoria'],

	models : ['Custo', 'Categoria', 'Parcela', 'Usuario'],

	views : ['custo.Manter', 'custo.ManterWindow'],

	cacheConsulta : {},

	refs : [{
				ref : 'mantercusto',
				selector : 'mantercusto'
			}, {
				ref : 'mantercustowindow',
				selector : 'mantercustowindow'
			}],

	init : function() {
		this.control({
					'mantercusto button[action=pesquisar]' : {
						click : this.pesquisar
					},
					
					'mantercusto button[action=limpar]' : {
						click : function(button) {
							button.setDisabled(true);
							var panel = button.up('panel');
							var grid = panel.down('gridpanel');
							var form = panel.down('form').getForm();
							form.reset();
							grid.store.removeAll();
							grid.getView().refresh();
						}
					},

					'mantercusto gridpanel button[action=novo]' : {
						click : function(button) {
							this.getCustoManterWindowView().create().show();
						}
					},
					
					'mantercusto gridpanel button[action=editar]' : {
						click : this.iniciarEdicaoCusto
					},
					
					'mantercusto gridpanel button[action=excluir]' : {
						click : this.excluirCustos
					},

					'mantercusto gridpanel' : {
						edit : function(editor, obj, eOpts) {
							obj.record.stores[0].sync();
						},
						
						select : function(rowModel, record, index, eOpts) {
							rowModel.view.up().down('button[name=excluir]').setDisabled(false);
							if (rowModel.selected.length == 1) {
								rowModel.view.up().down('button[name=editar]').setDisabled(false);
							}else{
								rowModel.view.up().down('button[name=editar]').setDisabled(true);
							}
						},
						
						deselect : function(rowModel, record, index, eOpts) {
							if (rowModel.selected.length == 0) {
								rowModel.view.up().down('button[name=excluir]').setDisabled(true);
								rowModel.view.up().down('button[name=editar]').setDisabled(true);
							} else if(rowModel.selected.length == 0){
								rowModel.view.up().down('button[name=editar]').setDisabled(false);
							}
						},
						
						selectionchange : function(model, selected, eOpts) {
							FM.log('Alteracao de select!');
						}
					},

					'mantercustowindow button[action=gerar_parcelas]' : {
						click : function(button) {
							var panel = button.up('manterCustoForm');
							var fs = button.up('fieldset');
							var win = fs.up('mantercustowindow');
							var grid = panel.down('gridpanel');
							win.setHeight(600);
							grid.show();
							var parcelas = this.gerarParcelas(panel.getForm().getValues());
							grid.store.loadData(parcelas);
						}
					},

					'mantercustowindow button[action=excluir_parcelas]' : {
						click : function(button) {
							var panel = button.up('manterCustoForm');
							var grid = panel.down('gridpanel');
							var selecionados = grid.getSelectionModel().getSelection();

							for (var i in selecionados) {
								//removendo do store
								grid.getStore().remove(selecionados[i]);
								
								//efetivando a remocao no banco
								if(selecionados[i].get('idCusto') > 0){
									FM.Ajax.request({
										url : Financial.BASE_PATH + 'parcela/remove',
										params : {
											idCusto : selecionados[i].get('idCusto'),
											numeroParcela : selecionados[i].get('numeroParcela')
										},
										scope : this,
									    failure: function(response, opts) {
									    	FM.Msg.info('Erro ao efetivar remo&ccedil;&atilde;o: ' + response.message);
									    }
									});
								}
							}
							grid.getView().refresh();
						}
					},

					'mantercustowindow button[action=adicionar_parcela]' : {
						click : function(button) {
							var panel = button.up('manterCustoForm');
							var grid = panel.down('gridpanel');

							parc = grid.getStore().data.items[grid.getStore().getCount()-1];

							grid.getStore().add({
										numeroParcela : parc.get('numeroParcela') + 1,
										dataVencimento : parc.get('dataVencimento'),
										valorParcela : parc.get('valorParcela'),
										idStatus : 1
									});
						}
					},

					'mantercustowindow form #fieldSetParcelas checkbox' : {
						change : function(field, newValue, oldValue) {
							var fs = field.up().up();
							var win = fs.up().up();
							var combo = fs.up().down('combobox[name=idStatus]');
							if (newValue) {
								win.setHeight(420);
								combo.setDisabled(true);
							} else {
								win.setHeight(320);
								fs.down('gridpanel').hide();
								combo.setDisabled(false);
							}
						}
					},

					'mantercustowindow button[action=cadastrar]' : {
						click : function(button) {
							var panel = button.up('manterCustoForm');
							var grid = panel.down('gridpanel');
							
							var checkParcelado = panel.down('checkbox[name=lancamentoParcelado]');

							if (panel.getForm().isValid()) {

								var parametros = panel.getForm().getValues();

								//se for parcelado, monta as parcelas
								if(checkParcelado.getValue()){
									var parcelas = [];
									
									//validando as parcelas
									if(grid.getStore().count() < 1){
										FM.Msg.error('Para custo parcelado &eacute; necess&aacute;rio informar as parcelas.');
										return;
									}
									
									grid.getStore().data.each(function(item, i, l) {
											parcelas.push(item.data);
										});
									parametros['parcelas'] = parcelas;
								}
								
								FM.Ajax.request({
											url : Financial.BASE_PATH + 'custo/salvar_alterar',
											params : {
												custo : Ext.JSON.encode(parametros)
											},
											el : button.up("mantercustowindow").el,
											scope : this,
											success : function(data, response) {
												FM.log('Retorno da funcao de salvar');
												FM.log(data);
												panel.getForm().setValues(data.data);
												
												//se for parcelado recarrega as parcelas
												if(checkParcelado.getValue()){
													grid.getStore().loadData(data.data.parcelas);
												}
												
												if (!Ext.isEmpty(parametros['idCusto'])) {
													successMsg = '';
													//se for alteracao ainda atualiza a grid com apos o valor selecionado.
													this.atualizarGridPesquisa();
													//se for alteracao tambem fecha a janela de edicao.
													panel.up('mantercustowindow').close();
													FM.Msg.info('Altera&ccedil;&atilde;o realizada com sucesso!');
												} else {
													FM.Msg.info('Inclus&atilde;o realizada com sucesso!');
												}
												
												
											}
										});
							}
						}
					},

					'mantercustowindow button[action=cancelar]' : {
						click : function(button) {
							button.up('mantercustowindow').close();
						}
					},

					'mantercustowindow form gridpanel' : {
						select : function(rowModel, record, index, eOpts) {
							rowModel.view.up().down('button[name=btn_excluir]').setDisabled(false);
						},
						deselect : function(rowModel, record, index, eOpts) {
							if (rowModel.selected.length == 0) {
								rowModel.view.up().down('button[name=btn_excluir]').setDisabled(true);
							}
						},
						selectionchange : function(model, selected, eOpts) {
							FM.log('Alteracao de select!');
						},
						edit : function(editor, obj, eOpts) {
							if (!Ext.isEmpty(obj.record.get('idCusto'))	&& (obj.record.get('idCusto') != 0)){
								FM.log('Vamos atualizar a parcela no servidor');
								FM.Ajax.request({
									url : Financial.BASE_PATH + 'parcela/update',
									params : {
										data : Ext.JSON.encode(obj.record.data)
									},
									scope : this,
									success : function(data, response) {
										FM.log('Dizem que foi atualizado com sucesso!');
										obj.record.commit();
									}
								});
							} else {
								obj.record.commit();
							}
							editor.grid.getView().refresh();
						}
					},
					
					'mantercustowindow' : {
						render : function(_this , eOpts){
							if(_this.idCusto){
								var custo = Ext.ModelManager.getModel('FM.model.Custo');
								FM.log(custo);

								
								custo.load(_this.idCusto,{
									success: function(c) {
								        c.parcelas().load(function(records, operation, success){
									        	if(success){
									        		//se possuir muitas parcelas, exibe custo parcelado.
									        		if(records.length > 1){
									        			custoEdit = {};
									        			Ext.applyIf(custoEdit, c.data);
									        			
									        			var form = _this.down('form');
									        			form.getForm().setValues(custoEdit);
									        			
									        			form.down('textfield[name=valorParcela]').setVisible(false);
									        			form.down('combobox[name=idStatus]').setVisible(false);
									        			
									        			var parcelas = [];
		
									        			Ext.Array.each(records, function(it, ind){
									        				parcelas.push(it.data);
									        			});
									        			
									        			var checkParcelado = _this.down('checkbox[name=lancamentoParcelado]');
									        			checkParcelado.setValue(true);
									        			checkParcelado.setDisabled(true);
									        			
									        			var gridParcelas = _this.down('gridpanel');
									        			_this.setHeight(420);
														gridParcelas.show();
														gridParcelas.store.loadData(parcelas);
														
									        			var panelParcelas = gridParcelas.up();
									        			panelParcelas.down('toolbar').setVisible(false);
									        			panelParcelas.down('combobox[name=qtdParcelas]').setVisible(false);
									        			panelParcelas.down('combobox[name=tipoRepeticao]').setVisible(false);
									        			
									        		}else{//senao, exibe o custo sem parcelas.
									        			custoEdit = {};
									        			Ext.applyIf(custoEdit, c.data);
									        			Ext.applyIf(custoEdit, records[0].data);
									        			
									        			var form = _this.down('form');
									        			form.getForm().setValues(custoEdit);
									        			
									        			var checkParcelado = _this.down('checkbox[name=lancamentoParcelado]');
									        			checkParcelado.setDisabled(true);
									        		}
									        	}
								        });
								    }
								});
							}
						}
					}
				});
	},

	//acao de pesquisar
	pesquisar : function(button) {
		var panel = button.up('panel');
		var form = panel.down('form').getForm();
		
		if (form.isValid()) {
			this.cacheConsulta = form.getValues();
			this.getParcelaCustoCategoriaStore().load({
						scope : this,
						params : form.getValues(),
						callback : this.aposConsulta
			});
		}
	},
	
	//atualiza a grid utilizada para pesquisa
	atualizarGridPesquisa : function(){
		var grid = this.getMantercusto().down('gridpanel');
		grid.store.load({
			scope : this,
			params : this.cacheConsulta,
			callback : this.aposConsulta
		});
	},
	
	//funcao executada apos a acao de pesquisar
	aposConsulta : function(obj1, obj2, obj3){
		var custoPanel = this.getMantercusto();
		custoPanel.down('button[action=limpar]').setDisabled(false);
	},
	
	//inicia edicao do custo
	iniciarEdicaoCusto : function(btn){
		FM.log('Iniciando processo de edicao de custo');
		this.getCustoManterWindowView().create({
			idCusto: btn.up('gridpanel').getSelectionModel().selected.getAt(0).get('idCusto')
		}).show();
	},
	
	//exclui os custos
	excluirCustos : function(btn){
		FM.Msg.confirm("Confirma a exclus&atilde;o dos custos selecionados?", function(btnSel, text){
			if(btnSel == 'yes'){
				FM.MaskLoading.showDefault();
				
				var indicesRemover = new Array();
				var parametros = new Array();
				
				btn.up('gridpanel').getSelectionModel().selected.each(function(item, index, lenght){
					indicesRemover.push(item);
					
					if(parametros[item.data.id]){
							parametros[item.data.id].parcelas.push(item.data.numeroParcela);
					}else{
						parametros[item.data.id] = {
							idCusto : item.data.idCusto,
							parcelas : [item.data.numeroParcela]
						};
					}
				});
				
				var custos = new Array();
				
				for(var key in parametros){
					custos.push(parametros[key]);
				}
				
				FM.Ajax.request({
					url : Financial.BASE_PATH + 'custo/excluirCustos',
					params : {
						custos : Ext.JSON.encode(custos)
					},
					scope : this,
					success : function(data, response) {
						btn.up('gridpanel').store.remove(indicesRemover);
						btn.setDisabled(true);
						btn.up().down('button[name=editar]').setDisabled(true);
						FM.MaskLoading.hideDefault();
						FM.Msg.info("Os "+indicesRemover.length+" custos selecionados foram removidos com sucesso!");
					}
				});
			}
		});
	},

	gerarParcelas : function(params) {
		var dtVenc = Ext.Date.parse(params.dataVencimento, 'd/m/Y');
		var status = (FM.utils.DateUtils.getDaysDiff(dtVenc, new Date()) <= 0) ? 1 : 2;
		var retorno = [];
		
		retorno.push({
					numeroParcela : 1,
					dataVencimento : dtVenc,
					valorParcela : params.valorParcela,
					idStatus : status
				});

		var i = 0;
		for (i = 2; i <= params.qtdParcelas; i++) {
			var lastDate = retorno[retorno.length - 1].dataVencimento;
			var dtVencimento = null;
			var status = null;
			
			switch (params.tipoRepeticao) {
				case 1 :// semanas
					dtVencimento = Ext.Date.add(lastDate, Ext.Date.DAY, 7);
					status = (FM.utils.DateUtils.getDaysDiff(dtVencimento, new Date()) <= 0) ? 1 : 2;
					retorno.push({
								numeroParcela : i,
								dataVencimento : dtVencimento,
								valorParcela : params.valorParcela,
								idStatus : status
							});
					break;
				case 2 :// quinzenas
					dtVencimento = Ext.Date.add(lastDate, Ext.Date.DAY, 15);
					status = (FM.utils.DateUtils.getDaysDiff(dtVencimento, new Date()) <= 0) ? 1 : 2;
					retorno.push({
								numeroParcela : i,
								dataVencimento : dtVencimento,
								valorParcela : params.valorParcela,
								idStatus : status
							});
					break;
				case 3 : // meses
					dtVencimento = Ext.Date.add(lastDate, Ext.Date.MONTH, 1);
					status = (FM.utils.DateUtils.getDaysDiff(dtVencimento, new Date()) <= 0) ? 1 : 2;
					retorno.push({
								numeroParcela : i,
								dataVencimento : dtVencimento,
								valorParcela : params.valorParcela,
								idStatus : status
							});
					break;
				case 4 : // bimestres
					dtVencimento = Ext.Date.add(lastDate, Ext.Date.MONTH, 2);
					status = (FM.utils.DateUtils.getDaysDiff(dtVencimento, new Date()) <= 0) ? 1 : 2;
					retorno.push({
								numeroParcela : i,
								dataVencimento : dtVencimento,
								valorParcela : params.valorParcela,
								idStatus : status
							});
					break;
				case 5 : // trimestres
					dtVencimento = Ext.Date.add(lastDate, Ext.Date.MONTH, 3);
					status = (FM.utils.DateUtils.getDaysDiff(dtVencimento, new Date()) <= 0) ? 1 : 2;
					retorno.push({
								numeroParcela : i,
								dataVencimento : dtVencimento,
								valorParcela : params.valorParcela,
								idStatus : status
							});
					break;
				case 6 : // semestres
					dtVencimento = Ext.Date.add(lastDate, Ext.Date.MONTH, 6);
					status = (FM.utils.DateUtils.getDaysDiff(dtVencimento, new Date()) <= 0) ? 1 : 2;
					retorno.push({
								numeroParcela : i,
								dataVencimento : dtVencimento,
								valorParcela : params.valorParcela,
								idStatus : status
							});
					break;
			}
		}
		return retorno;
	}
});
