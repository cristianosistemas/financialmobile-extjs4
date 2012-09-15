<?php
namespace App;


Class Model_Custo extends Model_Base {
	protected $tableName = 'custo';

	/**
	 * Busca os custos por periodo.
	 *
	 * @param Date $dataInicial
	 * @param Date $dataFinal
	 * @param Date $idUsuario
	 */
	function findCustosByPeriod($dataInicial, $dataFinal, $idUsuarios){
		return $this->db->select("{$this->tableName} as c join categoria cat on(cat.idCategoria = c.idCategoriaGasto) join parcelas p on(p.idCusto = c.idCusto)",
    	    	"*", array('p.dataVencimento >= ' => Utils_DateUtils::convertDateMysql($dataInicial), 
    					   'p.dataVencimento <= '=>Utils_DateUtils::convertDateMysql($dataFinal),
    					   'c.idUsuario in '=>$idUsuarios), ' order by cat.descCategoria asc')->all();
	}

	/**
	 *
	 * Enter description here ...
	 * @param unknown_type $dataInicial
	 * @param unknown_type $dataFinal
	 * @param unknown_type $idUsuario
	 */
	function buscarSomaCustosPeriodo($dataInicial, $dataFinal, $idUsuario){
		return $this->db->select("{$this->tableName} as c join parcelas p on(p.idCusto = c.idCusto)",
		    	    	"SUM(p.valorParcela) as somaCustos", 
		array('p.dataVencimento >= ' => Utils_DateUtils::convertDateMysql($dataInicial),
		      'p.dataVencimento <= '=>Utils_DateUtils::convertDateMysql($dataFinal),
		      'c.idUsuario = ' => $idUsuario))->col('somaCustos');
	}

	/**
	 *
	 * Enter description here ...
	 * @param unknown_type $dataInicial
	 * @param unknown_type $dataFinal
	 * @param unknown_type $idUsuario
	 */
	function buscarGastosCategoriaPeriodo($dataInicial, $dataFinal, $idUsuario){
		return $this->db->select("{$this->tableName} as c join categoria cat on(cat.idCategoria=c.idCategoriaGasto) join parcelas p on(p.idCusto = c.idCusto)",
		  "cat.idCategoria, cat.descCategoria, cat.cor, sum(p.valorParcela) as total", 
		array('p.dataVencimento >= ' => Utils_DateUtils::convertDateMysql($dataInicial),
		      'p.dataVencimento <= ' => Utils_DateUtils::convertDateMysql($dataFinal),
		      'c.idUsuario = ' => $idUsuario), ' group by cat.idCategoria, cat.descCategoria, cat.cor')->all();
	}

	/**
	 *
	 * Busca os custos de uma determinada data.
	 * @param unknown_type $data
	 * @param unknown_type $idUsuario
	 * @return Ambigous <multitype:, unknown>
	 */
	function findCustosByDate($data, $idUsuario){
		$data = Utils_DateUtils::convertDateMysql($data);
		return $this->db->select("{$this->tableName} as c join categoria cat on(cat.idCategoria = c.idCategoriaGasto) join parcelas p on(p.idCusto = c.idCusto)",
		"*", 
		array('p.dataVencimento = ' => $data,
			  'c.idUsuario = '=>$idUsuario), ' order by p.dataVencimento asc')->all();
	}

	/**
	 * Retorna uma lista de custos de acordo com o periodo informado
	 * de acordo com o codigo da categoria e codigo do usuário
	 * @param $dataInicio
	 * @param $dataFinal
	 * @param $categoriaId
	 * @param $idUsuario
	 */
	function findCustosByCategoryAndPeriod($dataInicial, $dataFinal, $categoriaId, $idUsuario){
		return $this->db->select("{$this->tableName} as c join categoria cat on(cat.idCategoria = c.idCategoriaGasto) join parcelas p on(p.idCusto = c.idCusto)",
		"*",
		array('p.dataVencimento >= ' => Utils_DateUtils::convertDateMysql($dataInicial),
			  'p.dataVencimento <= ' => Utils_DateUtils::convertDateMysql($dataFinal),
			  'cat.idCategoria = ' => $categoriaId,
		      'c.idUsuario = ' => $idUsuario), ' order by dataVencimento asc')->all();
	}

	/**
	 *
	 * Enter description here ...
	 * @param unknown_type $dataInicial
	 * @param unknown_type $dataFinal
	 * @param unknown_type $idUsuario
	 */
	function buscarPorAno($ano, $idUsuario){
		return $this->db->select("{$this->tableName} as c join parcelas p on(p.idCusto = c.idCusto)", "SUM(p.valorParcela) as somaCustos",
		array('YEAR(p.dataVencimento) = ' => $ano,
			  'c.idUsuario = '=>$idUsuario))->col('somaCustos');
	}
	
	/**
	 * Busca pela chave primaria.
	 * @param $idCusto
	 * @return multitype:
	 */
	function findByPk($idCusto){
		return $this->db->select("{$this->tableName}", "*", array('idCusto = ' => $idCusto))->row();
	}
	
	/**
	 * 
	 * @param unknown_type $year
	 * @param unknown_type $idUsuario
	 * @return multitype:
	 */
	function findCustosByYearGroupByCategoryAndMonth($year, $idUsuario){
		return $this->db->select("{$this->tableName} as c join parcelas p on(c.idCusto = p.idCusto) join categoria ct on(c.idCategoriaGasto = ct.idCategoria)",
		" sum(p.valorParcela) as valor, MONTH(p.dataVencimento) as mes, ct.descCategoria as categoria",
		array('YEAR(p.dataVencimento) = ' => $year,
				'c.idUsuario = ' => $idUsuario), ' group by mes, categoria order by mes asc')->all();
	}
}

