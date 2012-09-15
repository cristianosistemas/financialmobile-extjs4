<?php
namespace App;

class Controller_Error extends Controller_Base {

	public function action_404() {
		header('Content-type: application/json');
		$this->response->status(404);
		print self::mapError('404: File Not Found');
	}

	public function action_500($number = FALSE, $text = '', $filename = '', $linenumber = 0, $context = '') {
		header('Content-type: application/json');
		if(Utils_TransactionManager::isInTransaction()){
			Utils_TransactionManager::rollbackTransaction();
		}
		print self::mapError('Erro interno no servidor: '.$text.' '.$filename.' '.$linenumber);
	}
}
