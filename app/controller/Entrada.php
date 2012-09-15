<?php
namespace App;

class Controller_Entrada extends Controller_Base{

	public function preAction() {
		$this->custo = new Model_Custo();
		$this->entrada = new Model_Entrada();
	}

	/**
	 *Busca as entradas de um período.
	 */
	function action_buscarEntradasPeriodo(){
		header('Content-type: application/json');
		try {
			$retorno = $this->entrada->buscarEntradasPeriodo($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($retorno);
		}catch(Exception $e) {
			print self::mapError($e->getMessage());
		}
	}
	
	/**
	 * Busca as entradas do ano agrupados por mes.
	 */
	function action_buscarPorAnoAgrupadosMes(){
		header('Content-type: application/json');
		try {
			$retorno = $this->entrada->buscarPorAnoAgrupadoPorMes($this->request->get('ano'), Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($retorno);
		}catch(Exception $e) {
			print self::mapError($e->getMessage());
		}
	}


	/**
	 *
	 * Interface para salvar e alterar receitas
	 * para apis externas.
	 */
	public function action_salvar_alterar_jsonp(){
		$callback = $this->request->get('callback');
		if(!$callback){
			header('Content-type: application/json');
			print self::mapError('E necessario informar um callback para esta operacao.');
		}else{
			header('Content-Type: text/javascript');
			try {
				$receita = array('idEntrada' => $this->request->get('idEntrada'),
						'descricao' => $this->request->get('descricao'),
						'dataEntrada' => $this->request->get('dataEntrada'),
						'valorEntrada' => $this->request->get('valorEntrada'));
				//Se nao possuir idEntrada insere uma nova receita
				if(!$receita['idEntrada']){
					Utils_TransactionManager::beginTransaction();
					$receita['idEntrada'] = $this->entrada->incluir(array('descricao' => $receita['descricao'],
							'dataEntrada' => $receita['dataEntrada'], 'valorEntrada' => $receita['valorEntrada'],
							'idUsuario' => Utils_UsuarioUtils::getIdUsuario()));
					Utils_TransactionManager::commitTransaction();
				}//Se possuir apenas atualiza a entrada
				else{
					Utils_TransactionManager::beginTransaction();
					$this->entrada->update(array('descricao' => $receita['descricao'],
							'dataEntrada' => $receita['dataEntrada'], 'valorEntrada' => $receita['valorEntrada']),
							array('idEntrada = ' => $receita['idEntrada']));
					Utils_TransactionManager::commitTransaction();
				}
				print $callback . '(' . self::mapSuccess($receita) . ');';
			}catch(\Exception $e) {
				Utils_TransactionManager::rollbackTransaction();
				print $callback . '(' . self::mapError($e->getMessage()) . ');';
			}
		}
	}

	/**
	 * Salva ou altera uma entrada.
	 */
	public function action_salvar_alterar(){
		header('Content-type: application/json');
		try {
			$receita = json_decode($this->request->post("receita"), true);
				
			//Se nao possuir idEntrada insere uma nova receita
			if(!$receita['idEntrada']){
				Utils_TransactionManager::beginTransaction();
				$receita['idEntrada'] = $this->entrada->incluir(array('descricao' => $receita['descricao'],
						'dataEntrada' => Utils_DateUtils::convertDateMysql($receita['dataEntrada']), 'valorEntrada' => $receita['valorEntrada'],
						'idUsuario' => Utils_UsuarioUtils::getIdUsuario()));
				Utils_TransactionManager::commitTransaction();
			}//Se possuir apenas atualiza a entrada
			else{
				Utils_TransactionManager::beginTransaction();
				$this->entrada->update(array('descricao' => $receita['descricao'],
						'dataEntrada' => Utils_DateUtils::convertDateMysql($receita['dataEntrada']), 'valorEntrada' => $receita['valorEntrada']),
						array('idEntrada = ' => $receita['idEntrada']));
				Utils_TransactionManager::commitTransaction();
			}
			print self::mapSuccess($receita);
		}catch(\Exception $e) {
			Utils_TransactionManager::rollbackTransaction();
			print self::mapError($e->getMessage());
		}
	}
}