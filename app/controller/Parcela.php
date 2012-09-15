<?php
namespace App;

class Controller_Parcela extends Controller_Base{

	public function preAction() {
		$this->parcela = new Model_Parcela();
		$this->categoria = new Model_Categoria();
		$this->custo = new Model_Custo();
	}

	/**
	 * Acao de atualizar parcela para model da grid que também contém dados do custo.
	 * Atualiza parcela e custo.
	 */
	public function action_atualizar(){
		header('Content-type: application/json');
		try {
			if($this->request->post('data')){
				$data = json_decode($this->request->post('data'), true);
				foreach ($data as $v){
					$this->parcela->update(array('dataVencimento' => $v['dataVencimento'], 'valorParcela' => $v['valorParcela'], 'idStatus' => $v['idStatus']),
						array('idCusto =' => $v['idCusto'], 'numeroParcela =' => $v['numeroParcela']));
					
					$this->custo->update(array('descricaoGasto' => $v['descricaoGasto'], 'idCategoriaGasto' => $v['idCategoriaGasto']),
						array('idCusto =' => $v['idCusto']));
				}
			}
			print self::mapSuccess();
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 *Acao para atualizacao da parcela utilizada pelo model default
	 *quando somente existe informaÃ§Ãµes da parcela.
	 */
	public function action_update(){
		header('Content-type: application/json');
		try {
			if($this->request->post('data')){
				$data = json_decode($this->request->post('data'), true);
				$this->parcela->update(array('dataVencimento' => $data['dataVencimento'], 'valorParcela' => $data['valorParcela']),
				array('idCusto =' => $data['idCusto'], 'numeroParcela =' => $data['numeroParcela']));
			}
			print self::mapSuccess();
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 * remove uma parcela do banco.
	 */
	public function action_remove(){
		header('Content-type: application/json');
		try {
			if($this->request->post('numeroParcela') && $this->request->post('idCusto')){
				$this->parcela->delete(array('idCusto =' => $this->request->post('idCusto'), 'numeroParcela =' => $this->request->post('numeroParcela')));
				print self::mapSuccess();
			}else{
				print self::mapError('E necessario informar o numero da parcela e o id do custo a ser excluido.');
			}
				
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	public function action_buscarParcelasCustoCategorias(){
		header('Content-type: application/json');
		try {
			$data = $this->parcela->findByParams($this->request->get('dataInicio'),
			$this->request->get('dataFinal'),
			$this->request->get('descricao'),
			$this->request->get('categoria'),
			Utils_UsuarioUtils::getIdUsuario(),
			$this->request->get('idStatus'));

			/*
			foreach ($data['data'] as $key => $v){
				$data['data'][$key]['custo'] = array('idCusto' => $v['idCusto'], 'descricaoGasto' => $v['descricaoGasto'], 'idCategoriaGasto' => $v['idCategoriaGasto']);
			}
			*/
			print self::mapSuccess($data['data'], $data['count']);
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

	/**
	 *Carregar a parcela.
	 */
	public function action_read(){
		header('Content-type: application/json');
		try {
			$filtro = json_decode($this->request->get('filter'), true);
			if($filtro && $filtro[0]['property'] === 'idCusto'){
				$data = $this->parcela->findByIdCusto($filtro[0]['value']);
				print self::mapSuccess($data);
			}else{
				print self::mapSuccess();
			}
		} catch (\Exception $e) {
			print self::mapError($e->getMessage());
		}
	}

}