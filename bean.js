const http = require("node:http");
const fs = require("node:fs/promises");

/**
 * Server Class
 */
class Bean {
  constructor() {
    this.server = http.createServer();
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    })
  }

  route(method, url, cb) {
    this.server.on('request', (req, res) => {

      /**
       * 
       * @param {*} statuscode 
       * Add a statuscode to response
       */
      res.status = (statuscode) => {
        res.statusCode = statuscode;
      }

      /**
       * 
       * @param {*} path 
       * @param {*} mime 
       * Send a file to client
       */
      res.sendFile = async (path, mime) => {
        res.setHeader('Content-Type', mime);
        const fileHandler = await fs.open(path, 'r');
        const fileStream = fileHandler.createReadStream();
        fileStream.pipe(res);
        fileStream.on('end', () => {
          fileHandler.close()
        })
      }

      cb(req, res);
    })
  }

}

module.exports = Bean;