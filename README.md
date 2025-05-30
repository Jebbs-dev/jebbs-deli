# Jebbs Deli

## Author
**Fulness Ojebiyi**

## Overview
Jebbs Deli is a modern food delivery platform built with Next.js 14. It provides a seamless experience for customers to order meals from their favorite restaurants. The application features a beautiful, responsive UI with real-time order tracking, location-based services, and an intuitive user interface.

## Tech Stack
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Shadcn UI (Radix UI)
- **Data Fetching**: TanStack Query
- **Animation**: Framer Motion
- **Icons**:Lucide React, React Icons
- **Maps**: Google Maps API
- **Type Safety**: TypeScript

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Maps API key

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd jebbs-deli
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 || https://your-production-domain.com
   
   # Google Maps Configuration
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure
```
jebbs-deli/
├── src/
│   ├── app/          # Next.js app directory and page components
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and configurations
│   ├── modules/      # Feature-specific modules
│   ├── providers/    # React context providers
│   ├── store/        # Zustand state management
│   ├── styles/       # Global styles and Tailwind config
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Helper functions and utilities
├── public/           # Static assets
└── ...
```

## Key Features
- Location-based restaurant discovery
- Real-time order tracking
- Interactive maps integration
- Responsive and modern UI design
- Interactive animations with Framer Motion
- Advanced state management
- Type-safe development

## Third-Party Libraries
- **@radix-ui/react-***: Accessible UI components
- **framer-motion**: Animation library
- **react-icons**: Icon library
- **zustand**: State management
- **class-variance-authority**: Component styling utilities
- **tailwind-merge**: Tailwind CSS class merging
- **tailwindcss-animate**: Animation utilities
- **@react-google-maps/api**: Google Maps integration

## Development Notes
- TypeScript is strictly enforced
- ESLint is configured for code quality
- Tailwind CSS is used with a custom configuration
- Modern ESLint configuration

## Deployment
The application can be deployed on Vercel or any other platform that supports Next.js applications. Make sure to:
1. Set up all environment variables in your deployment platform
2. Configure the Google Maps API key for production
3. Update any API endpoints to production URLs

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
Copyright (c) 2025 Fulness Ojebiyi

All rights reserved.
