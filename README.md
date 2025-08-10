# Nullmail

Nullmail is a privacy-focused, ephemeral tempmail service built with SvelteKit, Supabase, and ForwardEmail. It provides instant, disposable inboxes with automatic expiry, no sign-up, and no tracking. Ideal for quick, anonymous email verification and sign-up flows.

Nullmail addresses the need for a quick, privacy-preserving way to receive emails without registration or tracking. It’s ideal for users who want to protect their identity during online sign-ups or verifications.

## Key Features
- Ephemeral, disposable inboxes.
- Automatic email expiration.
- No sign-up or personal info required.
- No tracking or logging of user data.
- Built with SvelteKit, Supabase, ForwardEmail, Cloudflare Tunnel.

## Live Site

Nullmail is running in production at [https://nullmail.cc](https://nullmail.cc). Feel free to try it out!

## Getting Started for Developers

1. **Clone the repository:**  
   `git clone <repo-url>`

2. **Install dependencies:**  
   `npm install`

3. **Install Cloudflared:**  
   Download and install `cloudflared` from [Cloudflare Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).

4. **Set up environment variables:**  
   Copy `.env.example` to `.env` and fill in the required secrets (Supabase, ForwardEmail, etc.).

5. **Set up Cloudflare tunnel:**  
   - Authenticate with Cloudflare: `cloudflared login`  
   - Create/configure your tunnel (or use provided `config.yml`).

6. **Initialize Supabase:**
   Run db/migrate.sql in the supabase dashboard SQL Editor to set up the database schema.

7. **Set up email forwarding:**  
   Configure ForwardEmail to forward emails to `https://your-domain.com/api/webhooks/forwardemail`.

8. **Start development server:**  
   `npm run dev`

9.  **(Optional) Start Cloudflare tunnel for remote access:**  
   `npm run tunnel`

## Scripts

- **Development server:**  
  `npm run dev`  
  Starts the SvelteKit development server.

- **Build for production:**  
  `npm run build`  
  Creates a production build of the app.

- **Preview production build locally:**  
  `npm run preview`

- **Cloudflare Tunnel for development:**  
  `npm run tunnel`  
  Exposes your local dev server via Cloudflare tunnel (see config.yml).

- **Deploy to Vercel (preview):**  
  `npm run vercel:preview`  
  Deploys a preview build to Vercel.

- **Deploy to Vercel (production):**  
  `npm run vercel:prod`  
  Deploys the latest code to Vercel production.

## Environment Variables

Secrets and API keys (e.g., Supabase, ForwardEmail) should be set in the Vercel dashboard.

Refer to `.env.example` for all required environment variables and ensure they are configured before running the app.

## Project Structure

- SvelteKit frontend and API routes.
- Supabase backend.
- Forwardemail.net for email forwarding.
- Tailwind CSS for styling.
- Cloudflare tunnel for local development.

## Security and Abuse Considerations

Nullmail is designed with privacy and security in mind, but temporary email services inherently face challenges related to abuse and misuse. Below are some key considerations and measures taken to mitigate risks:

### Privacy First
Nullmail does not require any personal information or sign-up. It does not track or log user activity beyond what is necessary for core functionality. Emails are stored temporarily and deleted automatically after expiration to minimize data retention.

### Automatic Expiry and Cleanup
Temporary inboxes and their emails are automatically deleted after a short, predefined period, minimizing data retention and reducing attack surface.

### Abuse Mitigation
Nullmail leverages Cloudflare rate limiting to control email creation and message fetching, helping prevent spam, phishing, and other abuse.

### Security Best Practices
Communications between clients and the backend occur over HTTPS to protect data in transit. Sensitive configuration data such as API keys and secrets are stored securely in environment variables and never exposed to the client.

> **Disclaimer:**  
> While Nullmail strives to provide a secure and private service, temporary email services may be inherently vulnerable to certain abuses. Users should not rely on Nullmail for sensitive or long-term communications. The service is provided “as-is” without guarantees, and the maintainers are not responsible for any misuse.


## Contributing

Contributions, issues, and feature requests are welcome! Please open an issue or submit a pull request.

## License  
[MIT](LICENSE) © gkoos
