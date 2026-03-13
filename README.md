# StarBond

StarBond is a web application that combines a Pastebin and URL Shortener, built with Next.js and TypeScript. It allows users to create and share text pastes with various visibility options and to shorten URLs with analytics features. This README provides an overview of the project, setup instructions, API routes, and deployment guidelines.

## Features

- **Paste Creation**: Users can create pastes with options for public, unlisted, or private visibility.
- **URL Shortening**: Users can shorten URLs and track analytics such as click counts.
- **User Authentication**: Secure user registration and login with JWT or session tokens.
- **Responsive Design**: A modern gray theme for a professional user experience.
- **Analytics Dashboard**: Users can view statistics for their pastes and shortened URLs.

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: CSS with a modern gray theme

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- A code editor (e.g., VS Code)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/StarBond.git
   cd StarBond
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the database:

   - Create a PostgreSQL database.
   - Copy `.env.example` to `.env` and update the database connection string.

4. Run Prisma migrations:

   ```
   npx prisma migrate dev --name init
   ```

5. Seed the database (optional):

   ```
   npx ts-node prisma.seed.ts
   ```

6. Start the development server:

   ```
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## API Routes

- **Authentication**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.
  - `GET /api/auth/callback`: Handle authentication callback.

- **Pastes**
  - `POST /api/pastes`: Create a new paste.
  - `GET /api/pastes`: Retrieve all pastes for the authenticated user.
  - `PUT /api/pastes/:id`: Update a specific paste.
  - `DELETE /api/pastes/:id`: Delete a specific paste.

- **URLs**
  - `POST /api/urls`: Create a new shortened URL.
  - `GET /api/urls`: Retrieve all shortened URLs for the authenticated user.
  - `GET /api/urls/:slug`: Redirect to the original URL based on the slug.

## Deployment

For detailed deployment instructions, refer to the [DEPLOYMENT.md](docs/DEPLOYMENT.md) file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.# StarBond
