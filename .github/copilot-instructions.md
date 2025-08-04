# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a React frontend application for a centralized authentication control panel. The system manages multi-application authentication with dynamic menu generation based on user roles.

## Backend Schema
The backend uses MongoDB with the following models:
- **Application**: Systems registered with unique alias (e.g., "crm", "admin", "erp")
- **Menu**: Hierarchical menu options per application
- **Role**: Defines menu access within an application  
- **User**: Users with multiple roles per application

## Authentication Flow
- Users authenticate with: username, password, and application alias
- Login returns: user data, application, assigned roles, and dynamic menu
- Menu is generated dynamically based on user's roles

## Tech Stack
- React with Vite
- Material-UI for components
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls
- Context API for state management

## Code Patterns
- Use functional components with hooks
- Implement proper error handling
- Follow Material-UI design patterns
- Use TypeScript-like JSDoc comments for better IntelliSense
