import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Construction Market API',
      version: '1.0.0',
      description: `
        Complete Construction Market Backend API with comprehensive features:

        ## Features
        - 🔗 **Shareable Profile Links**: Unique company URLs with slug-based routing
        - 📊 **Facebook Pixel & GA4 Tracking**: Comprehensive analytics integration
        - 🌍 **Location-Based Filtering**: Geospatial search with radius filtering
        - 💳 **Generic Payment System**: Multi-provider payment processing
        - 🏢 **Company Management**: Full CRUD with image uploads
        - 👥 **User Management**: Authentication and authorization
        - 📈 **Activity Logging**: User behavior tracking
        - 🎯 **Category System**: Organized company categorization

        ## Authentication
        Most endpoints require a Bearer token. Obtain a token by logging in via \`POST /api/users/login\`.

        ## Geolocation
        Location-based endpoints support both coordinate-based (latitude/longitude/radius) and text-based (city/country) filtering.

        ## Payment Services
        - **Featured Listing**: Priority placement in search results
        - **Premium Subscription**: Full feature access with verification
        - **Company Verification**: Blue checkmark verification

        ## Tracking
        The API automatically tracks user interactions for analytics via Facebook Pixel and Google Analytics 4.
      `,
      contact: {
        name: 'Construction Market Support',
        email: 'support@constructionmarket.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.constructionmarket.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        }
      },
      schemas: {
        // Error responses
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              example: 'Detailed error information'
            }
          }
        },

        // Success responses
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            }
          }
        },

        // Pagination
        PaginationInfo: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 10
            },
            total: {
              type: 'integer',
              example: 100
            },
            pages: {
              type: 'integer',
              example: 10
            }
          }
        },

        // Company schemas
        Company: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678901'
            },
            name: {
              type: 'string',
              example: 'ABC Construction Ltd'
            },
            slug: {
              type: 'string',
              example: 'abc-construction-ltd'
            },
            description: {
              type: 'string',
              example: 'Leading construction company specializing in residential and commercial projects'
            },
            category: {
              type: 'string',
              example: 'Construction'
            },
            phone: {
              type: 'string',
              example: '+234123456789'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'info@abc-construction.com'
            },
            website: {
              type: 'string',
              format: 'uri',
              example: 'https://abc-construction.com'
            },
            address: {
              type: 'string',
              example: '123 Construction Ave, Lagos, Nigeria'
            },
            country: {
              type: 'string',
              example: 'Nigeria'
            },
            city: {
              type: 'string',
              example: 'Lagos'
            },
            logoUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/logo.jpg'
            },
            bannerUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/banner.jpg'
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              example: ['https://res.cloudinary.com/demo/image/upload/v1234567890/image1.jpg']
            },
            featured: {
              type: 'boolean',
              example: false
            },
            featuredUntil: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2024-12-31T23:59:59.000Z'
            },
            premium: {
              type: 'boolean',
              example: false
            },
            premiumUntil: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2024-12-31T23:59:59.000Z'
            },
            verified: {
              type: 'boolean',
              example: false
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['construction', 'residential', 'commercial']
            },
            facebook: {
              type: 'string',
              example: 'https://facebook.com/abc-construction'
            },
            twitter: {
              type: 'string',
              example: 'https://twitter.com/abc_construction'
            },
            instagram: {
              type: 'string',
              example: 'https://instagram.com/abc_construction'
            },
            linkedin: {
              type: 'string',
              example: 'https://linkedin.com/company/abc-construction'
            },
            location: {
              type: 'string',
              example: 'Victoria Island, Lagos'
            },
            profileUrl: {
              type: 'string',
              format: 'uri',
              example: 'http://localhost:3000/company/abc-construction-ltd'
            },
            viewCount: {
              type: 'integer',
              example: 145
            },
            coordinates: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                  example: 6.5244
                },
                longitude: {
                  type: 'number',
                  example: 3.3792
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },

        CompanyInput: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            name: {
              type: 'string',
              example: 'ABC Construction Ltd'
            },
            description: {
              type: 'string',
              example: 'Leading construction company'
            },
            category: {
              type: 'string',
              example: 'Construction'
            },
            phone: {
              type: 'string',
              example: '+234123456789'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'info@abc-construction.com'
            },
            website: {
              type: 'string',
              format: 'uri',
              example: 'https://abc-construction.com'
            },
            address: {
              type: 'string',
              example: '123 Construction Ave, Lagos'
            },
            country: {
              type: 'string',
              example: 'Nigeria'
            },
            city: {
              type: 'string',
              example: 'Lagos'
            },
            latitude: {
              type: 'number',
              example: 6.5244
            },
            longitude: {
              type: 'number',
              example: 3.3792
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['construction', 'residential']
            },
            facebook: {
              type: 'string',
              example: 'https://facebook.com/abc-construction'
            },
            twitter: {
              type: 'string',
              example: 'https://twitter.com/abc_construction'
            },
            instagram: {
              type: 'string',
              example: 'https://instagram.com/abc_construction'
            },
            linkedin: {
              type: 'string',
              example: 'https://linkedin.com/company/abc-construction'
            }
          }
        },

        CompanyList: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Company'
              }
            },
            total: {
              type: 'integer',
              example: 100
            },
            page: {
              type: 'integer',
              example: 1
            },
            pages: {
              type: 'integer',
              example: 10
            },
            hasLocationFilter: {
              type: 'boolean',
              example: false
            }
          }
        },

        // Payment schemas
        Payment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678902'
            },
            orderId: {
              type: 'string',
              example: 'ORDER_1640995200000_12ab34cd'
            },
            companyId: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678901'
            },
            userId: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678903'
            },
            amount: {
              type: 'number',
              example: 29.99
            },
            currency: {
              type: 'string',
              example: 'USD'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
              example: 'completed'
            },
            provider: {
              type: 'string',
              enum: ['stripe', 'paypal', 'flutterwave', 'paystack', 'momo', 'bank_transfer', 'other'],
              example: 'stripe'
            },
            description: {
              type: 'string',
              example: 'Featured listing for 30 days'
            },
            metadata: {
              type: 'object',
              properties: {
                service: {
                  type: 'string',
                  example: 'featured_listing'
                },
                duration: {
                  type: 'integer',
                  example: 30
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },

        PaymentInput: {
          type: 'object',
          required: ['companyId', 'amount', 'service'],
          properties: {
            companyId: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678901'
            },
            amount: {
              type: 'number',
              example: 29.99
            },
            currency: {
              type: 'string',
              example: 'USD'
            },
            provider: {
              type: 'string',
              enum: ['stripe', 'flutterwave', 'paystack'],
              example: 'stripe'
            },
            service: {
              type: 'string',
              enum: ['featured_listing', 'premium_subscription', 'verification'],
              example: 'featured_listing'
            },
            duration: {
              type: 'integer',
              example: 30
            },
            description: {
              type: 'string',
              example: 'Featured listing for 30 days'
            },
            returnUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://yoursite.com/payment/success'
            },
            cancelUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://yoursite.com/payment/cancel'
            }
          }
        },

        PaymentServices: {
          type: 'object',
          properties: {
            services: {
              type: 'object',
              properties: {
                featured_listing: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Featured Listing'
                    },
                    description: {
                      type: 'string',
                      example: 'Make your company appear at the top of search results'
                    },
                    prices: {
                      type: 'object',
                      properties: {
                        USD: {
                          type: 'object',
                          example: { "30": 29.99, "60": 49.99, "90": 69.99 }
                        }
                      }
                    },
                    features: {
                      type: 'array',
                      items: {
                        type: 'string'
                      },
                      example: ['Top placement in search results', 'Featured badge']
                    }
                  }
                }
              }
            },
            availableProviders: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['stripe', 'flutterwave', 'paystack']
            },
            supportedCurrencies: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['USD', 'XAF', 'NGN']
            }
          }
        },

        // User schemas
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678903'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },

        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'user'
            }
          }
        },

        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },

        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },

        // Activity Log schemas
        ActivityLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678904'
            },
            action: {
              type: 'string',
              example: 'view_company'
            },
            details: {
              type: 'object',
              example: {
                companyId: '60f1b2e4d4b0a12345678901',
                companyName: 'ABC Construction Ltd'
              }
            },
            userAgent: {
              type: 'string',
              example: 'Mozilla/5.0...'
            },
            ipAddress: {
              type: 'string',
              example: '192.168.1.1'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },

        // Category schemas
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60f1b2e4d4b0a12345678905'
            },
            name: {
              type: 'string',
              example: 'Construction'
            },
            description: {
              type: 'string',
              example: 'Construction and building services'
            },
            slug: {
              type: 'string',
              example: 'construction'
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Companies',
        description: 'Company management operations including shareable profile links, location-based filtering, and view tracking'
      },
      {
        name: 'Payments',
        description: 'Payment processing operations with multi-provider support (Stripe, Flutterwave, etc.)'
      },
      {
        name: 'Authentication',
        description: 'User authentication and authorization operations'
      },
      {
        name: 'Users',
        description: 'User management operations (admin only)'
      },
      {
        name: 'Categories',
        description: 'Category management for organizing companies'
      },
      {
        name: 'Activity Logs',
        description: 'Activity logging and analytics tracking'
      },
      {
        name: 'Health',
        description: 'API health and status checks'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info hgroup.main h2 { color: #3b82f6 }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
    `,
    customSiteTitle: 'Construction Market API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none'
    }
  }));

  console.log('📚 Swagger documentation available at: /api-docs');
};

export { swaggerSetup, specs };
export default swaggerSetup;