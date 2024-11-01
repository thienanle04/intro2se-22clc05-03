const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IntroSE-22CLC05',
      description: "API endpoints for book shop services documented on swagger",
      contact: {
        name: "Kietnguyen2003",
        email: "ngkiet21@clc.fitus.edu.vn",
        url: "https://www.facebook.com/profile.php?id=100014318529323"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/router/*.js'], // Look for swagger docs in router files
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(`Swagger docs available at http://localhost:${port}/docs\n`);
}

module.exports = swaggerDocs;
