Ext.Loader.setConfig({
	enabled : true,
	disableCaching: true,
	paths : {
		Ext : Financial.BASE_PATH + "api/ext"
	}
});

var hideMask = function () {
    Ext.get('loading').remove();
    Ext.fly('loading-mask').animate({
        opacity:0,
        remove:true
    });
};

Ext.application({
	name : 'FM',
	appFolder : 'app_js/ext',
	models: ['Categoria', 'Custo', 'Parcela', 'Usuario', 'Entrada'],
	//stores: ['Categorias', 'Custos', 'Parcelas', 'ParcelaCustoCategoria', 'RepeticaoParcelas', 'StatusParcela', 'Receitas'],
	controllers : ['Portal', 'Custo', 'Usuario', 'Categoria', 'Receita', 'portal.receita.Receita', 'portal.despesa.Despesa'],
	
	launch : function() {
		if(Financial.USER_AUT){
			Ext.require('FM.view.portal.Portal', function() {
				Ext.create('FM.view.portal.Portal');
				Ext.defer(hideMask, 250);
			});
		}else{
			Ext.require("FM.view.user.LoginWindow", function() {
				var win = Ext.create("FM.view.user.LoginWindow");
				Ext.defer(hideMask, 250);
				win.show();
			});
		}
	}
});