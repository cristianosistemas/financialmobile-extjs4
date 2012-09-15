<?php
namespace App;


Class Model_Menu extends Model_Base{
    protected $tableName = 'Menu';

    function findMenusByPerfil($idPerfil){
    	return $this->db->select("{$this->tableName} as m join Perfil_Menu pm on(pm.idMenu=m.id)", 
    	"*", array('pm.idPerfil ='=>$idPerfil, 'm.idMenuPai ='=>''), ' order by text asc');
    }
    
    function findMenusByMenuPai($idPai){
    	return $this->db->select("{$this->tableName} as m",
    	    	"*", array('m.idMenuPai ='=> $idPai), ' order by text asc');
    }
}

