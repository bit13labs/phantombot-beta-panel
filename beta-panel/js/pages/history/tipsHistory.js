// Function that querys all of the data we need.
$(run = function() {
	socket.getDBTableValues('get_all_tips', 'donations', function(results) {
		let tips = [];

		for (let i = 0; i < results.length; i++) {
			let value = results[i].value;

			// Make sure that it's a json object.
			if (value.startsWith('{') && value.endsWith('}')) {
				// Just to be safe, we'll add a try catch.
				try {
					let json = JSON.parse(value);

					// Since we don't store what service the tip came from.
					// We have to guess.
					switch (true) {
						case json.currency !== undefined && json.name !== undefined:
							tips.push([
								json.name,
								new Date(parseInt(json.created_at) * 1e3).toLocaleString(),
								json.currency + ' ' + parseInt(json.amount).toFixed(2),
								'StreamLabs'
							]);
							break;
						case json.parameters !== undefined:
							tips.push([
								json.parameters.username,
								new Date(json.created_at).toLocaleString(),
								json.parameters.currency + ' ' + parseInt(json.parameters.amount).toFixed(2),
								'TipeeeStream'
							]);
							break;
						case json.createdAt !== undefined && json.donation !== undefined:
							tips.push([
								json.donation.user.username,
								new Date(json.createdAt).toLocaleString(),
								json.donation.currency + ' ' + parseInt(json.donation.amount).toFixed(2),
								'StreamElements'
							]);
							break;
						case json.user !== undefined && json.user.name !== undefined:
							tips.push([
								json.user.name,
								new Date(json.date).toLocaleString(),
								json.currencyCode + ' ' + parseInt(json.amount).toFixed(2),
								'StreamTip'
							]);
							break;
					}
				} catch (ex) {
					helpers.logError('Failed to parse tip [' + value + ']: ' + ex.stack, helpers.LOG_TYPE.FORCE);
				}
			}
		}

		// Create table.
		$('#tipsHistoryTable').DataTable({
			'searching': true,
			'autoWidth': false,
			'data': tips,
			'columnDefs': [
    			{ 'width': '30%', 'targets': 0 }
    		],
			'columns': [
				{ 'title': 'Username' },
				{ 'title': 'Date' },
				{ 'title': 'Amount' },
				{ 'title': 'Tipping Service' }
			]
		});
	});
});
