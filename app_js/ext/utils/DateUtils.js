Ext.define("FM.utils.DateUtils", {
			extend : "Object",
			singleton : true,
			formatarDataMysql : function(data) {
				return Ext.Date.format(data, 'Y-m-d');
			},

			getDaysDiff : function(dataInicial, dataFinal) {

				var start = new Date(dataInicial.getFullYear(), dataInicial
								.getMonth(), dataInicial.getDate());
				var end = dataFinal
						? new Date(dataFinal.getFullYear(), dataFinal
										.getMonth(), dataFinal.getDate())
						: new Date(new Date().getFullYear(), new Date()
										.getMonth(), new Date().getDate());
										
				var diff = start.getTime() - end.getTime();
				return Math.ceil(diff / (24 * 60 * 60 * 1000));
			}
		});
