Ext.define('FM.controller.portal.receita.Receita', {
	extend : 'Ext.app.Controller',

	stores : [ 'Custos' ],

	models : [ 'Custo', 'Categoria', 'Parcela', 'Usuario' ],

	views : [ 'portal.receita.ReceitasAnualWindow' ],

	refs : [ {
		ref : 'receitasanualwindow',
		selector : 'receitasanualwindow'
	} ],

	init : function() {
		console.log('Inicializando controller');
		
		this.control({
			'receitasanualwindow' : {
				'afterrender' : function(win, evt) {
					this.atualizarDados(win);
				
				},
				'atualizarValores' : function(win, obj){
					this.atualizarGrid(win, obj.storeItem.data.mes, win.down('#cldAnoSelecionado').getYear());
				},
			},
			
			'receitasanualwindow #cldAnoSelecionado':{
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
			win = this.getReceitasanualwindow();
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
					this.atualizarGrid(win, mes, ano);
				}
			}
		});
	},
	
	atualizarGrid : function(win, mes, ano){
		var data = Ext.Date.parse(mes+'/'+ano, "n/Y");
		var grid = win.down('grid');
		grid.setTitle('Detalhes de : '+Ext.Date.monthNames[mes-1]+'/'+ano);
		grid.store.load({
			params : {
				dataInicial : FM.utils.DateUtils.formatarDataMysql(Ext.Date.getFirstDateOfMonth(data)),
				dataFinal : FM.utils.DateUtils.formatarDataMysql(Ext.Date.getLastDateOfMonth(data))
			},
			callback : function() {
			}
		});
	}

});
