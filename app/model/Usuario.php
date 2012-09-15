<?php
namespace App;


Class Model_Usuario extends Model_Base {
	protected $tableName = 'usuario';

	public function getByLoginAndPassword($login, $password) {
		return $this->db->select($this->tableName, "*", array('loginUsuario ='=>$login, 'senhaUsuario ='=>md5($password)));
	}
	
	public function findByEmail($email) {
		return $this->db->select($this->tableName, "*", array('emailUsuario ='=>$email))->row();
	}
	
	public function findByUserName($loginUsuario){
		return $this->db->select($this->tableName, "*", array('loginUsuario ='=>$loginUsuario))->row();
	}
	
	function findById($idUsuario){
		return $this->db->select($this->tableName, "*", array('idUsuario ='=>$idUsuario))->row();
	}
}

