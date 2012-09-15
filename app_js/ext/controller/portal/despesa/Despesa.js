Ext.define('FM.controller.portal.despesa.Despesa', {
	extend : 'Ext.app.Controller',

	stores : [ 'Custos' ],

	models : [ 'Custo', 'Categoria', 'Parcela', 'Usuario' ],

	views : [ 'portal.despesa.DespesasAnualWindow' ],

	refs : [ {
		ref : 'despesasanualwindow',
		selector : 'despesasanualwindow'
	} ],

	init : function() {
		console.log('Inicializando controller de despesa de custo');
		
		this.control({
			
			'despesasanualwindow' : {
				'afterrender' : function(win, evt) {
					this.atualizarDados(win);
				
				},
				'atualizarValores' : function(win, obj){
					this.atualizarGrid(win, obj.storeItem.data.mes, obj.yField, win.down('#cldAnoSelecionado').getYear());
				},
			},
			
			'despesasanualwindow #cldAnoSelecionado':{
				'onBackYear': function(){
					this.atualizarDados();
					
				},
				'onForwardYear': function(){
					this.atualizarDados();
				}
			}
		});
	},
	
	atualizarDados : function(win){
		
		if(!win){
			win = this.getDespesasanualwindow();
		}
		
		var dtCalendar = win.down('#cldAnoSelecionado');
		var chart = win.down('chart');

		chart.setLoading(true);
		chart.store.load({
			scope : this,
			params : {
				ano : dtCalendar.getYear()
			},
			callback : function(obj1, obj2, obj3) {
				chart.setLoading(false);
				if(obj1 && obj1.length){
					var ano = dtCalendar.getYear();
					var mes = parseInt(obj1[0].data.mes);
					var categoria = '';
					Financial.categoriasUsuario.each(function(item, idx, tam){
						if(obj1[0].data[item.data.descCategoria] > 0){
							categoria = item.data.descCategoria;
						}
					});
					
					this.atualizarGrid(win, mes, categoria, ano);
				}
			}
		});
		
		
	},
	
	atualizarGrid : function(win, mes, categoria, ano){
		
		var data = Ext.Date.parse(mes+'/'+ano, "n/Y");
		var grid = win.down('grid');
		grid.setTitle('Detalhes do m&ecirc;s '+Ext.Date.monthNames[mes-1]+'/'+ano +' para a categoria '+categoria);
		
		var idCategoria = null;
		
		Financial.categoriasUsuario.each(function(item, idx, tam){
			if(item.data.descCategoria == categoria){
				idCategoria = item.data.idCategoria;
			}
		});
		
		grid.store.load({
			params : {
				dataInicial : FM.utils.DateUtils.formatarDataMysql(Ext.Date.getFirstDateOfMonth(data)),
				dataFinal : FM.utils.DateUtils.formatarDataMysql(Ext.Date.getLastDateOfMonth(data)),
				idCategoria : idCategoria
			},
			callback : function() {
			}
		});
		
	}

});
