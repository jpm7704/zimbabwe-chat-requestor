# Zimbabwe Chat Requestor

## Project Overview

A support request management system with role-based workflow for approvals, field work tracking, and document management using Supabase.

## Features

- **User Authentication**: Secure login and registration with Supabase Auth
- **Role-Based Access Control**: Different permissions for users, field officers, program managers, and administrators
- **Request Management**: Create, track, and manage support requests
- **Document Management**: Upload, view, and manage documents related to requests
- **Field Work Tracking**: Schedule and monitor field visits
- **Reporting**: Generate and view reports on field activities
- **Real-time Notifications**: Get updates on request status changes and assignments
- **Analytics Dashboard**: Visualize key metrics and performance indicators
- **Responsive Design**: Works on desktop and mobile devices

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

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

## Technologies Used

This project is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **State Management**: React Query
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Charts**: Recharts

## How can I deploy this project?

This project can be deployed using various hosting platforms:

### Netlify

1. Create a Netlify account if you don't have one
2. Connect your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy the site

### Vercel

1. Create a Vercel account if you don't have one
2. Import your GitHub repository
3. Configure the project settings
4. Deploy the site

### GitHub Pages

1. Update the `vite.config.ts` file to include your base path
2. Run `npm run build`
3. Deploy the `dist` folder to GitHub Pages
