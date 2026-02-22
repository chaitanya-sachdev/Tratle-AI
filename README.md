# Tratle-AI - Trade Optimization Platform

A comprehensive trade optimization platform that leverages Groq's AI capabilities to classify products, calculate duties, and optimize international trade operations.

## Project Architecture

This is a full-stack application with:

- Backend: FastAPI with Python, integrating Groq's Llama 3.3-70B model for AI-powered trade analysis
- Frontend: React + TypeScript with Vite, using shadcn/ui components and Tailwind CSS
- AI Integration: Groq API for HS code classification and trade optimization

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+ (with npm)
- Groq API key (get one at https://console.groq.com/)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

Important: You must add your Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Start the Backend Server

```bash
# In the backend directory (with virtual environment activated)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Available Features

### API Endpoints

#### Product Classification
- `POST /api/v1/classify/` - Classify products into HS codes using AI
- Request: `{ "description": "Product description" }`
- Response: HS code analysis with confidence scores and alternatives

#### Trade Calculation
- `POST /api/v1/trade/calculate` - Calculate duties and optimize trade routes
- Request: Product and trade details
- Response: Comprehensive trade analysis including duties, tariffs, and optimization suggestions

#### Health Check
- `GET /` - Service health status

## Development

### Backend Development

The backend uses FastAPI with the following structure:

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── models/              # Pydantic models for requests/responses
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic and external integrations
│   └── utils/               # Utility functions
├── requirements.txt         # Python dependencies
└── .env                    # Environment variables
```

### Frontend Development

The frontend is built with modern React technologies:

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   └── utils/              # Utility functions
├── package.json           # Node.js dependencies
└── vite.config.ts         # Vite configuration
```

## Testing

### Backend Tests
```bash
cd backend
python -m pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Sample Data

A sample BOM (Bill of Materials) is provided at `sample_bom.csv` for testing the trade optimization features.

## Environment Variables

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
```

## Troubleshooting

### Common Issues

1. Groq API Key Not Working
   - Ensure your API key is valid and has credits
   - Check that the key is properly set in `backend/.env`
   - Verify the key doesn't have trailing spaces

2. Backend Connection Issues
   - Ensure the backend is running on port 8000
   - Check that the virtual environment is activated
   - Verify all dependencies are installed

3. Frontend Build Issues
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Ensure Node.js version is 16 or higher

### Mock Mode

The application includes a mock mode that returns sample data when no valid Groq API key is provided. This is useful for testing the UI without API usage.

## Deployment

### Backend Deployment
```bash
# Build for production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting provider
```
