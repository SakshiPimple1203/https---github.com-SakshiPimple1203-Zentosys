# TaskBoard - Project Management Application

A Trello-like project management application built with Next.js, React, and Tailwind CSS.

## Features

- 📋 Create and manage boards
- 📝 Create lists and tasks
- 🔄 Drag and drop tasks between lists
- 👥 Collaborate with team members
- 🌓 Light/Dark mode support
- 🔒 Authentication system
- 📱 Responsive design

## Tech Stack

- Next.js 13
- React 18
- Tailwind CSS
- shadcn/ui components
- React Beautiful DND
- Lucide React icons
- React Hook Form
- Zod validation

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
  - `/boards` - Board-related components
  - `/layout` - Layout components
  - `/providers` - Context providers
  - `/tasks` - Task-related components
  - `/ui` - UI components (shadcn/ui)
- `/lib` - Utility functions and types
- `/hooks` - Custom React hooks

## Authentication

The project includes a mock authentication system. In a production environment, you would need to implement a proper authentication service.

Default credentials for testing:
- Email: any valid email
- Password: minimum 6 characters

## Features

### Boards
- Create new boards
- Edit board titles
- Share boards with team members
- Delete boards
- Set board visibility (private/team/public)

### Lists
- Create new lists
- Rename lists
- Drag and drop to reorder
- Delete lists

### Tasks
- Create tasks with title and description
- Add labels to tasks
- Assign members to tasks
- Set due dates
- Drag and drop between lists
- View task details
- Edit task information

### Activity Tracking
- View recent activity on boards
- Track changes to tasks and lists
- See member actions

## License

MIT