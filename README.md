# Attendance Automation System

A cloud-based attendance automation system for Akrivia HCM that automatically logs employees in/out at scheduled times using browser automation.

## Features

- **Automated Attendance**: Automatically punch in/out on Akrivia HCM
- **Cloud-Native**: Designed to run on free cloud platforms
- **Web Interface**: User-friendly web UI for managing employees
- **REST API**: Programmatic access for integrations
- **Secure**: Encrypted credentials with environment-based configuration
- **Audit Logging**: Complete logs of all attendance actions
- **Multi-Platform**: Docker containerized for easy deployment

## Quick Cloud Deployment

### Option 1: Railway (Recommended - Free Tier)

1. **Fork this repository** to your GitHub account
2. **Connect to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Create new project from your forked repo
3. **Set Environment Variables** in Railway dashboard:
   ```
   ENCRYPTION_KEY=your_32_char_hex_key_here
   SALT=your_secure_salt_here
   ENABLE_AUTOMATION=true
   ```
4. **Deploy**: Railway will automatically build and deploy using Docker
5. **Access**: Your app will be available at `https://your-project.railway.app`

### Option 2: Render

1. **Fork this repository**
2. **Connect to Render**:
   - Go to [Render.com](https://render.com)
   - Connect GitHub and select your fork
3. **Create Web Service**:
   - Runtime: Docker
   - Build Command: (leave default)
   - Start Command: `pnpm run start:v2`
4. **Set Environment Variables** (same as above)
5. **Deploy**

### Option 3: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Clone/Fork repository**
3. **Deploy**:
   ```bash
   fly launch
   fly secrets set ENCRYPTION_KEY=your_key
   fly secrets set SALT=your_salt
   fly deploy
   ```

### Option 4: GitHub Actions (Automation Only)

For automation only (no persistent web UI):
1. **Fork repository**
2. **Add secrets** in GitHub repo settings:
   - `ENCRYPTION_KEY`
   - `SALT`
3. **The workflow** will run every 5 minutes automatically
4. **Data persistence** requires additional cloud storage setup

## Local Development

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Development mode
pnpm run dev:v2

# Production build
pnpm run build
pnpm run start:v2
```

## Docker Deployment

```bash
# Build image
docker build -t attendance-app .

# Run locally
docker run -p 7889:7889 -v $(pwd)/data:/app/data attendance-app

# Or use docker-compose
docker-compose up -d
```

## API Usage

### Add User
```bash
POST /api/sync-user
{
  "id": "employee123",
  "password": "password",
  "loginTime": "09:00",
  "logoutTime": "18:00",
  "weekdays": [1,2,3,4,5]
}
```

### Get Attendance Logs
```bash
GET /api/attendance/logs?userId=employee123&limit=50
```

### Manual Trigger
```bash
POST /api/attendance/trigger
```

## Web Interface

Access the web UI at the root URL to:
- Search and manage users
- View attendance status
- Add new employees
- Monitor automation logs

## Security Notes

- Generate your own `ENCRYPTION_KEY` (32 hex characters)
- Use a strong `SALT` value
- Never commit real credentials to version control
- Regularly rotate encryption keys

## Architecture

- **Frontend**: Vanilla JS web interface
- **Backend**: Express.js REST API
- **Automation**: Puppeteer browser automation
- **Storage**: JSON files (easily replaceable with databases)
- **Scheduling**: Cron jobs or cloud schedulers

## Supported Platforms

- Railway (Free tier: 512MB RAM, persistent)
- Render (Free tier: 750 hours/month)
- Fly.io (Free tier: 3 shared CPUs, 256MB RAM each)
- GitHub Actions (Free tier: 2000 minutes/month)

## Troubleshooting

- **Puppeteer issues**: Ensure Chromium is installed in Docker
- **Memory limits**: Free tiers have RAM limits; optimize Puppeteer usage
- **Timeouts**: Increase timeouts for slower networks
- **Data persistence**: Use cloud storage for production data