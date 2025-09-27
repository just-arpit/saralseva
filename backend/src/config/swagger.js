import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Saral Seva Pro API',
      version: '1.0.0',
      description: 'API documentation for Saral Seva Pro - AI-driven citizen services platform',
      contact: {
        name: 'Saral Seva Team',
        email: 'api@saralseva.gov.in'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.saralseva.gov.in',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'phone', 'password', 'dateOfBirth', 'gender', 'address', 'occupation', 'annualIncome', 'category'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            phone: {
              type: 'string',
              pattern: '^[6-9]\\d{9}$',
              description: '10-digit Indian mobile number'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other', 'prefer-not-to-say']
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                pincode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            occupation: {
              type: 'string'
            },
            annualIncome: {
              type: 'number'
            },
            category: {
              type: 'string',
              enum: ['general', 'obc', 'sc', 'st', 'other']
            },
            isVerified: {
              type: 'boolean'
            },
            isActive: {
              type: 'boolean'
            },
            role: {
              type: 'string',
              enum: ['citizen', 'admin', 'moderator', 'officer']
            }
          }
        },
        Scheme: {
          type: 'object',
          required: ['name', 'description', 'shortDescription', 'category', 'level', 'department', 'benefits'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            shortDescription: {
              type: 'string'
            },
            category: {
              type: 'string',
              enum: ['employment', 'education', 'healthcare', 'housing', 'agriculture', 'business', 'social-security', 'tax-benefits', 'disability', 'women-empowerment', 'senior-citizen', 'skill-development', 'startup', 'rural-development', 'urban-development', 'environment', 'technology', 'financial-inclusion', 'other']
            },
            level: {
              type: 'string',
              enum: ['central', 'state', 'district', 'local']
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'coming-soon', 'expired', 'suspended']
            },
            eligibility: {
              type: 'object'
            },
            benefits: {
              type: 'object'
            }
          }
        },
        Event: {
          type: 'object',
          required: ['title', 'description', 'type', 'category', 'dateTime', 'location', 'organizer'],
          properties: {
            _id: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            type: {
              type: 'string',
              enum: ['workshop', 'seminar', 'training', 'webinar', 'conference', 'awareness-camp', 'health-camp', 'skill-development', 'job-fair', 'exhibition', 'consultation', 'registration-drive', 'document-verification', 'other']
            },
            category: {
              type: 'string'
            },
            dateTime: {
              type: 'object',
              properties: {
                start: { type: 'string', format: 'date-time' },
                end: { type: 'string', format: 'date-time' }
              }
            },
            location: {
              type: 'object'
            },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled', 'postponed']
            }
          }
        },
        Complaint: {
          type: 'object',
          required: ['title', 'description', 'category', 'location', 'incidentDate'],
          properties: {
            _id: {
              type: 'string'
            },
            complaintId: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['submitted', 'under-review', 'investigating', 'action-taken', 'resolved', 'closed', 'rejected']
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent']
            }
          }
        },
        Document: {
          type: 'object',
          required: ['title', 'type', 'category', 'file'],
          properties: {
            _id: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            type: {
              type: 'string',
              enum: ['aadhaar', 'pan', 'passport', 'driving-license', 'voter-id', 'ration-card', 'income-certificate', 'caste-certificate', 'birth-certificate', 'death-certificate', 'marriage-certificate', 'educational-certificate', 'bank-statement', 'salary-slip', 'property-document', 'medical-certificate', 'disability-certificate', 'business-registration', 'other']
            },
            category: {
              type: 'string',
              enum: ['identity', 'address', 'income', 'educational', 'medical', 'legal', 'financial', 'other']
            },
            verification: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'in-progress', 'verified', 'rejected', 'expired']
                },
                confidence: {
                  type: 'number'
                }
              }
            }
          }
        },
        Location: {
          type: 'object',
          required: ['name', 'type', 'category', 'address', 'coordinates'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            type: {
              type: 'string'
            },
            address: {
              type: 'object'
            },
            coordinates: {
              type: 'object',
              properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' }
              }
            },
            operatingHours: {
              type: 'object'
            }
          }
        },
        Notification: {
          type: 'object',
          required: ['title', 'message', 'recipient', 'type', 'category'],
          properties: {
            _id: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            type: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['draft', 'scheduled', 'sending', 'delivered', 'failed', 'cancelled']
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Users',
        description: 'User management and profiles'
      },
      {
        name: 'Schemes',
        description: 'Government schemes and programs'
      },
      {
        name: 'Events',
        description: 'Government events and workshops'
      },
      {
        name: 'Complaints',
        description: 'Citizen complaints and grievances'
      },
      {
        name: 'Documents',
        description: 'Document management and verification'
      },
      {
        name: 'Locations',
        description: 'Government offices and service centers'
      },
      {
        name: 'Notifications',
        description: 'Push notifications and alerts'
      },
      {
        name: 'Dashboard',
        description: 'User dashboard and analytics'
      },
      {
        name: 'Chatbot',
        description: 'AI chatbot interactions'
      },
      {
        name: 'Tax',
        description: 'Tax-related services and calculations'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };