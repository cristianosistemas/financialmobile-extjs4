<?php
namespace App;

use Sleek\Database;

class Utils_TransactionManager{

	static private $transaction = false;

	public static function beginTransaction(){
		self::$transaction = Database::getInstance()->autocommit(false);
	}

	public static function commitTransaction(){
		if(self::$transaction){
			Database::getInstance()->commit();
			self::$transaction = false;
		}
	}

	public static function rollbackTransaction(){
		if(self::$transaction){
			Database::getInstance()->rollback();
			self::$transaction = false;
		}
	}

	public static function isInTransaction(){
		return self::$transaction;
	}
}