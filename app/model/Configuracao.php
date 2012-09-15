<?php
namespace App;


Class Model_Configuracao extends Model_Base {
	protected $tableName = 'Configuracao';

	public function buscarConfiguracoesUsuario($idUsuario){
		return $this->db->select("{$this->tableName} as c ",
   			  "c.chave, c.valor", 
		array('c.idUsuario = ' => $idUsuario))->all();
	}
}

