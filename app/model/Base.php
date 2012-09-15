<?php
namespace App;

Class Model_Base extends \Sleek\Model_Database {

	public function incluir($data){
		try {
			return $this->db->insert($this->tableName, $data);
		} catch (\Exception $e) {
			throw $e;
		}
	}

	public function update($data, $where){
		try {
			return $this->db->update($this->tableName, $data, $where);
		} catch (\Exception $e) {
			throw $e;
		}
	}

	public function delete($where){
		try {
			return $this->db->delete($this->tableName, $where);
		} catch (\Exception $e) {
			throw $e;
		}
	}

	public function findAll(){
		return $this->db->select($this->tableName, "*")->all();
	}
}

