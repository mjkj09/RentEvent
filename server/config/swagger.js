const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RentEvent API',
      version: '1.0.0',
      description: 'API documentation for the RentEvent application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      responses: {
        Success: {
          description: 'Success response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: 'Operation successful'
                  },
                  data: {
                    type: 'object',
                    example: {}
                  }
                }
              }
            }
          }
        },
        Error: {
          description: 'Error response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Error message'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/responses/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/responses/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/responses/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/responses/Error'
              }
            }
          }
        }
      },
      schemas: {
        Venue: {
          type: 'object',
          required: [
            'name',
            'category',
            'location',
            'owner',
            'company',
            'capacity'
          ],
          properties: {
            _id: {
              type: 'string',
              format: 'objectid',
              example: '60d21b4667d0d8992e610c85'
            },
            name: {
              type: 'string',
              example: 'Grand Ballroom'
            },
            category: {
              type: 'string',
              enum: [
                'Wedding & Banquet Halls',
                'Conference & Meeting Rooms',
                'Outdoor & Garden Spaces',
                'Clubs & Bars',
                'Lofts & Industrial Venues',
                'Unique & Themed Spaces'
              ],
              example: 'Wedding & Banquet Halls'
            },
            location: {
              type: 'object',
              required: ['street', 'city', 'region'],
              properties: {
                street: {
                  type: 'string',
                  example: 'ul. Krakowska 123'
                },
                city: {
                  type: 'string',
                  example: 'Krakow'
                },
                region: {
                  type: 'string',
                  enum: [
                    'Malopolska',
                    'Mazowieckie',
                    'Dolnoslaskie',
                    'Pomorskie',
                    'Wielkopolskie',
                    'Slaskie',
                    'Lubelskie',
                    'Podlaskie',
                    'Zachodniopomorskie',
                    'Lubuskie',
                    'Kujawsko-Pomorskie',
                    'Lodzkie',
                    'Swietokrzyskie',
                    'Podkarpackie',
                    'Warminsko-Mazurskie'
                  ],
                  example: 'Malopolska'
                }
              }
            },
            owner: {
              oneOf: [
                {
                  type: 'string',
                  format: 'objectid',
                  example: '60d21b4667d0d8992e610c86'
                },
                {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      format: 'objectid'
                    },
                    name: {
                      type: 'string'
                    },
                    surname: {
                      type: 'string'
                    },
                    phone: {
                      type: 'string'
                    }
                  }
                }
              ]
            },
            company: {
              oneOf: [
                {
                  type: 'string',
                  format: 'objectid',
                  example: '60d21b4667d0d8992e610c87'
                },
                {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      format: 'objectid'
                    },
                    name: {
                      type: 'string'
                    }
                  }
                }
              ]
            },
            description: {
              type: 'string',
              default: '',
              example: 'A beautiful venue for your special day'
            },
            capacity: {
              type: 'number',
              minimum: 1,
              example: 200
            },
            pricing: {
              type: 'object',
              properties: {
                minPricePerPerson: {
                  type: 'number',
                  minimum: 0,
                  nullable: true,
                  default: null,
                  example: 100
                },
                maxPricePerPerson: {
                  type: 'number',
                  minimum: 0,
                  nullable: true,
                  default: null,
                  example: 200
                },
                isPriceHidden: {
                  type: 'boolean',
                  default: false,
                  example: false
                }
              }
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['/uploads/venues/image1.jpg', '/uploads/venues/image2.jpg']
            },
            bannerImage: {
              type: 'string',
              nullable: true,
              default: null,
              example: '/uploads/venues/banner.jpg'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              default: 0,
              example: 4.5
            },
            reviews: {
              type: 'number',
              minimum: 0,
              default: 0,
              example: 25
            },
            isActive: {
              type: 'boolean',
              default: true,
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-06-01T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-06-01T10:00:00.000Z'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js', './docs/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  // Swagger page
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📝 Swagger docs available at /api/v1/docs');
};

module.exports = { swaggerDocs };