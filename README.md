# GRC System - Open Source Governance, Risk & Compliance Platform

## 🎯 Overview

An open-source alternative to commercial GRC solutions (like ServiceNow GRC, MetricStream, LogicGate), built with modern web technologies to help organizations manage their governance, risk, and compliance requirements effectively.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker Desktop (for PostgreSQL and Redis)
- Git
- Windows 10/11 (scripts optimized for Windows)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/kaiser100010/grc-system.git
cd grc-system
```

2. **Install dependencies:**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

3. **Start Docker containers:**
```bash
# Make sure Docker Desktop is running
cd docker
docker-compose up -d
```

4. **Set up the database:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

5. **Start the development servers:**

In separate terminals:

```bash
# Terminal 1 - Frontend (http://localhost:3000)
cd frontend
npm run dev

# Terminal 2 - Backend (http://localhost:5000)
cd backend
npm run dev
```

## 📁 Project Structure

```
grc-system/
├── frontend/               # React + TypeScript + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── modules/   
│   │   │       └── resources/
│   │   │           └── employees/  # ✅ Complete Employee module
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # Global styles
├── backend/                # Node.js + Express + Prisma API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Express middleware
│   └── prisma/
│       └── schema.prisma  # Database schema
├── docker/                 # Docker configuration
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
└── scripts/                # Utility scripts
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **Redis** - Caching
- **JWT** - Authentication
- **Zod** - Validation

### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD (planned)

## 📦 Features

### Implemented ✅
- **Employee Management Module**
  - Complete CRUD operations
  - Advanced search and filters
  - Department-based organization
  - Skills tracking
  - Export to CSV
  - Detailed employee profiles

### In Development 🚧
- **Task Management** - Kanban board, assignments, tracking
- **Risk Management** - Risk matrix, assessments, mitigation
- **Control Management** - Control frameworks, compliance tracking
- **Dashboard** - KPIs, charts, metrics

### Planned 📋
- **Incident Management** - Incident reporting and tracking
- **Policy Management** - Document management, approvals
- **Evidence Management** - File uploads, audit trails
- **Vendor Management** - Third-party risk management
- **Audit Module** - Audit planning and execution
- **Reports & Analytics** - Custom reports, dashboards

## 🖥️ Screenshots

### Employee Management Module
- Employee List with filters and pagination
- Employee Form for creating/editing
- Detailed Employee View
- Export functionality

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
cd frontend
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

#### Backend
```bash
cd backend
npm run dev        # Start development server (http://localhost:5000)
npm run build      # Compile TypeScript
npm run start      # Start production server
npm run lint       # Run ESLint
```

#### Database
```bash
cd backend
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma migrate reset # Reset database
npx prisma studio        # Open Prisma Studio (GUI)
```

### API Endpoints

#### Employee Module
- `GET /api/employees` - List all employees with pagination
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## 🔐 Environment Variables

Create `.env` files:

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grc_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm run test

# Run backend tests
cd backend
npm run test
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

### Docker Production

```bash
docker-compose -f docker/docker-compose.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Kaiser** - Initial work - [kaiser100010](https://github.com/kaiser100010)

## 🙏 Acknowledgments

- Inspired by enterprise GRC solutions
- Built with modern open-source technologies
- Community contributions welcome

## 📞 Support

- Open an issue for bug reports
- Start a discussion for feature requests
- Check the wiki for documentation

## 🗺️ Roadmap

### Phase 1 - Foundation (Current)
- [x] Project setup and structure
- [x] Database schema design
- [x] Employee management module
- [ ] Authentication & authorization
- [ ] Basic dashboard

### Phase 2 - Core Modules
- [ ] Task management
- [ ] Risk assessment
- [ ] Control frameworks
- [ ] Incident management

### Phase 3 - Advanced Features
- [ ] Workflow automation
- [ ] Reporting engine
- [ ] API documentation
- [ ] Multi-tenancy support

### Phase 4 - Enterprise Ready
- [ ] Advanced analytics
- [ ] Integration APIs
- [ ] Mobile app
- [ ] Compliance frameworks (ISO 27001, SOC 2, etc.)

## 📊 Project Status

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

**Last Updated**: January 2025