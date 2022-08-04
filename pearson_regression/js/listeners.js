MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observer = new MutationObserver((mutation) => {
	if (mutation[0].target === $('#data-table tbody')) {
		$('#input-table').scrollTop = $('#input-table').scrollHeight;
		const rows = $$('#data-table tbody tr');
		if (!rows || rows.length === 0) {
			toggle('#delete', 'disabled', true);
			toggle('#validate', 'disabled', true);
		}
		else {
			toggle('#delete', 'disabled', false);
			toggle('#validate', 'disabled', false);
		}
	} else if (mutation[0].target === $('#textarea')) {
		$('#textarea').scrollTop = $('#textarea').scrollHeight;
	}
});
observer.observe($('#data-table tbody'), {
	childList: true
});
observer.observe($('#textarea'), {
	childList: true
});

function handleRowClick(e) {
	e.preventDefault();

	const rows = $$('#data-table tbody tr');
	if (e.ctrlKey || e.metaKey) {
		if (hasClass(this, 'highlighted'))
			removeClass(this, 'highlighted')
		else
			addClass(this, 'highlighted');
	} else if (e.shiftKey) {
		const firstSelectedId = parseInt($('.highlighted').id);
		const targetId = parseInt(this.id);
		const ids = firstSelectedId <= targetId ? range(firstSelectedId, targetId, 1) : range(targetId, firstSelectedId, 1);
		rows.forEach(row => {
			const rowId = parseInt(row.id);
			removeClass(row, 'highlighted');
			if (ids.includes(rowId))
				addClass(row, 'highlighted');
		});
	} else {
		rows.forEach(row => removeClass(row, 'highlighted'));
		addClass(this, 'highlighted');
	}
}