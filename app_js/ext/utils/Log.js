Ext.define("FM.utils.Log",{
	extend 		: "Object",
	singleton	: true,
	log			: function(object){
		if(console && Financial.enable_log){
			console.log(object);
		}
	}
});

FM.log = FM.utils.Log.log;