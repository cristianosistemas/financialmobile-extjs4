<?php
namespace App;

class Controller_Site extends Controller_Base{


	/**
	 * Acao para exibir o sistema web.
	 */
	public function action_index(){
		$this->response->view('index');
	}

	/**
	 * Acao para exibir o sistema mobile.
	 */
	public function action_mobile(){
		$this->response->view('index_mobile');
	}

}