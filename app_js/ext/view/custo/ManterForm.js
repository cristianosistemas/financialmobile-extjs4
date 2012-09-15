Ext.define("FM.view.custo.ManterForm", {
	extend : "FM.abstract.Form",
	alias : "widget.manterCustoForm",

	initComponent : function() {
		this.items = this.createFields();
		this.fbar = this.createButtons();
		this.callParent();
		this.down('textfield[name=descricaoGasto]').focus(true, 1000);
	},

	createButtons : function() {
		return [{
					text : "Salvar",
					scope : this,
					action : 'cadastrar',
					iconCls : 'icone-salvar',
					width: 90
				}, {
					text : "Cancelar",
					scope : this,
					action : 'cancelar',
					iconCls : 'icone-cancelar',
					width: 90
				}];
	},

	createFields : function() {
		return [{
					xtype : "fieldset",
					title : 'Informa&ccedil;&otilde;es Principais',
					defaultType : "textfield",
						items : [{
									xtype : 'hiddenfield',
									name : 'idCusto',
									itemId : 'idCusto'
								}, {
								fieldLabel : 'Descri&ccedil;&atilde;o',
								name : 'descricaoGasto',
								itemId : 'descricaoGasto',
								msgTarget : 'side',
								allowBlank : false
							}, {
								fieldLabel : 'Categoria',
								name : 'idCategoriaGasto',
								xtype : 'combobox',
								store : Financial.categoriasUsuario,
								valueField : 'idCategoria',
								displayField : 'descCategoria',
								emptyText : 'Selecione...',
								allowBlank : false,
								queryMode : 'local'
							}, {
								fieldLabel : 'Vencimento',
								name : 'dataVencimento',
								xtype : 'datefield',
								value : new Date(),
								allowBlank : false
							}, {
								xtype : 'textfield',
								fieldLabel : 'Valor',
								name : 'valorParcela',
								plugins : 'textmask',
								mask : 'R$ #9.999.990,00',
								money : true,
								allowBlank : false
							}, {
								fieldLabel : 'Status',
								name : 'idStatus',
								xtype : 'combobox',
								store : 'StatusParcela',
								valueField : 'id',
								displayField : 'desc',
								allowBlank : false,
								queryMode : 'local',
								value : 1
							}]

				}, {
					xtype : "fieldset",
					itemId : 'fieldSetParcelas',
					title : 'Lan&ccedil;amento Parcelado?',
					checkboxName : 'lancamentoParcelado',
					checkboxToggle : true,
					collapsed : true,
					items : [{
						xtype : 'panel',
						border : false,
						bodyPadding : 5,
						layout : 'anchor',
						anchor : '100%',
						dockedItems : [{
									dock : 'top',
									xtype : 'toolbar',
									items : [{
												tooltip : 'Gerar Parcelas',
												text : 'Gerar Parcelas',
												iconCls : 'icone-reload2',
												action : 'gerar_parcelas'
											}]
								}],
						items : [{
									xtype : 'combobox',
									fieldLabel : 'Quantidade Parcelas',
									store : 'QuantidadeParcelas',
									displayField : 'parcela',
									valueField : 'parcela',
									queryMode : 'local',
									triggerAction : 'all',
									hiddenName : 'qtdParcelas',
									valueField : 'parcela',
									forceSelection : true,
									name : 'qtdParcelas',
									value : 12,
									anchor : '80%'
								}, {
									xtype : 'combobox',
									fieldLabel : 'Tipo Repeti&ccedil;&atilde;o',
									store : 'RepeticaoParcelas',
									displayField : 'desc',
									valueField : 'id',
									queryMode : 'local',
									triggerAction : 'all',
									hiddenName : 'tipoRepeticao',
									valueField : 'id',
									forceSelection : true,
									name : 'tipoRepeticao',
									allowBlank : false,
									value : 3,
									anchor : '80%'
								}, {
									xtype : 'gridpanel',
									store : Ext.create('Ext.data.ArrayStore', {
												fields : [{
															name : 'idCusto',
															type : 'int'
														}, {
															name : 'numeroParcela',
															type : 'int'
														}, {
															name : 'dataVencimento',
															type : 'date'
														}, {
															name : 'valorParcela',
															type : 'float'
														}, {
															name : 'idStatus',
															type : 'int'
														}]
											}),
									columnLines : true,
									sortableColumns : false,
									hidden : true,
									autoScroll : true,
									height : 180,
									selModel : Ext
											.create('Ext.selection.CheckboxModel'),
									dockedItems : [{
										xtype : 'toolbar',
										items : ['<b>Parcelas</b>', '->', {
													text : 'Adicionar Parcela',
													iconCls : 'icone-adicionar',
													name : 'btn_adicionar',
													action : 'adicionar_parcela'
												}, '-', {
													text : 'Excluir Parcela(s)',
													iconCls : 'icone-excluir',
													action : 'excluir_parcelas',
													name : 'btn_excluir',
													disabled : true
												}]
									}],
									viewConfig : {
										forceFit : true,
										emptyText : '<center>Nenhuma parcela gerada</center>'
									},
									features : [{
												id : 'group',
												ftype : 'summary',
												hideGroupedHeader : false,
												enableGroupingMenu : false
											}],
									plugins : [Ext.create(
											'Ext.grid.plugin.CellEditing', {
												clicksToEdit : 2
											})],
									columns : [{
										text : 'Parcela',
										flex : 2,
										dataIndex : 'numeroParcela',
										summaryType : 'count',
										summaryRenderer : function(value,
												summaryData, dataIndex) {
											return ((value === 0 || value > 1)
													? '(' + value
															+ ' Parcelas)'
													: '(1 Parcela)');
										}
									}, {
										text : 'Vencimento',
										flex : 2,
										dataIndex : 'dataVencimento',
										renderer : Ext.util.Format
												.dateRenderer('d/m/Y'),
										editor : {
											xtype : 'datefield'
										}
									}, {
										text : 'Status',
										flex : 2,
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
									}, {
										text : 'Valor',
										flex : 2,
										dataIndex : 'valorParcela',
										renderer : Ext.util.Format
												.maskRenderer(
														'R$ #9.999.990,00',
														true),
										summaryType : 'sum',
										summaryRenderer : Ext.util.Format
												.maskRenderer(
														'R$ #9.999.990,00',
														true),
										editor : {
											xtype : 'textfield',
											plugins : 'textmask',
											mask : 'R$ #9.999.990,00',
											money : true
										}
									}]

								}]
					}]
				}];
	}
});