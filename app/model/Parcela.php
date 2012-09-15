<?php
namespace App;


Class Model_Parcela extends Model_Base {
    protected $tableName = 'parcelas';
    
    
    /**
    * Busca os custos por periodo.
    *
    * @param Date $dataInicial
    * @param Date $dataFinal
    * @param Date $idUsuario
    */
    function findByParams($dataInicial, $dataFinal, $descricao,  $categoria,  $idUsuario, $idStatus){
    
    	$filtros = array('p.dataVencimento >= ' => Utils_DateUtils::convertDateMysql($dataInicial),
    			         'p.dataVencimento <= ' => Utils_DateUtils::convertDateMysql($dataFinal),
    			         'c.idUsuario = ' => $idUsuario);
    	
    	if($categoria){
    		$filtros['c.idCategoriaGasto = '] = $categoria;
    	}
    	
    	if($idStatus){
    		$filtros['p.idStatus = '] = $idStatus;
    	}
    	
    	if($descricao){
    		$filtros['c.descricaoGasto like '] = '%'.$descricao.'%';
    	}
    	
    	$totalCount = $this->db->select("{$this->tableName} as p join custo c on(c.idCusto = p.idCusto) join categoria cat on(c.idCategoriaGasto = cat.idCategoria)",
    	    			  "count(*) as total", $filtros)->col('total');
    	
    	
    	$data = $this->db->select("{$this->tableName} as p join custo c on(c.idCusto = p.idCusto) join categoria cat on(c.idCategoriaGasto = cat.idCategoria)",
    	    			  "*", $filtros, ' order by p.dataVencimento asc')->all();
    
    	$retorno = array('count'=>$totalCount, 'data'=>$data);
    	
    	return $retorno;
    }
    
    function findByPk($idCusto, $nuParcela){
    	return $this->db->select("{$this->tableName}", "*", array('idCusto = ' => $idCusto, 'numeroParcela = ' => $nuParcela))->row();
    }
    
    function countByIdCusto($idCusto){
    	return $this->db->select("{$this->tableName}", "count(*) as total", array('idCusto = ' => $idCusto))->col('total');
    }
    
    function findByIdCusto($idCusto){
    	return $this->db->select("{$this->tableName}", "*", array('idCusto = ' => $idCusto), " order by numeroParcela asc")->all();
    }
   
}

