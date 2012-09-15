Ext.define("FM.utils.MessageBox", {
			alternateClassName : "FM.Msg",
			singleton : true,

			alert : function(message) {
				Ext.Msg.show({
							title : "Alerta",
							modal : true,
							icon : Ext.Msg.WARNING,
							buttons : Ext.Msg.OK,
							msg : message
						});
			},

			info : function(message, callback) {
				Ext.Msg.show({
							title : "Informa&ccedil;&atilde;o",
							modal : true,
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OK,
							msg : message,
							fn : callback ? callback : Ext.emptyFn
						});
			},

			error : function(message) {
				Ext.Msg.show({
							title : "Erro",
							modal : true,
							icon : Ext.Msg.ERROR,
							buttons : Ext.Msg.OK,
							msg : message
						});
			},

			warning : function(message) {
				Ext.Msg.show({
							title : "Aviso",
							modal : true,
							icon : Ext.Msg.WARNING,
							buttons : Ext.Msg.OK,
							msg : message
						});
			},

			confirm : function(message, callback, scope) {
				Ext.Msg.show({
							title : "Confirma&ccedil;&atilde;o",
							modal : true,
							icon : Ext.Msg.QUESTION,
							buttons : Ext.Msg.YESNO,
							msg : message,
							fn : callback || Ext.emptyFn,
							scope : scope || this
						});
			},

			info2 : function(title, format) {
				var msgCt = Ext.DomHelper.insertFirst(document.body, {
							id : 'msg-div'
						}, true);
				var s = Ext.String.format.apply(String, Array.prototype.slice
								.call(arguments, 1));
				var m = Ext.DomHelper.append(msgCt, this.createBox(title, s), true);
				m.hide();
				m.slideIn('t').ghost("t", {
							delay : 1000,
							remove : true
						});
			},

			createBox : function(t, s) {
				return '<div class="msg"><h3>' + t + '</h3><p>' + s
						+ '</p></div>';
			}
		});