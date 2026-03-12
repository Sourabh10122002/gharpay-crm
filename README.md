# GharPay CRM - Client

This is the frontend client for the GharPay CRM, built with Next.js and styled with Tailwind CSS.

## Tech Stack

- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautifully simple, open-source icons
- **React Query (TanStack)**: Powerful asynchronous state management
- **Axios**: Promised-based HTTP client
- **Chart.js**: Simple yet flexible JavaScript charting
- **Framer Motion**: A production-ready motion library for React
- **React Hook Form**: Performant, flexible and extensible forms
- **TypeScript**: Typed JavaScript

## Getting Started

### Prerequisites

- Node.js installed

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the `client` directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```
   *Note: Change this URL if your backend server is running on a different port or hosted elsewhere.*

### Running the Client

- **Development**:
  ```bash
   npm run dev
   ```
- **Build**:
  ```bash
   npm run build
   ```
- **Production**:
  ```bash
   npm run start
   ```
- **Lint**:
  ```bash
   npm run lint
   ```

## Project Structure

- `src/app`: Next.js App Router pages and layouts
- `src/components`: Reusable UI components
- `src/lib`: Utility functions, constants, and shared logic
- `src/hooks`: Custom React hooks for API calls and state management
- `public`: Static assets (images, icons, etc.)

## Features

- **Dashboard**: Real-time overview of CRM activities and performance.
- **Leads Management**: Track, assign, and update lead status.
- **Property Listing**: Manage property details and availability.
- **Visit Scheduling**: Schedule and track property visits.
- **Activity Timeline**: View a comprehensive history of interactions for each lead.
