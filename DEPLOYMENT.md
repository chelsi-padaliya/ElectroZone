# ElectroZone - E-commerce Platform

A modern e-commerce platform built with Next.js 16, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 🛍️ Product browsing and search
- 🛒 Shopping cart functionality
- 👤 User authentication (login/register)
- 📧 Email verification with OTP
- 🔐 Password reset functionality
- 💳 Checkout process
- 📦 Order management
- 🎨 Seller dashboard for product management
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: bcryptjs
- **Email**: Nodemailer
- **State Management**: SWR for data fetching
- **Icons**: React Icons

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas database

### Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `MONGODB_URI` with your MongoDB connection string

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Important Notes

- Ensure your MongoDB Atlas allows connections from all IPs (0.0.0.0/0) for Vercel
- All environment variables must be added in Vercel dashboard
- The project uses Next.js App Router and Server Components

## Build

```bash
npm run build
```

## Project Structure

```
electrozone/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── context/          # React context (Cart)
│   ├── lib/              # Utilities (DB, validation)
│   ├── models/           # MongoDB models
│   ├── types/            # TypeScript types
│   └── assets/           # Images and static files
├── public/               # Public assets
└── tailwind.config.ts    # Tailwind configuration
```

## License

MIT
