Ext.define("FM.view.user.LoginWindow", {
			extend : "FM.abstract.ModalWindow",
			requires : ["FM.view.user.LoginForm"],
			
			alias : 'widget.loginwindow',

			layout : "auto",
			modal : false,
			width : 400,
			height : 220,
			closable : false,
			draggable : false,
			resizable : false,

			id : "loginWindow",

			initComponent : function() {
				this.items = this.buildItems();
				this.callParent();
			},

			buildItems : function() {
				return [{
							xtype : "component",
							style : "text-align: center;",
							html : '<img src="' + FM.Constants.LOGO_FM + '"/>'
						}, Ext.create("FM.view.user.LoginForm")];
			}
		});