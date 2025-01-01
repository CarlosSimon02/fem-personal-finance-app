# Personal Finance App

A modern and user-friendly personal finance management application built with Next.js and Firebase.

## Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Reusable component library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Backend & Database

- **Firebase** - Backend services and database

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files
- **TypeScript** - Static type checking

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
└── lib/             # Utility functions and configurations
```

### Key Directories and Files

- `src/app/` - Contains all the routes and pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions, types, and configurations
- `public/` - Static assets
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - Shadcn UI components configuration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with your Firebase configuration

4. Run the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use named exports instead of default exports
- Keep components small and focused on a single responsibility

### Component Structure

- Place reusable components in `src/components`
- Group related components in subdirectories
- Use the `.tsx` extension for React components
- Follow atomic design principles where applicable

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `useAuth.ts`)
- **Files**: kebab-case for pages (e.g., `about-us.tsx`)
- **CSS Classes**: Follow Tailwind CSS conventions

### Git Workflow

- Write clear, concise commit messages
- Use feature branches for new features
- Submit pull requests for review
- Ensure all tests pass before merging

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prepare` - Install Husky hooks

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
