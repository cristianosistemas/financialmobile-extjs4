<?php
namespace Sleek;

class BaseUtils {
	private static $request      = null;

	private static $response     = null;

	private static $session      = null;

	protected static function getRequest(){
		self::$request = Request::getInstance();
		return self::$request;
	}

	protected static function getSession(){
		if (Config::get('use_sessions')) {
			self::$session = Session::getInstance();
		}
		return self::$session;
	}

	protected static function getResponse(){
		self::$response = Response::getInstance();
		return self::$response;
	}
	 
}
