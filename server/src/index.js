import express from 'express';
import cookieParser from 'cookie-parser';
import oasGenerator from 'express-oas-generator';
import dotenv from 'dotenv';

import CorsMiddleware from './middleware/CorsMiddleware.js';
import TrimInput from './middleware/TrimInput.js';
import { ErrorHandler } from './middleware/ErrorHandler.js';
import BaseRoute from './route/BaseRoute'

dotenv.config(); 

const app = express();

// Middleware
app.use(CorsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(TrimInput);

oasGenerator.init(app, {
  onCreateRoute: (method, descriptor) => {
    console.log(`${method} ${descriptor.path}`);
  },
  onComplete: (spec) => {
    // Add request bodies for POST endpoints
    const examplePostPath = '/api/user/create';
    if (spec.paths[examplePostPath] && spec.paths[examplePostPath].post) {
      spec.paths[examplePostPath].post.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string', example: 'johndoe' },
                password: { type: 'string', example: 'password123' },
              },
              required: ['username', 'password'],
            },
          },
        },
      };
    }

    // Group APIs by tags
    Object.keys(spec.paths).forEach((path) => {
      const methods = Object.keys(spec.paths[path]);
      methods.forEach((method) => {
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
  },
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(BaseRoute);

app.use(ErrorHandler);

// Start server
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
