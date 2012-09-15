Ext.define("FM.view.user.CadastroForm", {
			extend : "FM.abstract.Form",
			alias : "widget.cadastroForm",

			initComponent : function() {
				this.items = this.createFields();
				this.fbar = this.createButtons();
				this.callParent();
			},

			createButtons : function() {
				return [{
							text : "Cadastrar",
							scope : this,
							action : 'cadastrar',
							iconCls : 'icone-salvar',
							width: 90
						}, {
							text : "Cancelar",
							scope : this,
							action : 'cancelarCadastro',
							iconCls : 'icone-cancelar',
							width: 90
						}];
			},

			createFields : function() {
				return [{
							xtype : "fieldcontainer",
							defaultType : "textfield",
							items : [{
										msgTarget : 'side',
										fieldLabel : "Nome",
										name : "nomeUsuario",
										allowBlank : false
									}, {
										msgTarget : 'side',
										fieldLabel : "Email",
										name : "emailUsuario",
										allowBlank : false,
										vtype : "email"
									}, {
										msgTarget : 'side',
										fieldLabel : "Us&aacute;rio",
										name : "loginUsuario",
										allowBlank : false,
										maxLength: 8
									}, {
										msgTarget : 'side',
										fieldLabel : "Senha",
										name : "senhaUsuario",
										id : 'senhaUsuario',
										inputType : 'password',
										allowBlank : false,
										vtype : 'password'
									}, {
										msgTarget : 'side',
										fieldLabel : "Confirme a senha",
										name : "senhaConf",
										inputType : 'password',
										allowBlank : false,
										initialPasswordField : 'senhaUsuario',
										vtype : 'password'
									}]
						}];
			}
		});