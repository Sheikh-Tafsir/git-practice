"use strict";

var _express = _interopRequireDefault(require("express"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _expressOasGenerator = _interopRequireDefault(require("express-oas-generator"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _CorsMiddleware = _interopRequireDefault(require("./middleware/CorsMiddleware.js"));
var _TrimInput = _interopRequireDefault(require("./middleware/TrimInput.js"));
var _ErrorHandler = require("./middleware/ErrorHandler.js");
var _BaseRoute = _interopRequireDefault(require("./route/BaseRoute"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var app = (0, _express["default"])();

// Middleware
app.use(_CorsMiddleware["default"]);
app.use(_express["default"].json({
  limit: '5mb'
}));
app.use((0, _cookieParser["default"])());
app.use(_TrimInput["default"]);
_expressOasGenerator["default"].init(app, {
  onCreateRoute: function onCreateRoute(method, descriptor) {
    console.log("".concat(method, " ").concat(descriptor.path));
  },
  onComplete: function onComplete(spec) {
    // Add request bodies for POST endpoints
    var examplePostPath = '/api/user/create';
    if (spec.paths[examplePostPath] && spec.paths[examplePostPath].post) {
      spec.paths[examplePostPath].post.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  example: 'johndoe'
                },
                password: {
                  type: 'string',
                  example: 'password123'
                }
              },
              required: ['username', 'password']
            }
          }
        }
      };
    }

    // Group APIs by tags
    Object.keys(spec.paths).forEach(function (path) {
      var methods = Object.keys(spec.paths[path]);
      methods.forEach(function (method) {
        if (path.startsWith('/api/user')) {
          spec.paths[path][method].tags = ['User'];
        } else if (path.startsWith('/api/book')) {
          spec.paths[path][method].tags = ['Book'];
        } else {
          spec.paths[path][method].tags = ['Other'];
        }
      });
    });
    return spec;
  }
});

// Basic route
app.get('/', function (req, res) {
  res.send('Hello, world!');
});
app.use(_BaseRoute["default"]);
app.use(_ErrorHandler.ErrorHandler);

// Start server
var PORT = process.env.PORT || 8002;
app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
});