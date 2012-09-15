Ext.override(Ext.data.Store, {
	removeAll: function(silent) {
        var me = this;

        me.clearData();
        delete me.totalCount;
		me.currentPage = 1;
		
        if (me.snapshot) {
            me.snapshot.clear();
        }
        if (silent !== true) {
            me.fireEvent('clear', me);
        }
    }
});