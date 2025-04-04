# Webflow Authentication Guide

This guide explains how to set up authentication for the n8n Webflow CMS node using either API tokens or OAuth2.

## Required API Permissions

The Webflow CMS node requires a Site API token with the following permissions:

- `sites:read` - To list sites and collections
- `cms:read` - To read collection schemas and items
- `cms:write` - To create and update CMS items

## Obtaining a Webflow API Token

Follow these steps to create an API token with the necessary permissions:

1. **Log in to Webflow**
   - Go to [webflow.com](https://webflow.com/) and sign in to your account

2. **Navigate to Site Settings**
   - Open the site you want to work with
   - Click on the "Settings" icon in the top navigation bar
   - Select "Project Settings" from the dropdown menu

3. **Access Integrations**
   - In the left sidebar, click on "Integrations"
   - Scroll down to find the "API Access" section

4. **Generate a New API Token**
   - Click "Generate API Token"
   - Give your token a descriptive name (e.g., "n8n Integration")
   - Select the required permissions:
     - ✅ `sites:read`
     - ✅ `cms:read` 
     - ✅ `cms:write`

5. **Copy and Store Your Token**
   - Copy the generated token
   - Store it securely as it cannot be viewed again later
   - You'll need to regenerate the token if lost

![Webflow API Token Generation](https://example.com/path-to-image.png)

## Authentication Methods

The Webflow CMS node supports two methods of authentication:

1. **API Token Authentication** - Simple site-specific tokens with limited scope
2. **OAuth2 Authentication** - Enhanced security with user authorization flow and configurable scopes

Each method has its own advantages and use cases. Choose the one that best fits your requirements.

## API Token Authentication

### When to Use API Tokens
- For simple integrations affecting a single site
- When working with private projects
- When you don't need user-specific permissions
- For testing and development environments

### API Version Considerations

The Webflow CMS node supports both v1 and v2 of the Webflow API:

### V1 API (Legacy)
- Mature and stable, but with some limitations
- Uses different endpoint structures
- The node adds appropriate version headers automatically

### V2 API (Default)
- Newer API with enhanced capabilities
- Different response formats in some cases
- Better support for newer Webflow features
- Preferred option when possible

You can toggle between API versions in the node credentials settings.

## OAuth2 Authentication

### When to Use OAuth2
- For integrations that span multiple sites
- When building for multiple users
- When you need user-specific permissions
- For production environments and public applications
- When you need to enforce stronger security standards

### Setting Up OAuth2 Authentication

1. **Create a Webflow Developer Application**
   - Go to [Webflow Dashboard](https://webflow.com/dashboard/workspace/integrations)
   - Click on "Create a new app"
   - Fill in required fields:
     - App Name (visible to users during authorization)
     - Description (explain your app's purpose)
     - App URL (your company or app website)
     - Redirect URI (must match your n8n installation, typically `https://your-n8n-instance.com/rest/oauth2-credential/callback`)

2. **Configure Required Scopes**
   - Select the minimum scopes needed for your integration:
     - `sites:read` - Required to list sites and access site information
     - `cms:read` - Required to read collection schemas and items
     - `cms:write` - Required to create, update, and delete items

3. **Get Client Credentials**
   - After creating your app, you'll receive:
     - Client ID
     - Client Secret
   - Keep these secure as they authenticate your application

4. **Configure n8n Credentials**
   - In n8n, go to Credentials > Add new
   - Search for "Webflow OAuth2 API"
   - Enter your Client ID and Client Secret
   - Save the credentials
   - Click "Connect" to start the OAuth2 flow
   - Sign in to Webflow and authorize your application
   - The credentials will be automatically configured after authorization

### OAuth2 Security Considerations

- OAuth2 tokens expire and are automatically refreshed by n8n
- Specific scopes limit what the integration can access
- Users can revoke access at any time from their Webflow account
- No need to store or manage API tokens manually

## Token Security

Follow these best practices for securing your Webflow API tokens:

1. **Never share tokens publicly**
   - Don't commit tokens to public repositories
   - Don't include them in public documentation

2. **Use environment variables**
   - Store tokens as environment variables
   - Reference them in n8n using expressions

3. **Apply the principle of least privilege**
   - Only grant the permissions your workflows actually need
   - Consider using different tokens for different purposes

4. **Rotate tokens regularly**
   - Generate new tokens periodically
   - Revoke unused tokens

## Rate Limiting

Be aware that the Webflow API has rate limits that will affect your workflows:

- Standard rate limit: 60 requests per minute (1 request per second)
- Rate limits apply per site and per token
- Rate limit headers are included in API responses
- The node will throw an error when rate limits are exceeded

To handle rate limits in your workflows:
- Add delay nodes between batches of operations
- Use "Continue on Fail" with error handling
- Consider splitting large operations across multiple workflows

## Troubleshooting Token Issues

If you encounter authentication errors:

1. **Check token permissions**
   - Verify your token has all required permissions
   - Consider regenerating the token with the correct permissions

2. **Verify expiration**
   - Webflow tokens don't expire by default, but you might have set a custom expiration
   - Regenerate if necessary

3. **Check site ID**
   - Make sure you're using the token with the correct site
   - Site API tokens only work with the site they were created for

4. **API version issues**
   - Some features may not be available in the v1 API
   - Try toggling between v1 and v2 in the credentials settings

## Resources

- [Webflow API Documentation](https://developers.webflow.com/)
- [Understanding Webflow API Authentication](https://developers.webflow.com/docs/authentication)
- [Webflow API Rate Limiting](https://developers.webflow.com/docs/rate-limiting)
