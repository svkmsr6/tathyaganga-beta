# Contributing to Tathyaganga

Thank you for your interest in contributing to Tathyaganga! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Using Replit (Recommended)
1. Fork the project on Replit
2. The development environment will be automatically set up
3. Run the development server using the "Run" button or `npm run dev`
4. Make your changes and test them in real-time

### Local Development
1. Ensure you have Node.js 20+ installed
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SESSION_SECRET`: A random string for session encryption

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Structure
- Place new components in appropriate directories:
  - UI components: `client/src/components/ui/`
  - Layout components: `client/src/components/`
  - Pages: `client/src/pages/`
- Use shadcn/ui components when possible
- Follow the existing component patterns

### State Management
- Use React Query for server state
- Use React context for global UI state
- Keep component state minimal and lift it up when needed

### Database Changes
- Add new models to `shared/schema.ts`
- Use Drizzle ORM for all database operations
- Never write raw SQL queries
- Run migrations using `npm run db:push`

## Testing Your Changes

1. Ensure all features work:
   - Authentication (login/register)
   - Content creation and editing
   - Fact checking
   - Navigation and responsive layout

2. Test across different screen sizes
3. Verify error handling
4. Check console for any warnings or errors

## Submitting Changes

### Via Replit
1. Make your changes in your forked version
2. Test thoroughly
3. Submit a merge request through Replit's interface
4. Provide a clear description of your changes

### Via Git/GitHub
1. Create a new branch for your feature/fix
2. Make your changes
3. Commit with clear, descriptive messages
4. Push your branch
5. Create a pull request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Steps to test

## Need Help?

- Check the existing documentation
- Ask questions in the project's discussion forum
- Contact the maintainers

Thank you for contributing to Tathyaganga! Your efforts help make our platform better for everyone.
