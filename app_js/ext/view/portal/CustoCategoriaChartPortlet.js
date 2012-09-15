Ext.define('FM.view.portal.CustoCategoriaChartPortlet', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.custoCategoriaChartPortlet',
    categoriaSelecionada: null,

    requires: [
        'Ext.data.JsonStore',
        'Ext.chart.theme.Base',
        'Ext.chart.series.Series',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric'
    ],

    initComponent: function(){

        Ext.apply(this, {
            layout: 'fit',
            height: 300,
            items: {
            	xtype: 'chart',
            	alias : 'widget.chartCustoCategoriaMes',
            	animate : {
					easing : 'bounceOut',
					duration : 750
				},
                store: Ext.create('Ext.data.JsonStore', {
                    fields: ['name', 'valor', 'cor', 'idCategoria'],
                    scope : this,
                    proxy: {
                        type: 'ajax',
                        url: Financial.BASE_PATH+'custo/gerarGraficoCustosCategoria',
                        reader: {
                            type: 'json',
                            root: 'data',
                            successProperty: 'success'
                        }
                    }
                }),
                axes: [{
                           type: 'Numeric',
                           position: 'left',
                           fields: ['valor'],
                           label: {
                        	   renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true)
                           },
                           grid: true,
                           minimum: 0,
                           maximum: 5000
                       },{
                           type: 'Category',
                           position: 'bottom',
                           fields: ['name'],
                           label: {
                               renderer: function(v) {
                                   return Ext.String.ellipsis(v, 15, false);
                               },
                               font: '10px Arial',
                               rotate: {
                                   degrees: 270
                               }
                           }
               }],
               series: [{
                           type: 'column',
                           axis: 'left',
                           highlight: true,
                           scope: this,
                           tips: {
                             trackMouse: true,
                             width: 140,
                             height: 28, 
                             renderer: function(record) {
                             	Ext.util.Format.TextMask.money = true;
                               this.setTitle(record.get('name') + ': '+ Ext.util.Format.TextMask.setMask('R$ #9.999.990,00').mask(record.get('valor')));
                             }
                           },
                           label: {
                             display: 'insideEnd',
                             'text-anchor': 'middle',
                               field: 'valor',
                               renderer : Ext.util.Format.maskRenderer('R$ #9.999.990,00', true),
                               orientation: 'vertical',
                               color: '#333'
                           },
                           renderer: function(sprite, record, atributes, i, store) {
                        	   atributes.fill = "#"+record.get('cor'); 
                               return atributes;
                           },
                           style: {
                               opacity: 0.95
                           },
                           xField: 'name',
                           yField: 'valor',
                           listeners: {
                               'itemmousedown': function(obj, evt){
                            	   this.scope.setCategoriaSelecionada(Ext.create('FM.model.Categoria', {
                            		   'idCategoria' : obj.storeItem.data.idCategoria,
                            		   'descCategoria' : obj.storeItem.data.name
                            	   }));
                            	   var gridCustosCategoria = Ext.ComponentQuery.query('#portlet-custos-categoria > gridCustosCategoriaPortlet')[0];
                            	   gridCustosCategoria.fireEvent('updateGrid', this.scope);
                               }
                           }
                }]
            }
        });
        
    	this.addEvents({
			"updateChart" : true
		});
        this.callParent(arguments);
    },
    
    getCategoriaSelecionada : function(){
    	return this.categoriaSelecionada;
    },
    
    setCategoriaSelecionada : function(idCategoria){
    	this.categoriaSelecionada = idCategoria;
    }
});

