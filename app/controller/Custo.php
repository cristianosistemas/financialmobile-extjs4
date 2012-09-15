<?php
namespace App;

class Controller_Custo extends Controller_Base{


	public function preAction() {
		$this->custo = new Model_Custo();
		$this->entrada = new Model_Entrada();
		$this->parcela = new Model_Parcela();
	}

	public function action_salvar_alterar(){
		header('Content-type: application/json');
		try {
			$custo = json_decode($this->request->post("custo"), true);

			//Se nao possuir idCusto insere um novo gasto
			if(!$custo['idCusto']){
				Utils_TransactionManager::beginTransaction();

				$custo['idCusto'] = $this->custo->incluir(array('descricaoGasto' => $custo['descricaoGasto'],
				'idCategoriaGasto' => $custo['idCategoriaGasto'], 'idUsuario' => Utils_UsuarioUtils::getIdUsuario()));

				if($custo['idCusto']){
					if(isset($custo['lancamentoParcelado'])){
						foreach ($custo['parcelas'] as $key => $parcela) {
							$custo['parcelas'][$key]['idCusto'] = $custo['idCusto'];

							$this->parcela->incluir(array('idCusto' => $custo['idCusto'],
																			  'numeroParcela' => $parcela['numeroParcela'],
																			  'dataVencimento'=> $parcela['dataVencimento'],
																			  'valorParcela' => $parcela['valorParcela'],
																			  'idStatus' => $parcela['idStatus']));
						}
					}else{
						$this->parcela->incluir(array('idCusto' => $custo['idCusto'],
													  'numeroParcela' => 1,
													  'dataVencimento'=> Utils_DateUtils::convertDateMysql($custo['dataVencimento']),
													  'valorParcela' => $custo['valorParcela'],
													  'idStatus' => $custo['idStatus']));
					}
				}
				Utils_TransactionManager::commitTransaction();
			}//Se possuir apenas atualiza o gasto
			else{
				Utils_TransactionManager::beginTransaction();

				$this->custo->update(array('descricaoGasto' => $custo['descricaoGasto'],
												'idCategoriaGasto' => $custo['idCategoriaGasto']), array('idCusto = ' => $custo['idCusto']));

				//somente atualizar a parcela caso nao seja custo parcelado, se for custo parcelado, ira atualizar
				//a cada alteracao na parcela na pr�pria tela.
				if(!isset($custo['parcelas'])){
					$this->parcela->update(array('dataVencimento'=> Utils_DateUtils::convertDateMysql($custo['dataVencimento']),
										  'valorParcela' => $custo['valorParcela'],
										  'idStatus' => $custo['idStatus']), array('idCusto = ' => $custo['idCusto']));
				}
				Utils_TransactionManager::commitTransaction();
			}
			print self::mapSuccess($custo);
		}catch(\Exception $e) {
			Utils_TransactionManager::rollbackTransaction();
			print self::mapError($e->getMessage());
		}
	}
	
