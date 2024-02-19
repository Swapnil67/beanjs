const http = require("node:http");
const fs = require("node:fs/promises");

/**
 * Server Class
 */
class Bean {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.middleware = [];

    this.server.on("request", (req, res) => {
      if (req.headers.cookie) {
        const raw_cookies = req.headers.cookie;
        const cookies = raw_cookies.split(";");
        const cookieObj = {};
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const [key, value] = cookie.split("=");
          cookieObj[key.trim()] = value;
        }
        req.headers.cookie = cookieObj;
      }

      /**
       *
       * @param {*} statuscode
       * Add a statuscode to response
       */
      res.status = (statuscode) => {
        res.statusCode = statuscode;
        return res;
      };

      /**
       *
       * @param {*} path
       * @param {*} mime
       * Send a file to client
       */
      res.sendFile = async (path, mime) => {
        res.setHeader("Content-Type", mime);
        const fileHandler = await fs.open(path, "r");
        const fileStream = fileHandler.createReadStream();
        fileStream.pipe(res);
        fileStream.on("end", () => {
          fileHandler.close();
        });
      };

      /**
       *
       * @param {*} data
       * Send json data back to client (for small json data, less than highWaterMark)
       */
      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      /**
       *
       * @param {*} data
       * Send plain text data
       */
      res.send = (data) => {
        res.setHeader("Content-Type", "text/plain");
        res.end(data.toString());
      };

      // * Run all the middleware functions
      // this.middleware[0](req, res, () => {
      //   this.middleware[1](req, res, () => {
      //     this.middleware[2](req, res, () => {
      //       this.routes[req.method.toLowerCase() + req.url](req, res);
      //     })
      //   })
      // })

      // * Run all the middleware functions
      const runMiddleware = (req, res, middleware, index) => {
        // * Exit Point
        if (index == this.middleware.length) {
          // * If the route object does not have a key of req.method + req.url,
          // * Return 404
          if (!this.routes[req.method.toLowerCase() + req.url]) {
            return res
              .status(404)
              .json({ error: `Cannot ${req.method} ${req.url}` });
          }
          this.routes[req.method.toLowerCase() + req.url](req, res);
        } else {
          middleware[index](req, res, () => {
            runMiddleware(req, res, middleware, index + 1);
          });
        }
      };

      runMiddleware(req, res, this.middleware, 0);

    });
  }

  beforeEach(cb) {
    this.middleware.push(cb);
  }

  route(method, path, cb) {
    this.routes[method.toLowerCase() + path] = cb;
  }

  static(folder) {
    console.log("Static Files folder ", folder);
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }
}

module.exports = Bean;
