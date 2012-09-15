<?php
namespace App;

class Controller_Configuracao extends Controller_Base{
	
	public function preAction() {
		$this->configuracao = new Model_Configuracao();
	}
	
	public function action_atualizar(){
		header('Content-type: application/json');
		try {
			$this->configuracao->update(array('valor' => $this->request->post('formato_email')), array('idUsuario='=>Utils_UsuarioUtils::getIdUsuario(), 'chave='=>'formato_email'));
			$this->configuracao->update(array('valor' => $this->request->post('email_atrazados') ? '1':'0'), array('idUsuario='=>Utils_UsuarioUtils::getIdUsuario(), 'chave='=>'email_atrazados'));
			$this->configuracao->update(array('valor' => $this->request->post('email_anteceden') ? '1':'0'), array('idUsuario='=>Utils_UsuarioUtils::getIdUsuario(), 'chave='=>'email_anteceden'));
			$this->configuracao->update(array('valor' => $this->request->post('dias_antecedenc')), array('idUsuario='=>Utils_UsuarioUtils::getIdUsuario(), 'chave='=>'dias_antecedenc'));
			print self::mapSuccess();
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

}