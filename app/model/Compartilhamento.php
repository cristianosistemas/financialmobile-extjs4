<?php
namespace App;


Class Model_Compartilhamento extends Model_Base {
    protected $tableName = 'Compartilhamento';

    function findUsuariosCompartilhadores($idUsuario){
    	return $this->db->select("{$this->tableName} as c join usuario u on(c.idUsuarioCompartilhado = u.idUsuario)",
        	"c.idUsuarioCompartilhador, u.nomeUsuario, c.tipoAcesso, c.ativo", array('c.idUsuarioCompartilhado ='=>$idUsuario))->all();
    }
   
}

