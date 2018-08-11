// Function that querys all of the data we need.
$(run = function() {
    // Get command settings.
    socket.getDBValues('get_command_settings', {
        tables: ['settings', 'settings', 'settings', 'settings', 'cooldownSettings',
            'cooldownSettings'],
        keys: ['permComMsgEnabled', 'priceComMsgEnabled', 'coolDownMsgEnabled',
            'pricecomMods', 'modCooldown', 'defaultCooldownTime']
    }, true, function(e) {
        // Set cost message.
        $('#cmd-cost-messages').val((e.priceComMsgEnabled === 'true' ? 'Yes' : 'No'));
        // Set permission message.
        $('#cmd-perm-messages').val((e.permComMsgEnabled === 'true' ? 'Yes' : 'No'));
        // Set cooldown message.
        $('#cmd-cooldown-messages').val((e.coolDownMsgEnabled === 'true' ? 'Yes' : 'No'));
        // Set cost for mods.
        $('#pricecom-mods').val((e.pricecomMods === 'true' ? 'No' : 'Yes'));
        // Set cooldown for mods.
        $('#cooldown-mods').val((e.modCooldown === 'true' ? 'No' : 'Yes'));
        // Set global cooldown.
        $('#global-cooldown').val(e.defaultCooldownTime);
    });
});

// Function that handles events.
$(function() {
    // Save button.
    $('#cmd-save-btn').on('click', function() {
        let cmdCostMessage = $('#cmd-cost-messages').find(':selected').text() === 'Yes',
            cmdPermMessage = $('#cmd-perm-messages').find(':selected').text() === 'Yes',
            cmdCooldownMessage = $('#cmd-cooldown-messages').find(':selected').text() === 'Yes',
            priceComMods = $('#pricecom-mods').find(':selected').text() !== 'Yes',
            cooldownMods = $('#cooldown-mods').find(':selected').text() !== 'Yes',
            globalTime = $('#global-cooldown');

        switch (false) {
            case helpers.handleInputNumber(globalTime, 5):
                break;
            default:
                socket.updateDBValues('update_cmd_settings', {
                    tables: ['settings', 'settings', 'settings', 'settings', 'cooldownSettings',
                        'cooldownSettings'],
                    keys: ['permComMsgEnabled', 'priceComMsgEnabled', 'coolDownMsgEnabled',
                        'pricecomMods', 'modCooldown', 'defaultCooldownTime'],
                    values: [cmdPermMessage, cmdCostMessage, cmdCooldownMessage,
                        priceComMods, cooldownMods, globalTime.val()]
                }, function() {
                    socket.wsEvent('update_cmd_settings_ws', './core/commandCoolDown.js', null, ['update'], function() {
                        toastr.success('Successfully update command settings!');
                    });
                });
        }
    });
});
