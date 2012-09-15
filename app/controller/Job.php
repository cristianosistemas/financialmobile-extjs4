<?php
namespace App;

class Controller_Job extends Controller_Base{

	public function preAction() {
		$this->categoria = new Model_Categoria;
		$this->usuario = new Model_Usuario();
		$this->categoriaUsuario = new Model_UsuarioCategoria();
		$this->custo = new Model_Custo();
		$this->compartilhamento = new Model_Compartilhamento();
		$this->configuracao = new Model_Configuracao();
	}


	/**
	 * Acao para exibir o sistema web.
	 */
	public function action_index(){
		print false;
	}

	public function action_executar_verificacao_vencimentos(){
		$ch = curl_init("http://localhost/financial/job/verificar_vencimentos");
		//curl_setopt($ch, CURLOPT_URL,$URL);
		//curl_setopt($ch, CURLOPT_POST, 1);

		$result = curl_exec($ch);
		curl_close($ch);
		print 'resultado: '.$result;
	}

	/**
	 * Acao para exibir o sistema mobile.
	 */
	public function action_verificar_vencimentos(){
		print true;
	}
	
	public function action_efetuar_migracao(){
		try {
			Utils_TransactionManager::beginTransaction();
			
			//TODO: modulo de compartilhamento fora por enquanto.
			//$this->ajustar_compartilhamentos();
			
			$this->ajustar_categorias();
			$this->ajustar_configuracao();
			Utils_TransactionManager::commitTransaction();
			print 1;
		} catch (\Exception $e) {
			Utils_TransactionManager::rollbackTransaction();
			print $e->getMessage();
		}
	}
	
	/**
	 * 
	 * Ajusta os compartilhamentos.
	 * @throws Exception
	 */
	private function ajustar_compartilhamentos(){
		try {
			$usuariosSistema = $this->usuario->findAll();
			foreach ($usuariosSistema as $k => $usr) {
				$this->compartilhamento->incluir(array('idUsuarioCompartilhador' => $usr['idUsuario'], 'idUsuarioCompartilhado' => $usr['idUsuario'], 'tipoAcesso' => 'w'));
			}
		} catch (\Exception $e) {
			throw $e;
		}
	}
	
	private function ajustar_configuracao(){
		try {
			$usuariosSistema = $this->usuario->findAll();
			foreach ($usuariosSistema as $k => $usr) {
				$this->configuracao->incluir(array('idUsuario' => $usr['idUsuario'], 'chave' => 'formato_email', 'valor' => 'html'));
				$this->configuracao->incluir(array('idUsuario' => $usr['idUsuario'], 'chave' => 'email_atrazados', 'valor' => '1'));
				$this->configuracao->incluir(array('idUsuario' => $usr['idUsuario'], 'chave' => 'email_antecedente', 'valor' => '1'));
				$this->configuracao->incluir(array('idUsuario' => $usr['idUsuario'], 'chave' => 'dias_antecedencia', 'valor' => '2'));
			}
		} catch (\Exception $e) {
			throw $e;
		}
	}

	private function ajustar_categorias(){
		try {
			$categoriasPadrao = array(1 => "Refeição",
			2 => "Lazer", 3 => "Transporte", 5 => "Moto", 6=> "Carro",
			7 => "Supermercado", 8 => "Higiene/Limpeza", 9 => "Estudos",
			10 => "Saude",11 => "Moradia",
			12 => "Comunicação", 13 => "Utilidades", 15 => "Vestuário");

			$usuariosSistema = $this->usuario->findAll();
			foreach ($usuariosSistema as $k => $usr) {
				$categoriasUsuario = $this->categoria->findByUserAndColumnsOld($usr['idUsuario']);
				foreach ($categoriasUsuario as $k2 => $cat) {
					$catInserir = array_search($cat['descCategoria'], $categoriasPadrao);
					//se a categoria for comum
					if($catInserir){
						//inseri na tabela associativa
						$this->categoriaUsuario->incluir(array('idUsuario' => $usr['idUsuario'], 'idCategoria' => $catInserir));
						if($catInserir != $cat['idCategoria']){
							//atualiza os custos para a cateroria comum
							$this->custo->update(array("idCategoriaGasto" => $catInserir), array("idCategoriaGasto=" => $cat['idCategoria']));
							//remove a categoria duplicada no sistema
							$this->categoria->delete(array("idCategoria= " => $cat['idCategoria']));
						}
					}else{
						$this->categoriaUsuario->incluir(array('idUsuario' => $usr['idUsuario'], 'idCategoria' => $cat['idCategoria']));
					}
				}
			}
		} catch (\Exception $e) {
			throw $e;
		}
	}

}