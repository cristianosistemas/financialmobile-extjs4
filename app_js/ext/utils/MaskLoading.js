Ext.define("FM.utils.MaskLoading", {
	alternateClassName : "FM.MaskLoading",
	singleton : true,

	showDefault : function() {
		Ext.getBody().mask("Loading...","x-mask-loading");
	},
	hideDefault : function() {
		Ext.getBody().unmask();
	}

});

FM.showLoading = FM.utils.MaskLoading.showDefault;
FM.hideLoading = FM.utils.MaskLoading.hideDefault;