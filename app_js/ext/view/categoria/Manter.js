Ext.define('FM.view.categoria.Manter', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.mantercategoria',

	initComponent : function() {

		Ext.apply(this, {
			title : 'Manter Categorias de Gastos',
			iconCls : 'icone-pacote',
			layout : {
				type : 'border',
				padding : '5 5 5 5'
			},
			
			items : [{
				xtype : 'gridpanel',
				region : 'center',
				alias : 'widget.categoriaslist',
				margin : '3 0 0 0',
				viewConfig : {
					forceFit: true,
    				showPreview: true,
    				enableRowBody: true,
					emptyText : '<center>Nenhum registro a ser exibido</center>'
				},
				selModel : Ext.create('Ext.selection.CheckboxModel'),
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 2
						})],
				dockedItems : [{
							xtype : 'toolbar',
							items : ['<b>Categorias</b>', '->', {
										text : 'Nova Categoria',
										iconCls : 'icone-adicionar',
										name : 'novo',
										action : 'novo'
									}, '-', {
										text : 'Editar Categoria',
										iconCls : 'icone-editar',
										name : 'editar',
										action: 'editar',
										disabled : true
									}, '-', {
										text : 'Excluir Categoria',
										iconCls : 'icone-excluir',
										name : 'excluir',
										action: 'excluir',
										disabled : true
									}]
						}],
				store : 'Categorias',
				columns : [{
					header : 'C&oacute;digo',
					dataIndex : 'idCategoria',
					flex : 1
				},{
					header : 'Nome',
					dataIndex : 'descCategoria',
					flex : 2,
					editor : {
						xtype : 'textfield'
					}
				},{
					header : 'Descri&ccedil;&atilde;o Completa',
					dataIndex : 'descCompletaCategoria',
					flex : 4,
					editor : {
						xtype : 'textfield'
					}
				},{
					header : 'Cor',
					dataIndex : 'cor',
					flex : 1,
					renderer: function(val){
				        return '<div class="x-grid-cell-inner" style="background-color:#'+val+';">'+val+'</div>';
				    },
					editor : {
						xtype : 'ux.colorpickerfield'
					}
				}]
			}]
		});
		this.callParent(arguments);
	}
});
