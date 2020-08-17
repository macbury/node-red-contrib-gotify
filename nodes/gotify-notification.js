module.exports = function(RED) {
  const request = require('request')

  function getError(body) {
    try {
      return JSON.parse(body)['errorDescription']
    } catch (e) {
      return body
    }
  }

  function NotificationNode(config) {
    RED.nodes.createNode(this,config);
    
    this.on('input', function(msg, send, done) {
      const {
        title,
        payload: message,
        priority,
        extras
      } = msg

      this.server = RED.nodes.getNode(config.server)
      if (!this.server) {
        return
      }

      this.status({
        fill: "blue",
        shape: "dot",
        text: "sending"
      });

      const formData = {
        title: title || '',
        message: message || '',
        priority: priority || 5,
      }

      if (extras) {
        formData.extras = extras
      }
    
      request.post(this.server.endpointUrl, { json: formData }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          this.status({
            fill: "green",
            shape: "dot",
            text: "success"
          });
        } else {
          this.status({
            fill: "red",
            shape: "ring",
            text: getError(body)
          })
        }

        if (done) {
          done();
        }
      });
  });
  }

  RED.nodes.registerType("gotify-notification", NotificationNode);
}
