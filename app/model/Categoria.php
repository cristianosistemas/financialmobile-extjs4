<?php
namespace App;


Class Model_Categoria extends Model_Base {
	protected $tableName = 'categoria';


	public function findByPk($id){
		if(!$id){
			throw new \Exception("É necessário informar o código para buscar a categoria.");
		}
		return  $this->db->select($this->tableName, '*', array('idCategoria' => $id))->row();
	}

	public function findByUserAndColumns($columns = 'c.*', $idUsuario){
		if(!$idUsuario){
			throw new \Exception("É necessário informar o código do usuário.");
		}
		return $this->db->select("{$this->tableName} as c join Usuario_Categoria uc on(c.idCategoria = uc.idCategoria)",
				  $columns, array('uc.idUsuario = ' => $idUsuario), ' order by c.descCategoria asc')->all();
	}
	
	public function findByUserAndColumnsOld($idUsuario){
		if(!$idUsuario){
			throw new \Exception("É necessário informar o código do usuário.");
		}
		return $this->db->select("{$this->tableName} as c",
					  "c.*", array('c.idUsuario = ' => $idUsuario))->all();
	}

}

