import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Withdrawal Fee API',
      version: '1.0.0',
      description: 'Automatically generated API docs',
    },
    servers: [{ url: 'https://withdrawal-fee-module.onrender.com' }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Auto-scan routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
