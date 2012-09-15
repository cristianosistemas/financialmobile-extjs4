Ext.define('FM.controller.Usuario', {
	extend : 'Ext.app.Controller',

	stores : ['Custos', 'Parcelas', 'ParcelaCustoCategoria',
			'QuantidadeParcelas', 'RepeticaoParcelas'],

	models : ['Usuario'],

	views : ['user.CadastroWindow', 'user.LoginWindow',
			'user.RecuperarSenhaWindow'],

	refs : [{
				ref : 'cadastrarusuariowindow',
				selector : 'cadastrarusuariowindow'
			}, {
				ref : 'loginwindow',
				selector : 'loginwindow'
			}, {
				ref : 'recuperarsenhawindow',
				selector : 'recuperarsenhawindow'
			}],

	init : function() {
		FM.log('Inicializando o controller Usuario');

		this.control({
			'cadastrarusuariowindow button[action=cadastrar]' : {
				click : this.efetivarCadastro
			},

			'cadastrarusuariowindow button[action=cancelarCadastro]' : {
				click : function(button) {
					button.up('cadastrarusuariowindow').hide();
					this.getLoginwindow().down('textfield[name=username]')
							.focus(true, 500);
				}
			},

			'cadastrarusuariowindow cadastroForm' : {
				afterrender : function(form) {
					form.down('textfield[name="nomeUsuario"]').focus(true, 500);
				}
			},

			'recuperarsenhawindow button[action=recuperarSenha]' : {
				click : this.enviarSenhaEmail
			},

			'recuperarsenhawindow recuperarSenhaForm' : {
				afterrender : function(form) {
					form.down('textfield[name="email"]').focus(true, 500);
				}
			},

			'loginwindow button[action=login]' : {
				click : this.login
			},

			'loginwindow button[action=registrar]' : {
				click : this.cadastrar
			},

			'loginwindow button[action=recuperarSenha]' : {
				click : this.recuperarSenha
			},

			'loginwindow loginform' : {
				afterrender : function(form) {
					form.down('textfield[id="username"]').focus(true, 500);
				}
			},

			'loginwindow loginform textfield[name=password]' : {
				specialkey : function(f, e) {
					if (e.getKey() == e.ENTER) {
						this.login(f);
					}
				}
			}

		});
	},

	login : function(field) {
		var panel = field.up('loginform');
		var form = panel.getForm();
		if (form.isValid()) {
			var values = form.getValues();
			FM.Ajax.request({
						url : Financial.BASE_PATH + "usuario/login",
						params : values,
						el : field.up("window").el,
						scope : this,
						success : function(data, response) {
							if (data.success) {
								FM.showLoading();
								document.location = Financial.BASE_PATH;
							}
						},
						failure : function(data, response) {
							var passwrd = panel.down("textfield[id=password]");
							Ext.create("Ext.tip.ToolTip", {
										anchor : "left",
										target : passwrd.bodyEl,
										trackMouse : false,
										html : data.message,
										autoShow : true
									});
							passwrd.markInvalid(data.message);
						}
					});
		}
	},

	cadastrar : function(button) {
		button.up('loginform').getForm().reset();
		Ext.require("FM.view.user.CadastroWindow", function() {
					var win = Ext.create("FM.view.user.CadastroWindow");
					win.show();
				});
	},

	efetivarCadastro : function(button) {
		var panel = button.up('cadastroForm');
		if (panel.getForm().isValid()) {
			var values = panel.getForm().getValues();
			FM.Ajax.request({
						url : Financial.BASE_PATH + 'usuario/cadastrar',
						params : values,
						el : panel.up("cadastrarusuariowindow").el,
						msg : 'Efetivando cadastro, aguarde...',
						scope : this,
						timeout: 100000,
						success : function(data, response) {
							FM.Msg.info('Cadastro efetuado com sucesso! Foi enviado um email contendo seus dados de acesso.', function(){
								panel.up("cadastrarusuariowindow").hide();
								FM.showLoading();
								document.location = Financial.BASE_PATH;
							});
							
						}
					});
		}
	},

	recuperarSenha : function(button) {
		button.up('loginform').getForm().reset();
		Ext.require("FM.view.user.RecuperarSenhaWindow", function() {
					var win = Ext.create("FM.view.user.RecuperarSenhaWindow");
					win.show();
				});
	},

	enviarSenhaEmail : function(button) {
		var form = button.up('recuperarSenhaForm');
		if (form.getForm().isValid()) {
			FM.Ajax.request({
				url : Financial.BASE_PATH + 'usuario/recuperarSenha',
				params : form.getForm().getValues(),
				el : form.up("recuperarsenhawindow").el,
				msg : 'Enviando email, aguarde...',
				scope : this,
				timeout: 100000,
				success : function(data, response) {
					FM.Msg.info('Foi enviando um email contendo as informações da sua conta para o email informado.');
				}
			});
		}
	}
});
