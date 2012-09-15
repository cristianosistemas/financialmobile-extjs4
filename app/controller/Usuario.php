<?php
namespace App;

class Controller_Usuario extends Controller_Base{

	public function preAction() {
		$this->usuario = new Model_Usuario();
		$this->menu = new Model_Menu();
		$this->categoriaUsuario = new Model_UsuarioCategoria();
		$this->configuracao = new Model_Configuracao();
		$this->acesso = new Model_Acesso();
		$this->compartilhamento = new Model_Compartilhamento();
	}

	public function action_getMenus(){
		header('Content-type: application/json');
		try {
			$retorno = array('success' => true, 'data' =>array());
			if($this->request->get('node') == 'root'){
				$menusRoot = $this->menu->findMenusByPerfil(Utils_UsuarioUtils::getPerfilUsuarioLogado());
				foreach ($menusRoot as $menu){
					array_push($retorno['data'], $menu);
				}
			}else{
				$menus = $this->menu->findMenusByMenuPai($this->request->get('node'));
				foreach ($menus as $menu){
					array_push($retorno['data'], $menu);
				}
			}
			print json_encode($retorno);
		}catch (\Exception $e){
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Acao de Login do usuario
	 */
	public function action_login(){
		header('Content-type: application/json');
		try {
			$user = $this->usuario->getByLoginAndPassword($this->request->post('username'), $this->request->post('password'))->row();
			if($user){
				$this->session->loged_user = $user;
				$this->response->cookie("idUsuario", $user['idUsuario'], time() + 36000000, '/financial/');
				print self::mapSuccess();
			}else{
				print self::mapError('Usuário ou senha inválidos');
			}
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Metodo para possibilitar o login por jsonp.
	 */
	public function action_login_jsonp(){
		$callback = $this->request->get('callback');
		if(!$callback){
			header('Content-type: application/json');
			print self::mapError('E necessario informar um callback para esta operacao.');
		}else{
			header('Content-Type: text/javascript');
			try {
				$user = $this->usuario->getByLoginAndPassword($this->request->get('username'), $this->request->get('password'))->row();
				if($user){
					print $callback . '(' . self::mapSuccess($user) . ');';
				}else{
					print $callback . '(' . self::mapError('Usu�rio ou senha inv�lidos') . ');';
				}
			} catch (\Exception $e) {
				print $callback . '(' . self::mapError($e->getMessage()) . ');';
			}
		}
	}

	/**
	 * Acao de logout do usuario.
	 */
	public function action_logout(){
		try {
			$this->session->loged_user = NULL;
			$this->response->cookie('idUsuario', null, time() - 36000000, '/financial/');
			print self::mapSuccess();
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Cadastra um novo usuario.
	 *
	 */
	public function action_cadastrar(){
		header('Content-type: application/json');
		try {
			$data = array( 'nomeUsuario'   => $this->request->post('nomeUsuario'),
				           'emailUsuario'  => $this->request->post('emailUsuario'),
				           'loginUsuario'  => $this->request->post('loginUsuario'),
						   'senhaUsuario'  => $this->request->post('senhaUsuario'),
						   'ativo' 		   => $this->request->post('ativo'),
						   'idPerfil' 	   => $this->request->post('idPerfil'));

			$usuario = $this->usuario->findByEmail($data['emailUsuario']);
			if($usuario){
				print self::mapError("J&aacute; existe um usu&aacute;rio cadastrado com o email informado!");
			}else{
				$usuario = $this->usuario->findByUserName($data['loginUsuario']);
				if($usuario){
					print self::mapError("J&aacute; existe um usu&aacute;rio cadastrado com o login informado!");
				}else{
					if(!isset($data['ativo']) || empty($data['ativo'])){
						$data['ativo'] = true;
					}

					if(!isset($data['idPerfil']) || $data['idPerfil'] < 1){
						$data['idPerfil'] = 1;
					}

					$usuarioEmail = $data;

					$data['senhaUsuario'] = md5($data['senhaUsuario']);

					Utils_TransactionManager::beginTransaction();

					$idUsuario = $this->usuario->incluir($data);

					$this->cadastrarCategoriasPadroes($idUsuario);
					$this->cadastrarConfiguracao($idUsuario);
					$this->cadastrarCompartilhamento($idUsuario);

					$this ->enviarEmailBemVindo($usuarioEmail);

					Utils_TransactionManager::commitTransaction();

					$user = $this->usuario->getByLoginAndPassword($usuarioEmail['loginUsuario'], $usuarioEmail['senhaUsuario'])->row();
					if($user){
						$this->session->loged_user = $user;
						$this->response->cookie("idUsuario", $user['idUsuario'], time() + 36000000, '/financial/');
					}
					print self::mapSuccess();
				}
			}
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
			Utils_TransactionManager::rollbackTransaction();
		}

	}

	/**
	 * Recuperar a senha do usuario.
	 */
	public function action_recuperarSenha(){
		try {
			header('Content-type: application/json');
			$email = $this->request->post('email');
			if ($email){
				$usuario = $this->usuario->findByEmail($email);
				if($usuario){
					$usuario['senhaUsuario'] = $this->gerar_senha(8,true,true,false,false);
					$usuBase = $usuario;

					$usuario['senhaUsuario'] = md5($usuario['senhaUsuario']);

					Utils_TransactionManager::beginTransaction();

					$this->usuario->update(array('senhaUsuario' => $usuario['senhaUsuario']), array('idUsuario=' => $usuario['idUsuario']));

					$this->enviarEmailRecuperacaoSenha($usuBase);

					Utils_TransactionManager::commitTransaction();

					print self::mapSuccess();
				}else{
					print self::mapError('N&atilde;o foi encontrado usu&aacute;rio para o email informado!');
				}
			}else{
				print self::mapError('E necessario informar um email para recuperar a senha!');
			}
		} catch (Exception $e) {
			print self::mapError($e->getMessage());
			Utils_TransactionManager::rollbackTransaction();
		}
	}

	/**
	 * Registra o acesso do usuario
	 * @throws \Exception
	 */
	public function action_registrarAcesso(){
		try {
			$this->acesso->incluir(array('idUsuario' => Utils_UsuarioUtils::getIdUsuario(), 'dataHoraAcesso' => date('Y-m-d H:i:s')));
			print self::mapSuccess();
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Obtem as configuracoes do usuario.
	 */
	public function action_obter_configuracoes_usuario(){
		try {
			$temp = $this->configuracao->buscarConfiguracoesUsuario(Utils_UsuarioUtils::getIdUsuario());

			$retorno = array();

			foreach ($temp as $k => $conf) {
				$retorno[$conf['chave']] = $conf['valor'];
			}
			print self::mapSuccess($retorno);
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Obtem as configuracoes do usuario.
	 */
	public function action_get_usuarios_compartilhadores(){
		try {
			$retorno = $this->compartilhamento->findUsuariosCompartilhadores(Utils_UsuarioUtils::getIdUsuario());
			foreach ($retorno as $k => $ret) {
				if($ret['idUsuarioCompartilhador'] == Utils_UsuarioUtils::getIdUsuario()){
					$retorno[$k]['nomeUsuario'] = 'Você';
				}
			}
			print self::mapSuccess($retorno);
		}catch(\Exception $e) {
			throw new \Exception($e->getMessage());
		}
	}

	/**
	 * Envia o email de recuperacao de senha para o usuario.
	 * @param $usuario
	 */
	private function enviarEmailRecuperacaoSenha($usuario){

		$this->email->from('financial@diegosilva.com.br', 'Financial Mobile');
		$this->email->to($usuario['emailUsuario']);
		$this->email->bcc('diego@diegosilva.com.br');

		$this->email->subject('Sua nova senha!');
		$this->email->message('
			<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	       		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
				<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
					<head>
					</head>
					<body>
						Ol&aacute; '.$usuario['nomeUsuario'].', segue abaixo seus dados para acesso ao sistema Financial Mobile.
					<p>Usu&aacute;rio: '.$usuario['loginUsuario'].'</p>
					<p>Senha: '.$usuario['senhaUsuario'].'</p>
					</body>
				</html>
			');	

		if(!$this->email->send()){
			throw new \Exception($this->email->_debug_msg);
		}
	}

	private function enviarEmailBemVindo($usuario){
		$this->email->from('financial@diegosilva.com.br', 'Financial Mobile');
		$this->email->to($usuario['emailUsuario']);
		$this->email->bcc('diego@diegosilva.com.br');

		$this->email->subject('Bem vindo ao sistema Financial Mobile');
		$this->email->message('
			<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	       		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
				<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
					<head>
					</head>
					<body>
						Ol&aacute; '.$usuario['nomeUsuario'].', segue abaixo seus dados para acesso ao sistema Financial Mobile.
					<p>Usu&aacute;rio: '.$usuario['loginUsuario'].'</p>
					<p>Senha: '.$usuario['senhaUsuario'].'</p>
					</body>
				</html>
			');	
		if(!$this->email->send()){
			throw new \Exception($this->email->_debug_msg);
		}
	}

	private function gerar_senha($tamanho, $maiuscula, $minuscula, $numeros, $codigos){
		$maius = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
		$minus = "abcdefghijklmnopqrstuwxyz";
		$numer = "0123456789";
		$codig = '!@#$%&*()-+.,;?{[}]^><:|';
			
		$base = '';
		$base .= ($maiuscula) ? $maius : '';
		$base .= ($minuscula) ? $minus : '';
		$base .= ($numeros) ? $numer : '';
		$base .= ($codigos) ? $codig : '';
			
		srand((float) microtime() * 10000000);
		$senha = '';
		for ($i = 0; $i < $tamanho; $i++) {
			$senha .= substr($base, rand(0, strlen($base)-1), 1);
		}
		return $senha;
	}

	/**
	 *Cadastra categorias padrões para o usuário.
	 */
	private function cadastrarCategoriasPadroes($idUsuario){
		try {
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 1));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 2));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 3));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 5));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 6));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 7));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 8));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 9));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 10));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 11));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 12));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 13));
			$this->categoriaUsuario->incluir(array('idUsuario' => $idUsuario, 'idCategoria' => 15));
		} catch (\Exception $e) {
			throw new \Exception($e->getMessage());
		}
	}

	private function cadastrarCompartilhamento($idUsuario){
		$this->compartilhamento->incluir(array('idUsuarioCompartilhador' => $idUsuario, 'idUsuarioCompartilhado' => $idUsuario, 'tipoAcesso' => 'w'));
	}

	private function cadastrarConfiguracao($idUsuario){
		$this->configuracao->incluir(array('idUsuario' => $idUsuario, 'chave' => 'formato_email', 'valor' => 'html'));
		$this->configuracao->incluir(array('idUsuario' => $idUsuario, 'chave' => 'email_atrazados', 'valor' => '1'));
		$this->configuracao->incluir(array('idUsuario' => $usr['idUsuario'], 'chave' => 'email_antecedente', 'valor' => '1'));
		$this->configuracao->incluir(array('idUsuario' => $usr['idUsuario'], 'chave' => 'dias_antecedencia', 'valor' => '2'));
	}
}