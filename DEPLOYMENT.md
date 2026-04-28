# Deployment Guide - BitLearn

Complete guide for deploying BitLearn to production on Vercel.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Database Migration](#database-migration)
5. [Post-Deployment Testing](#post-deployment-testing)
6. [Production Optimization](#production-optimization)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code changes are committed and pushed to GitHub
- [ ] Local development tests pass
- [ ] No console errors in development
- [ ] Environment variables are documented
- [ ] Database schema is finalized
- [ ] All third-party services (AWS, Razorpay, etc.) are configured
- [ ] Payment gateway credentials are ready (test → production transition planned)
- [ ] Email service credentials are working
- [ ] S3 bucket is created and accessible
- [ ] Domain is purchased and DNS configured (if using custom domain)

---

## Environment Setup

### 1. Prepare Production Credentials

#### Razorpay
1. Create account at [razorpay.com](https://razorpay.com)
2. Complete business verification
3. Get **Production** API keys:
   - Dashboard → Settings → API Keys
   - Switch from "Test" to "Live" mode
   - Copy Key ID and Secret
4. Keep separate from test credentials

#### AWS S3
1. Create IAM user with S3 permissions
2. Generate access keys
3. Create S3 bucket for media
4. Configure CORS:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["https://yourdomain.com"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

#### Resend Email
1. Sign up at [resend.com](https://resend.com)
2. Add your domain
3. Get API key
4. Configure DNS records per Resend instructions

#### Better-Auth
1. Generate a strong secret key:
   ```bash
   openssl rand -base64 32
   ```

#### Google & GitHub OAuth
1. Update redirect URIs to production domain:
   - Google: `https://yourdomain.com/api/auth/callback/google`
   - GitHub: `https://yourdomain.com/api/auth/callback/github`

---

## Vercel Deployment

### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "Add New" → "Project"
4. Select your BitLearn repository
5. Click "Import"

### Step 2: Configure Project Settings

**Framework & Build:**
- Framework: Next.js (auto-detected)
- Build Command: `pnpm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)

**Root Directory:**
- Leave as `.` (root)

### Step 3: Set Environment Variables

Click "Environment Variables" and add all variables from `.env.example`:

**Database:**
```
DATABASE_URL = postgresql://...
```

**Authentication:**
```
BETTER_AUTH_SECRET = your-secret-key
BETTER_AUTH_URL = https://yourdomain.com
Auth_Github_Client_Id = xxx
Auth_Github_Secret = xxx
Auth_GOOGLE_CLIENT_ID = xxx
Auth_GOOGLE_CLIENT_SECRET = xxx
```

**AWS S3:**
```
AWS_ACCESS_KEY_ID = xxx
AWS_SECRET_ACCESS_KEY = xxx
AWS_REGION = auto
AWS_ENDPOINT_URL_S3 = https://...
AWS_ENDPOINT_URL_IAM = https://...
NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES = your-bucket
```

**Payment (Razorpay):**
```
RAZORPAY_KEY_ID = rzp_live_xxxxx  # PRODUCTION KEY
RAZORPAY_KEY_SECRET = xxxxx
```

**Email:**
```
RESEND_API_KEY = re_xxxxx
RESEND_DOMAIN = noreply.yourdomain.com
```

**Security:**
```
ARCJET_KEY = ajkey_xxxxx
ARCJET_ENV = production
```

**Public:**
```
NEXT_PUBLIC_APP_URL = https://yourdomain.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Vercel automatically builds and deploys
3. Check deployment status in Vercel dashboard
4. View at provided URL (e.g., `https://bitlearn.vercel.app`)

---

## Database Migration

After first deployment, run migrations:

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Run migrations on production database
npx prisma migrate deploy --skip-generate
```

### Option 2: Using Prisma Studio (One-time)

```bash
# Push schema to production
npx prisma db push
```

### Option 3: Manual via SSH (if available)

```bash
# Connect to production environment
vercel env pull .env.production.local

# Run migrations
npx prisma migrate deploy
```

### Verify Migration

```bash
# Check if tables exist
npx prisma studio  # In production context
```

---

## Post-Deployment Testing

### 1. Test Core Functionality

- [ ] **Authentication:**
  - [ ] Google OAuth works
  - [ ] GitHub OAuth works
  - [ ] Email login works (if enabled)
  - [ ] Session persistence works

- [ ] **Courses:**
  - [ ] Browse published courses
  - [ ] View course details
  - [ ] See curriculum and lessons

- [ ] **Enrollment & Payment:**
  - [ ] Click "Enroll" button
  - [ ] Razorpay checkout opens
  - [ ] Complete test payment
  - [ ] Enrollment creates successfully
  - [ ] Can access classroom

- [ ] **Classroom:**
  - [ ] Video loads from S3
  - [ ] Can navigate lessons
  - [ ] Mobile responsive

- [ ] **Admin Dashboard:**
  - [ ] Login as admin
  - [ ] View analytics
  - [ ] View enrollments
  - [ ] Can revoke student access

- [ ] **Email:**
  - [ ] Verification emails send
  - [ ] Notification emails send
  - [ ] Invitation emails send

### 2. Performance Testing

```bash
# Use Vercel Analytics
# Dashboard → Analytics tab

# Check metrics:
# - First Contentful Paint (FCP)
# - Largest Contentful Paint (LCP)
# - Cumulative Layout Shift (CLS)
```

### 3. Security Testing

- [ ] No sensitive data exposed in browser
- [ ] API calls are authenticated
- [ ] CORS is properly configured
- [ ] Rate limiting works (ArcJet)

---

## Production Optimization

### 1. Enable Vercel Analytics

```bash
vercel analytics enable
```

### 2. Configure Caching

Add to `next.config.ts`:
```typescript
const config: NextConfig = {
  images: {
    unoptimized: false,
    domains: ['your-s3-endpoint.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
  },
};
```

### 3. Enable Compression

Vercel handles gzip/brotli automatically.

### 4. Set Cache Headers

```typescript
// In route handlers or middleware
response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
```

### 5. Database Connection Pooling

Neon automatically provides connection pooling. Verify in dashboard:
```
Settings → Connection Pooling → Enabled
```

---

## Monitoring & Troubleshooting

### Monitor Deployment

1. **Vercel Dashboard:**
   - Deployments → View logs
   - Analytics → Performance metrics
   - Integrations → Check status

2. **Error Tracking:**
   - View error logs in Vercel Console
   - Check application logs: `vercel logs`

### Common Deployment Issues

#### Issue: Build Fails with "Module not found"

**Solution:**
```bash
# Ensure all dependencies are listed in package.json
pnpm install

# Verify locally builds
pnpm run build

# Check for missing import paths
# Update imports to use proper aliases (@/)
```

#### Issue: Environment Variables Not Loading

**Solution:**
```bash
# Verify variables are set in Vercel
vercel env list

# Pull and check locally
vercel env pull .env.production.local

# Redeploy after setting variables
# Deployments → Redeploy
```

#### Issue: Database Connection Error

**Solution:**
```bash
# Verify DATABASE_URL is correct
# Test connection: ping Neon database
# Check IP whitelist in Neon console
# Ensure SSL mode is enabled (sslmode=require)
```

#### Issue: S3 Upload Fails

**Solution:**
```bash
# Verify AWS credentials
# Check IAM policy includes s3:PutObject
# Verify bucket name is correct
# Check CORS configuration
# Test with: aws s3 ls
```

#### Issue: Payment Processing Fails (401)

**Solution:**
```bash
# Verify Razorpay production credentials
# Not test credentials!
# Log into dashboard → Settings → API Keys
# Ensure you're on LIVE mode (not TEST)
# Copy the LIVE credentials to Vercel
# Redeploy
```

#### Issue: Emails Not Sending

**Solution:**
```bash
# Verify RESEND_API_KEY
# Check domain is verified in Resend
# Verify DNS records are correct
# Check email logs in Resend dashboard
```

### Enable Debug Logging

Add to `lib/env.ts`:
```typescript
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
```

Use in server actions:
```typescript
if (isProduction) {
  console.log('[PROD]', message);
}
```

View in Vercel logs:
```bash
vercel logs --tail
```

---

## Rollback Strategy

If deployment has issues:

### Quick Rollback

1. **Vercel Dashboard:**
   - Deployments
   - Find last stable deployment
   - Click → "Redeploy"

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Vercel automatically redeploys
```

### Database Rollback

```bash
# If schema was changed
npx prisma migrate resolve --rolled-back <migration-name>
# Or restore from backup if available
```

---

## Performance Benchmarks

After deployment, monitor these metrics:

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | - |
| Largest Contentful Paint | < 2.5s | - |
| Time to Interactive | < 3.5s | - |
| Cumulative Layout Shift | < 0.1 | - |
| API Response Time | < 200ms | - |

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check Vercel dashboard for errors
- Monitor analytics
- Check error logs

**Monthly:**
- Review database performance
- Update dependencies: `pnpm update`
- Test all critical user flows

**Quarterly:**
- Security audit
- Performance optimization
- Backup database

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update all
pnpm update

# Or specific package
pnpm update @prisma/client

# Test locally
pnpm run dev
pnpm run build

# Deploy
git add .
git commit -m "chore: update dependencies"
git push origin main
```

---

## Support & Troubleshooting

- **Vercel Status:** [status.vercel.com](https://status.vercel.com)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Neon Support:** [neon.tech/docs](https://neon.tech/docs)
- **Razorpay Docs:** [razorpay.com/docs](https://razorpay.com/docs)

---

## Emergency Contacts

- **System Admin:** Your Name (contact@email.com)
- **DevOps Contact:** Team Name
- **Billing Issues:** Finance Team

---

**Last Updated:** 2026-04-29  
**Version:** 1.0