	/**
	 * 
	 * Interface para salvar e alterar custos
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
				$custo = array('idCusto' => $this->request->get('idCusto'),
									   'descricaoGasto' => $this->request->get('descricaoGasto'),
									   'idCategoriaGasto' => $this->request->get('idCategoriaGasto'));
					
				$p = array('dataVencimento' => $this->request->get('dataVencimento'),
								   'valorParcela' => $this->request->get('valorParcela'),
								   'idStatus' => $this->request->get('idStatus'));
			
				//Se nao possuir idCusto insere um novo gasto
				if(!$custo['idCusto']){
					Utils_TransactionManager::beginTransaction();
					$custo['idCusto'] = $this->custo->incluir(array('descricaoGasto' => $custo['descricaoGasto'],
								'idCategoriaGasto' => $custo['idCategoriaGasto'], 'idUsuario' => Utils_UsuarioUtils::getIdUsuario()));
			
					if($custo['idCusto']){
						$this->parcela->incluir(array('idCusto' => $custo['idCusto'],
																  'numeroParcela' => 1,
																  'dataVencimento'=> Utils_DateUtils::convertDateMysql($p['dataVencimento']),
																  'valorParcela' => $p['valorParcela'],
																  'idStatus' => $p['idStatus']));
					}
					Utils_TransactionManager::commitTransaction();
				}//Se possuir apenas atualiza o gasto
				else{
					Utils_TransactionManager::beginTransaction();
					$this->custo->update(array('descricaoGasto' => $custo['descricaoGasto'],
																'idCategoriaGasto' => $custo['idCategoriaGasto']), array('idCusto = ' => $custo['idCusto']));
					$this->parcela->update(array('dataVencimento'=> Utils_DateUtils::convertDateMysql($p['dataVencimento']),
														 'valorParcela' => $p['valorParcela'],
														 'idStatus' => $p['idStatus']), array('idCusto = ' => $custo['idCusto']));
					Utils_TransactionManager::commitTransaction();
				}
				print $callback . '(' . self::mapSuccess($custo) . ');';
			}catch(\Exception $e) {
				Utils_TransactionManager::rollbackTransaction();
				print $callback . '(' . self::mapError($e->getMessage()) . ');';
			}
			
		}
		
	}

	/**
	 * Busca os custos de acordo com uma data.
	 */
	public function action_getCustosByDate(){
		header('Content-type: application/json');
		try {
			$custos = $this->custo->findCustosByPeriod($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($custos);
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}


	/**
	 * Carrega um custo a partir do codigo.
	 */
	public function action_read(){
		header('Content-type: application/json');
		try {
			print self::mapSuccess($this->custo->findByPk($this->request->get('id')));
		}catch(\Exception $e) {
			print '{"success":false, "message":"'.$e->getMessage().'"}';
		}

	}

	/**
	 * Busca os custos e entrada do ano informado.
	 * e retorna um json com a informacao
	 */
	function action_buscarCustosEntradaAcumuladoAno(){
		header('Content-type: application/json');
		try {
			$receitas = array('name' => 'Receitas', 'valor' => $this->entrada->buscarPorAno($this->request->get('ano'), Utils_UsuarioUtils::getIdUsuario()));
			$custos = array('name' => 'Despesas', 'valor' => $this->custo->buscarPorAno($this->request->get('ano'), Utils_UsuarioUtils::getIdUsuario()));
			print self::mapSuccess(array($receitas, $custos));
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}

	}

	/**
	 * Busca os custos e entrada do mes atual
	 * e retorna um json com a informacao
	 */
	function action_buscarCustosEntradaAcumuladoPeriodo(){
		header('Content-type: application/json');
		try {
			$valorReceitas = $this->entrada->buscarSomaEntradasPeriodo($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
			$valorCustos = $this->custo->buscarSomaCustosPeriodo($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
			$receitas = array('name' => 'Receitas', 'valor' => $valorReceitas);
			$custos = array('name' => 'Despesas', 'valor' => $valorCustos);
			$diff = array('name' => 'Diferenca', 'valor' => $valorReceitas-$valorCustos);
			print self::mapSuccess(array($receitas, $custos, $diff));
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Metodo para possibilitar o login por jsonp.
	 */
	public function action_buscarCustosEntradaAcumuladoPeriodo_jsonp(){
		$callback = $this->request->get('callback');
		if(!$callback){
			header('Content-type: application/json');
			print self::mapError('E necessario informar um callback para esta operacao.');
		}else{
			header('Content-Type: text/javascript');
			try {
				$valorReceitas = $this->entrada->buscarSomaEntradasPeriodo($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
				$valorCustos = $this->custo->buscarSomaCustosPeriodo($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
				
				$receitas = array('name' => 'Receitas', 'valor' => isset($valorReceitas) ? $valorReceitas : 0.00);
				$custos = array('name' => 'Despesas', 'valor' => isset($valorCustos) ? $valorCustos : 0.00);
				$diff = array('name' => 'Diferenca', 'valor' => $valorReceitas - $valorCustos);
				
				print $callback . '(' . self::mapSuccess(array($receitas, $custos, $diff)) . ');';
			} catch (\Exception $e) {
				print $callback . '(' . self::mapError($e->getMessage()) . ');';
			}
		}
	}
	
	/**
	 * Gera o grafico dos custos por categoria.
	 */
	function action_gerarGraficoCustosCategoria(){
		header('Content-type: application/json');
		try {
			$gastosCategoriaMes = $this->custo->buscarGastosCategoriaPeriodo($this->request->get('dataInicial'), $this->request->get('dataFinal'), Utils_UsuarioUtils::getIdUsuario());
			$retorno = array();
			foreach ($gastosCategoriaMes as $g){
				array_push($retorno, array('idCategoria' => $g['idCategoria'], 'name' => $g['descCategoria'], 'valor' => $g['total'], 'cor' => $g['cor']));
			}
			print self::mapSuccess($retorno);
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Busca o custo de uma data especifica.
	 */
	function action_buscarCustosData(){
		header('Content-type: application/json');
		try {
			$retorno = $this->custo->findCustosByDate($this->request->get('data'), Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($retorno);
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * Funcao que retorna a listagem dos custos do mes atual pelo usuario logado
	 * filtrando de acordo com o codigo da categoria passada por parametro
	 * @param $categoriaId
	 */
	function action_buscarCustosPeriodoPelaCategoria(){
		header('Content-type: application/json');
		try {
			$retorno = $this->custo->findCustosByCategoryAndPeriod($this->request->get('dataInicial'), $this->request->get('dataFinal'),
			$this->request->get('idCategoria'), Utils_UsuarioUtils::getIdUsuario());
			print self::mapSuccess($retorno);
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}


	/**
	 * Exclui determinados custos.
	 */
	function action_excluirCustos(){
		header('Content-type: application/json');
		try {
			Utils_TransactionManager::beginTransaction();
			$custos = json_decode($this->request->post("custos"), true);

			foreach($custos as $c){
				foreach($c['parcelas'] as $p){
					$this->parcela->delete(array("numeroParcela= " => $p, "idCusto= " => $c['idCusto']));
				}
				if($this->parcela->countByIdCusto($c['idCusto']) < 1){
					$this->custo->delete(array("idCusto= " => $c['idCusto']));
				}
			}
			Utils_TransactionManager::commitTransaction();
			print self::mapSuccess();
		}catch(\Exception $e) {
			Utils_TransactionManager::rollbackTransaction();
			print self::mapError($e->getMessage());
		}
	}
	
	/**
	 * Gera o grafico dos custos por categoria.
	 */
	function action_buscarCustosAnoAgrupadoMesCategoria(){
		header('Content-type: application/json');
		try {
			$gastosCategoriaMes = $this->custo->findCustosByYearGroupByCategoryAndMonth($this->request->get('ano'), Utils_UsuarioUtils::getIdUsuario());
			
			$retorno = array();
			
			foreach ($gastosCategoriaMes as $g){
				if(isset($retorno[$g['mes']])){
					array_push($retorno[$g['mes']], array($g['categoria'] => $g['valor']));
				}else{
					$retorno[$g['mes']] = array();
					array_push($retorno[$g['mes']], array($g['categoria'] => $g['valor']));
				}
			}
			
			$retorno2 = array();
	
			for ($i = 1; $i <= 12; $i++) {
				if(isset($retorno[$i])){
					$adicionar = array('mes' => $i, 'valor'=>0);
					foreach ($retorno[$i] as $g){
						$adicionar+= $g;
						$chave = array_keys($g);
						$adicionar['valor'] = $adicionar['valor'] +$g[$chave[0]];
					}
					array_push($retorno2, $adicionar);
				}
			}
			
			print self::mapSuccess($retorno2);
		}catch(\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

}