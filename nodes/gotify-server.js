module.exports = function(RED) {
  function GotifyServer(config) {
    RED.nodes.createNode(this, config)
    this.endpointUrl = [config.url, `message?token=${this.credentials.apiKey}`].join('/')
  }

  RED.nodes.registerType("gotify-server", GotifyServer, {
    credentials: {
      apiKey: { type: "password" }
    }
  });
}