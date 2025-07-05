# Security Guidelines

## Environment Variables

This project uses environment variables to store sensitive information. Never commit these to version control.

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=your_site_url_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# SMTP Configuration
SMTP_HOST=your_smtp_host_here
SMTP_PORT=your_smtp_port_here
SMTP_USER=your_smtp_user_here
SMTP_PASS=your_smtp_password_here
FROM_EMAIL=your_from_email_here
```

### Security Best Practices

1. **Never commit sensitive data to version control**
2. **Use environment variables for all secrets**
3. **Rotate credentials regularly**
4. **Use different credentials for development and production**
5. **Keep `.env.local` in `.gitignore`**

### Scripts Usage

All scripts in the `scripts/` directory now use environment variables. To run them:

```bash
# Make sure .env.local is configured
npm run script-name
```

## Incident Response

If sensitive data is accidentally committed:

1. **Immediately rotate all exposed credentials**
2. **Remove the sensitive data from git history**
3. **Force push the cleaned history**
4. **Update environment variables with new credentials**
