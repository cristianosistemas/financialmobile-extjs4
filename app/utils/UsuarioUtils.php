<?php

namespace App;

use Sleek\BaseUtils;

class Utils_UsuarioUtils extends BaseUtils{

	private static $usuarioModel;

	public static function getIdUsuario(){
		//primeiro pela sessao
		if(self::getSession()->loged_user){
			$user = self::getSession()->loged_user;
			return $user['idUsuario'];
		}//pegando o usuario pelo cookie
		else if(self::getRequest()->cookie('idUsuario')){
			$idUsuario = self::getRequest()->cookie('idUsuario');
			$user = self::getUsuarioModel()->findById($idUsuario);
			self::getSession()->loged_user = $user;
			return $user['idUsuario'];
		}//utilizado para obter recurso para apis externas
		else{
			$idKey = self::getRequest()->get('id_key');
			$key = self::getRequest()->get('key');
			if(!empty($idKey) && !empty($key)){
				$idUsuario = $idKey;
				$user = self::getUsuarioModel()->findById($idUsuario);
				if($user && ($user['senhaUsuario'] == $key)){
					return $idUsuario;
				}
			}
		}
		//valor default
		return -1;
	}

	public static function isGuest(){
		return self::getIdUsuario() == -1;
	}

	public static function getPerfilUsuarioLogado(){
		if(self::getSession()->loged_user){
			$user = self::getSession()->loged_user;
			return $user['idPerfil'];
		}else{
			return -1;
		}
	}

	private static function getUsuarioModel(){
		if(!self::$usuarioModel){
			self::$usuarioModel = new Model_Usuario();
		}
		return self::$usuarioModel;
	}
}