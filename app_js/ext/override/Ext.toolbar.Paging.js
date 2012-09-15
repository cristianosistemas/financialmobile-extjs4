/**
 * Override para substituir o do extjs, pois o mesmo
 * não atualiza os itens após um updateinfo.
 */
Ext.override(Ext.toolbar.Paging, {
	updateInfo : function() {
		var me = this, displayItem = me.child('#displayItem'), 
		store = me.store, pageData = me.getPageData(), count, msg;

		if (displayItem) {
			count = store.getCount();
			if (count === 0) {
				msg = me.emptyMsg;
		        currPage = pageData.currentPage;
		        pageCount = pageData.pageCount;
		        afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) ? 1 : pageCount);
		
		        me.child('#afterTextItem').setText(afterText);
		        me.child('#inputItem').setValue(currPage);
		        me.child('#first').setDisabled(currPage === 1);
		        me.child('#prev').setDisabled(currPage === 1);
		        me.child('#next').setDisabled(currPage === pageCount);
		        me.child('#last').setDisabled(currPage === pageCount);
		        me.child('#refresh').enable();
			} else {
				msg = Ext.String.format(me.displayMsg, pageData.fromRecord,
						pageData.toRecord, pageData.total);
			}
			displayItem.setText(msg);
			me.doComponentLayout();
		}
	}
});