<?php
namespace App;

class Controller_Categoria extends Controller_Base{

	public function preAction() {
		$this->categoria = new Model_Categoria;
	}

	public function action_categoriasUsuario(){
		header('Content-type: application/json');
		try {
			$result = $this->categoria->findByUserAndColumns(array('c.idCategoria', 'c.descCategoria'), Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($result);
		}catch(Exception $e) {
			print self::mapError($e->getMessage());
		}
	}
	
	public function action_categoriasUsuario_jsonp(){
		$callback = $this->request->get('callback');
		if(!$callback){
			header('Content-type: application/json');
			print self::mapError('E necessario informar um callback para esta operacao.');
		}else{
			header('Content-Type: text/javascript');
			try {
				$result = $this->categoria->findByUserAndColumns(array('c.idCategoria', 'c.descCategoria'), Utils_UsuarioUtils::getIdUsuario());
				$retorno = array();
				
				foreach ($result as $cat){
					array_push($retorno, array($cat['idCategoria'], $cat['descCategoria']));
				}
				print $callback . '(' . self::mapSuccess($retorno) . ');';
			} catch (\Exception $e) {
				print $callback . '(' . self::mapError($e->getMessage()) . ');';
			}
		}
	}
	
	/**
	 * Carrega todas as informações das categorias do usuario logado.
	 */
	public function action_categoriasUsuarioCompleto(){
		header('Content-type: application/json');
		try {
			$result = $this->categoria->findByUserAndColumns('c.idCategoria, c.descCategoria, c.descCompletaCategoria, c.idUsuario, IFNULL(uc.cor, c.cor) as cor', Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($result);
		}catch(Exception $e) {
			print self::mapError($e->getMessage());
		}
	}
	
	/**
	 * Salva as informações de uma categoria.
	 */
	public function action_salvar_atualizar(){
		header('Content-type: application/json');
		try {
			
			
			
			print self::mapSuccess($result);
		}catch(Exception $e) {
			print self::mapError($e->getMessage());
		}
	}
}