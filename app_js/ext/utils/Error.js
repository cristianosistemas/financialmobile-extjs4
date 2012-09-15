Ext.define("FM.utils.Error", {
			alternateClassName : "FM.Error",
			singleton : true,

			proccess : function(proxy, response, operation) {
				var msgErro = '';
				if (operation.getError()) {
					msgErro = operation.getError().statusText;
				} else {
					var objRet = Ext.decode(response.responseText);
					if (!objRet.success) {
						msgErro = objRet.message;
					}
				}
				FM.Msg.error(msgErro);
			}
		});