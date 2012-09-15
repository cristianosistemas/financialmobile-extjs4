Ext.define("FM.view.user.LoginForm", {
			extend : "FM.abstract.Form",
			alias : "widget.loginform",

			initComponent : function() {
				this.items = this.createLoginFields();
				this.fbar = this.createButtons();
				this.callParent();
			},

			createButtons : function() {
				return [{
							text : "Entrar",
							scope : this,
							action : 'login',
							cls : "financial-button-evidence"
						}, {
							text : "Criar Conta",
							scope : this,
							action : 'registrar'
						}, {
							text : "Recuperar Senha",
							scope : this,
							action : 'recuperarSenha'
						}];
			},

			createLoginFields : function() {
				return [{
							xtype : "fieldcontainer",
							layout : "hbox",
							defaultType : "textfield",
							width : 360,
							items : [{
										labelAlign : "top",
										msgTarget : 'side',
										fieldLabel : "Usu&aacute;rio",
										name : "username",
										id : "username",
										allowBlank : false,
										flex : 1,
										margins : {
											right : 3
										}
									}, {
										labelAlign : "top",
										msgTarget : 'side',
										inputType : 'password',
										fieldLabel : 'Senha',
										name : 'password',
										id : "password",
										allowBlank : false,
										flex : 1,
										margins : {
											left : 3
										}
									}]
						}];
			}
		});