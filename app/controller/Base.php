<?php

namespace App;

class Controller_Base extends \Sleek\Controller_Base{


	public function mapSuccess($data = null, $total = 0){
		return json_encode(array("success"=>true, 'data' => $data, 'total' => $total));
	}

	public function mapError($message){
		return json_encode(array("success"=>false, 'message' => $message));
	}
}