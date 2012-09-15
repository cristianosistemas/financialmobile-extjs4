<?php
namespace App;


Class Model_Entrada extends Model_Base {
	protected $tableName = 'entrada';

	/**
	 *
	 * Enter description here ...
	 * @param unknown_type $dataInicial
	 * @param unknown_type $dataFinal
	 * @param unknown_type $idUsuario
	 */
	function buscarSomaEntradasPeriodo($dataInicial, $dataFinal, $idUsuario){
		return $this->db->select("{$this->tableName}", "SUM(valorEntrada) as somaEntradas",
		array('dataEntrada >= ' => Utils_DateUtils::convertDateMysql($dataInicial),
			  'dataEntrada <= '=>Utils_DateUtils::convertDateMysql($dataFinal),
			  'idUsuario = '=>$idUsuario))->col('somaEntradas');
	}

	/**
	 *
	 * Enter description here ...
	 * @param unknown_type $dataInicial
	 * @param unknown_type $dataFinal
	 * @param unknown_type $idUsuario
	 */
	function buscarPorAno($ano, $idUsuario){
		return $this->db->select("{$this->tableName}", "SUM(valorEntrada) as somaEntradas",
		array('YEAR(dataEntrada) = ' => $ano, 'idUsuario = ' => $idUsuario))->col('somaEntradas');
	}

	/**
	 *
	 * Enter description here ...
	 * @param unknown_type $dataInicial
	 * @param unknown_type $dataFinal
	 * @param unknown_type $idUsuario
	 */
	function buscarEntradasPeriodo($dataInicial, $dataFinal, $idUsuario){
		return $this->db->select("{$this->tableName}", "*",
		array('dataEntrada >= ' => Utils_DateUtils::convertDateMysql($dataInicial),
			  'dataEntrada <= '=>Utils_DateUtils::convertDateMysql($dataFinal),
			  'idUsuario = '=>$idUsuario), ' order by dataEntrada asc')->all();
	}
	
	/**
	 * 
	 * @param unknown_type $ano
	 * @param unknown_type $idUsuario
	 */
	function buscarPorAnoAgrupadoPorMes($ano, $idUsuario){
		return $this->db->select("{$this->tableName}", "sum(valorEntrada) as valor, MONTH(dataEntrada) as mes , 
		(Select avg(entradas.valor) as media from 
		   ( Select sum(valorEntrada) as valor, MONTH(dataEntrada) as mes 
		    from entrada 
		    where YEAR(dataEntrada) = {$ano}
		    and idUsuario = {$idUsuario}
		    group by mes
		    order by mes asc) as entradas) as media ",
		array('YEAR(dataEntrada) = ' => $ano, 'idUsuario = ' => $idUsuario), ' group by mes order by mes asc')->all();
	}

	 
}

