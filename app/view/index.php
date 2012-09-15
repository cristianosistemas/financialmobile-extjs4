<!DOCTYPE html>
<html lang="pt">
<head>
	<title>Financial Mobile</title>
	<meta http-equiv="Content-Type" content="text/html"/>
	<meta charset="iso-8859-1">
	<link rel="shortcut icon" href="./img/favicon.ico"/>	
	<?php 
		if(App\Utils_UsuarioUtils::isGuest()){
			echo '<link rel="stylesheet" href="./css/login.css" type="text/css" media="screen"/>';
		}
	?>
	<script src="./app_js/ext/utils/Financial.js" type="text/javascript"></script>
	<script type="text/javascript">
		Financial.BASE_PATH = "<?=Sleek\Config::get('host').Sleek\Config::get('base_url')?>";
		Financial.USER_AUT = "<?=!App\Utils_UsuarioUtils::isGuest()?>";
		Financial.enable_log = true;
	</script>
	
	<style type="text/css">
		#loading-mask{
	        background-color:white;
	        height:100%;
	        position:absolute;
	        left:0;
	        top:0;
	        width:100%;
	        z-index:20000;
	    }
	    #loading{
	        height:auto;
	        position:absolute;
	        left:40%;
	        top:40%;
	        padding:2px;
	        z-index:20001;
	    }
	    #loading .loading-indicator{
	        background:white;
	        color:#444;
	        font:bold 13px Helvetica, Arial, sans-serif;
	        height:auto;
	        margin:0;
	        padding:10px;
	    }
	    #loading-msg {
	        font-size: 10px;
	        font-weight: normal;
	    }
	</style>
</head>

<body>

<body>
    <div id="loading-mask" style=""></div>
    <div id="loading">
        <div class="loading-indicator">
            <img src="./img/loading.gif" width="42" height="42" style="margin-right:8px;float:left;vertical-align:top;"/>Financial Mobile - <span style="color:#225588;">Controle Financeiro Pessoal</span>
            <br /><span id="loading-msg">0% - AguardeCarregando estilos...</span>
        </div>
    </div>

	<link rel="stylesheet" href="./api/ext/resources/css/ext-all.css" type="text/css" media="screen"/>
	<link rel="stylesheet" href="./css/financial.css" type="text/css" media="screen"/>
	<link rel="stylesheet" href="./api/ext/ux/check-column/CheckHeader.css" type="text/css" media="screen"/>
	<link rel="stylesheet" href="./api/ext/ux/portal/portal.css" type="text/css" media="screen"/>
	<link rel="stylesheet" href="./api/ext/ux/colorpicker/css/colorpicker.css" type="text/css" media="screen"/>

	<script type="text/javascript">document.getElementById('loading-msg').innerHTML = '30% - Carregando arquivos Extjs...';</script> 

	<script src="./api/ext/ext-all-dev.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">document.getElementById('loading-msg').innerHTML = '50% - Carregando arquivos Extjs...';</script>
	
	<script src="./api/ext/locale/ext-lang-pt_BR.js" type="text/javascript" charset="utf-8"></script>
	
	<script src="./api/ext/ux/text-mask/TextMaskCore.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/text-mask/TextMaskPlugin.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/calendar/MonthCalendar.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/calendar/YearCalendar.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/check-column/CheckColumn.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/field/ColorField.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/colorpicker/ColorPicker.js" type="text/javascript" charset="utf-8"></script>
	<script src="./api/ext/ux/colorpicker/ColorPickerField.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">document.getElementById('loading-msg').innerHTML = '70% - Carregando arquivos Extjs...';</script>
	
	<script src="./app_js/ext/utils/Log.js" type="text/javascript" charset="utf-8"></script>
	<script src="./app_js/ext/utils/Constants.js" type="text/javascript" charset="utf-8"></script>
	<script src="./app_js/ext/utils/DateUtils.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">document.getElementById('loading-msg').innerHTML = '80% - Carregando arquivos Extjs...';</script>
	
	<script src="./app_js/ext/utils/MaskLoading.js" type="text/javascript" charset="utf-8"></script>
	<script src="./app_js/ext/utils/Error.js" type="text/javascript" charset="utf-8"></script>
	<script src="./app_js/ext/utils/MessageBox.js" type="text/javascript" charset="utf-8"></script>
	
	<script src="./app_js/ext/utils/VType.js" type="text/javascript" charset="utf-8"></script>
	<script src="./app_js/ext/utils/Ajax.js" type="text/javascript" charset="utf-8"></script>
	
	<script src="./app_js/ext/override/Ext.toolbar.Paging.js" type="text/javascript" charset="utf-8"></script>
	<script src="./app_js/ext/override/Ext.data.Store.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">document.getElementById('loading-msg').innerHTML = '100% - Construindo Interface...';</script>
		
	<script src="./app_js/ext/app.js" type="text/javascript" charset="utf-8"></script>
    
</body>
</html>

