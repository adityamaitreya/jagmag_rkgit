# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ab6f9977-417d-4d5f-9ce8-e2716bca4eaa

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ab6f9977-417d-4d5f-9ce8-e2716bca4eaa) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

There are several ways to deploy this project:

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/ab6f9977-417d-4d5f-9ce8-e2716bca4eaa) and click on Share -> Publish.

### Manual Deployment

#### Netlify

1. Build the project locally:
   ```sh
   npm run build
   ```

2. Deploy using Netlify CLI:
   ```sh
   # Install Netlify CLI if you haven't already
   npm install -g netlify-cli
   
   # Deploy to Netlify
   netlify deploy
   ```

3. Or deploy via the Netlify UI:
   - Go to [Netlify](https://app.netlify.com/)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository for continuous deployment

#### Vercel

1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```sh
   vercel
   ```

3. Or deploy via the Vercel UI:
   - Go to [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Vercel will automatically detect the Vite project and deploy it

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
