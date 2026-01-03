# DIETEC FastAPI Backend

A modern, async Python backend for AI features and complex processing in the DIETEC health app.

## Hybrid Architecture

This backend works **alongside Supabase**, not as a replacement:

| Component | Supabase | FastAPI |
|-----------|----------|---------|
| **Authentication** | ✅ Login, Signup, OAuth | Verifies Supabase tokens |
| **User Data** | ✅ Profiles, preferences | - |
| **AI Chat** | - | ✅ ChatGPT integration |
| **Health Analytics** | - | ✅ Complex calculations |
| **ML Features** | - | ✅ Food recognition, etc. |

## Features

- 🚀 **FastAPI** - Modern, fast web framework for building APIs
- 🔐 **Supabase Auth** - Verifies Supabase JWT tokens
- 🗄️ **SQLite/PostgreSQL** - Flexible database options
- 🤖 **AI Chat** - OpenAI integration for nutrition and health advice
- 📊 **Health Tracking** - Steps, water intake, and daily health data
- 🏥 **Medical Records** - Conditions, allergies, and skin problems

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker (optional)

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

The API will be available at http://localhost:8000

### Option 2: Local Development

1. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start PostgreSQL**
   ```bash
   # Using Docker
   docker run -d --name dietec-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=dietec \
     -p 5432:5432 \
     postgres:15-alpine
   ```

5. **Run the server**
   ```bash
   python main.py
   
   # Or with uvicorn
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/verify-supabase` - Verify Supabase token

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/profile` - Get user profile
- `POST /api/v1/users/profile` - Save user profile

### Medical History
- `GET /api/v1/medical/basic-info` - Get basic medical info
- `POST /api/v1/medical/basic-info` - Save basic medical info
- `GET /api/v1/medical/conditions` - Get medical conditions
- `POST /api/v1/medical/conditions` - Create condition
- `POST /api/v1/medical/conditions/bulk` - Bulk save conditions
- `GET /api/v1/medical/allergies` - Get allergies
- `POST /api/v1/medical/allergies` - Create allergy
- `GET /api/v1/medical/skin-problems` - Get skin problems
- `POST /api/v1/medical/skin-problems` - Create skin problem

### AI Chat
- `POST /api/v1/chat/send` - Send message and get AI response
- `GET /api/v1/chat/history` - Get chat history
- `DELETE /api/v1/chat/history` - Clear chat history

### Health Tracking
- `GET /api/v1/health/daily` - Get daily health data
- `POST /api/v1/health/daily` - Update daily health
- `POST /api/v1/health/steps` - Update steps
- `POST /api/v1/health/water` - Update water intake
- `GET /api/v1/health/history` - Get health history

## Project Structure

```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker image config
├── docker-compose.yml     # Docker services
├── .env.example           # Environment template
└── app/
    ├── __init__.py
    ├── core/
    │   ├── config.py      # Settings management
    │   ├── database.py    # Database connection
    │   └── security.py    # Auth utilities
    ├── models/
    │   ├── user.py        # User models
    │   └── medical.py     # Medical models
    ├── schemas/
    │   ├── user.py        # User schemas
    │   └── medical.py     # Medical schemas
    └── api/
        ├── routes.py      # Main router
        └── endpoints/
            ├── auth.py    # Authentication
            ├── users.py   # User management
            ├── medical.py # Medical history
            ├── chat.py    # AI chat
            └── health.py  # Health tracking
```

## Frontend Integration

Add to your frontend `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_FASTAPI=true
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | JWT secret key | Required |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `SUPABASE_URL` | Supabase project URL | Optional |
| `SUPABASE_KEY` | Supabase anon key | Optional |
| `DEBUG` | Enable debug mode | `false` |
| `PORT` | Server port | `8000` |

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
isort .
```

### Type Checking

```bash
mypy .
```

## License

MIT License - See LICENSE file for details.
