// Function that querys all of the data we need.
$(run = function() {
	socket.getDBTableValues('get_all_raids', 'incoming_raids', function(results) {
		let raids = [];

		for (let i = 0; i < results.length; i++) {
			let json = JSON.parse(results[i].value);

			raids.push([
				results[i].key,
				new Date(parseInt(json.lastRaidTime)).toLocaleString(),
				helpers.getDefaultIfNullOrUndefined(json.lastRaidViewers, '0'),
				helpers.getDefaultIfNullOrUndefined(json.totalRaids, '1'),
				helpers.getDefaultIfNullOrUndefined(json.totalViewers, '0'),
			]);
		}

		// Create table.
		$('#raidHistoryTable').DataTable({
			'searching': true,
			'autoWidth': false,
			'data': raids,
			'columnDefs': [
    			{ 'width': '20%', 'targets': 0 }
    		],
			'columns': [
				{ 'title': 'Username' },
				{ 'title': 'Last Raid' },
				{ 'title': 'Viewers' },
				{ 'title': 'Total Raids' },
				{ 'title': 'Total Viewers' }
			]
		});
	});
});
