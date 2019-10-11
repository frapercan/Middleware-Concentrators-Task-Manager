module.exports = {
    openapi: '3.0.1',
    info: {// API informations (required)
        title: 'API Documentation', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'API documentation description', // Description (optional)
    },
        apis: ['users/*.js','studies/*.js'], //change this according to path where your code lies
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              }
            }
          },

        
         
     };