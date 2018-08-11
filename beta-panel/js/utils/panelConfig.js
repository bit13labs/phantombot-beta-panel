var panelSettings = {
    panelPort: 80,
    channelName: "",
    hostName: "",
    auth: "",
    http: "http://"
};

function getPanelPort() { return panelSettings.panelPort; }
function getChannelName() { return panelSettings.channelName; }
function getAuth() { return panelSettings.auth; }
function getProtocol() { return panelSettings.http; }
function getPhantomBotHost() { return panelSettings.hostName; }