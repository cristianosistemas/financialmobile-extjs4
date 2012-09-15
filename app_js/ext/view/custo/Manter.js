Ext.define('FM.view.custo.Manter', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.mantercusto',

	initComponent : function() {

		Ext.apply(this, {
			title : 'Manter Despesas',
			iconCls : 'icone-dinheiro-out',
			tbar : [{
						xtype : 'button',
						text : 'Pesquisar',
						iconCls : 'icone-lupa',
						action : 'pesquisar'
					}, {
						xtype : 'button',
						text : 'Limpar',
						iconCls : 'seta-voltar',
						action : 'limpar',
						disabled : true
					}],
			layout : {
				type : 'border',
				padding : '5 5 5 5'
			},

			items : [{
				xtype : 'form',
				bodyStyle : 'padding:5px',
				region : 'north',

				fieldDefaults : {
					labelAlign : 'top',
					msgTarget : 'side'
				},
				defaults : {
					anchor : '100%'
				},
				items : [{
					layout : 'column',
					border : false,
					items : [{
						columnWidth : .2,
						border : false,
						layout : 'anchor',
						defaultType : 'textfield',
						items : [{
									fieldLabel : 'Descri&ccedil;&atilde;o',
									name : 'descricao',
									anchor : '95%'
								}, {
									fieldLabel : 'Data Inicial',
									name : 'dataInicio',
									anchor : '95%',
									xtype : 'datefield',
									value : Ext.Date.add(new Date(),
											Ext.Date.MONTH, -1),
									cpDateCompare : 'dtFinalManterCusto',
									itemId : 'dtInicioManterCusto',
									vtype : 'dataMenor'
								}]
					}, {
						columnWidth : .2,
						border : false,
						layout : 'anchor',
						defaultType : 'textfield',
						items : [{
									id : 'cbCategoriaForm',
									store : Financial.categoriasUsuario,
									displayField : 'descCategoria',
									valueField : 'idCategoria',
									xtype : 'combobox',
									queryMode: 'local',
									anchor : '95%',
									forceSelection : false,
									triggerAction : 'all',
									fieldLabel : 'Categoria',
									name : 'categoria',
									emptyText : 'Selecione...'
								}, {
									fieldLabel : 'Data Final',
									name : 'dataFinal',
									xtype : 'datefield',
									itemId : 'dtFinalManterCusto',
									anchor : '95%',
									value : new Date(),
									cpDateCompare : 'dtInicioManterCusto',
									vtype : 'dataMaior'
								}]
					},{
						columnWidth : .2,
						border : false,
						layout : 'anchor',
						defaultType : 'textfield',
						items:[{
								fieldLabel : 'Status',
								name : 'idStatus',
								anchor : '95%',
								xtype : 'combobox',
								store : 'StatusParcela',
								valueField : 'id',
								displayField : 'desc',
								queryMode : 'local',
								emptyText : 'Selecione...'
						}]
					}]
				}]
			}, {
				xtype : 'gridpanel',
				region : 'center',
				alias : 'widget.custolist',
				margin : '3 0 0 0',
				viewConfig : {
					forceFit: true,
    				showPreview: true,
    				enableRowBody: true,
					emptyText : '<center>Nenhum registro a ser exibido</center>',
				    getRowClass: function(record, rowIndex, rowParams, store){
				        return record.get("idStatus") == 1 ? "" : "row-nao-pago";
				    }
				},
				selModel : Ext.create('Ext.selection.CheckboxModel'),
				features : [{
							id : 'group',
							ftype : 'summary',
							hideGroupedHeader : false,
							enableGroupingMenu : false
						}],
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 2
						})],
				dockedItems : [{
							xtype : 'toolbar',
							items : ['<b>Custos</b>', '->', {
										text : 'Nova Despesa',
										iconCls : 'icone-adicionar',
										name : 'novo',
										action : 'novo'
									}, '-', {
										text : 'Editar Despesa',
										iconCls : 'icone-editar',
										name : 'editar',
										action: 'editar',
										disabled : true
									}, '-', {
										text : 'Excluir Despesa(s)',
										iconCls : 'icone-excluir',
										name : 'excluir',
										action: 'excluir',
										disabled : true
									}]
						}],
				store : 'ParcelaCustoCategoria',
				columns : [{
					header : 'Descri&ccedil;&atilde;o',
					dataIndex : 'descricaoGasto',
					flex : 4,
					editor : {
						xtype : 'textfield'
					},
					summaryType : 'count',
					summaryRenderer : function(value, summaryData, dataIndex) {
						return ((value === 0 || value > 1) ? '(' + value
								+ ' Custos)' : '(1 Custo)');
					}
				},{
					header : 'Categoria',
					dataIndex : 'idCategoriaGasto',
					flex : 2,
					renderer : function(v, meta, record) {
						for (var i in Financial.categoriasUsuario.data.items) {
							if(Financial.categoriasUsuario.data.items[i].get('idCategoria') == record.get('idCategoriaGasto')){
								return Financial.categoriasUsuario.data.items[i].get('descCategoria');
							}
						}
					},
					editor : {
						xtype : 'combobox',
						store : Financial.categoriasUsuario,
						queryMode: 'local',
						valueField : 'idCategoria',
						displayField : 'descCategoria'
					}
				},{
					header : 'Parcela',
					dataIndex : 'numeroParcela',
					flex : 1
				}, {
					header : 'Vencimento',
					dataIndex : 'dataVencimento',
					renderer : Ext.util.Format.dateRenderer('d/m/Y'),
					flex : 1,
					editor : {
						xtype : 'datefield'
					}
				},{
					text : 'Status',
					flex : 1,
					dataIndex : 'idStatus',
					renderer : function(v, meta, record) {
						if (v == 1) {
							return 'Pago';
						} else {
							return 'N&atilde;o Pago';
						}
					},
					editor : {
						xtype : 'combobox',
						store : 'StatusParcela',
						valueField : 'id',
						displayField : 'desc',
						queryMode : 'local'
					}
				},{
					header : 'Valor',
					dataIndex : 'valorParcela',
					summaryType : 'sum',
					renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00',	true),
					summaryRenderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
					flex : 1,
					editor : {
						xtype : 'textfield',
						plugins : 'textmask',
						mask : 'R$ #9.999.990,00',
						money : true
					}
				}]
			}]
		});
		this.callParent(arguments);
	}
});
