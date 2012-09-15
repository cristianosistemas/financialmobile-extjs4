Ext.define('FM.view.receita.Manter', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.manterreceita',

	initComponent : function() {

		Ext.apply(this, {
			title : 'Manter Receitas',
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
								},{
									fieldLabel : 'Data Inicial',
									name : 'dataInicio',
									anchor : '95%',
									xtype : 'datefield',
									value : Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
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
									fieldLabel : 'Data Final',
									name : 'dataFinal',
									xtype : 'datefield',
									itemId : 'dtFinalManterCusto',
									anchor : '95%',
									value : new Date(),
									cpDateCompare : 'dtInicioManterCusto',
									vtype : 'dataMaior'
								}]
					}]
				}]
			}, {
				xtype : 'gridpanel',
				region : 'center',
				alias : 'widget.receitaList',
				margin : '3 0 0 0',
				viewConfig : {
					forceFit: true,
    				showPreview: true,
    				enableRowBody: true,
					emptyText : '<center>Nenhum registro a ser exibido</center>'
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
							items : ['<b>Receitas</b>', '->', {
										text : 'Nova Receita',
										iconCls : 'icone-adicionar',
										name : 'novo',
										action : 'novo'
									}, '-', {
										text : 'Editar Receita',
										iconCls : 'icone-editar',
										name : 'editar',
										action: 'editar',
										disabled : true
									}, '-', {
										text : 'Excluir Receita(s)',
										iconCls : 'icone-excluir',
										name : 'excluir',
										action: 'excluir',
										disabled : true
									}]
						}],
				store : 'Receitas',
				columns : [{
					header : 'Descri&ccedil;&atilde;o',
					dataIndex : 'descricao',
					flex : 4,
					editor : {
						xtype : 'textfield'
					},
					summaryType : 'count',
					summaryRenderer : function(value, summaryData, dataIndex) {
						return ((value === 0 || value > 1) ? '(' + value
								+ ' Entradas)' : '(1 Entrada)');
					}
				}, {
					header : 'Data',
					dataIndex : 'dataEntrada',
					renderer : Ext.util.Format.dateRenderer('d/m/Y'),
					flex : 1,
					editor : {
						xtype : 'datefield'
					}
				}, {
					header : 'Valor',
					dataIndex : 'valorEntrada',
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
