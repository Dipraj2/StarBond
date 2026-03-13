# StarBond Deployment Guide

## Prerequisites

Before deploying the StarBond application, ensure you have the following:

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- A hosting provider that supports Node.js applications (e.g., Vercel, Heroku, DigitalOcean)

## Environment Variables

Create a `.env` file in the root of your project and populate it with the following variables:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=https://yourdomain.com
```

Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DB_NAME` with your PostgreSQL database credentials.

## Database Setup

1. **Install PostgreSQL**: If you haven't already, install PostgreSQL on your machine or use a cloud database service.

2. **Create Database**: Create a new database for the StarBond application.

3. **Run Migrations**: Use Prisma to set up your database schema. Run the following commands:

   ```
   npx prisma migrate dev --name init
   ```

4. **Seed Database** (optional): If you want to seed your database with initial data, run:

   ```
   npx ts-node prisma.seed.ts
   ```

## Build and Start the Application

1. **Install Dependencies**: Navigate to the project directory and install the required packages:

   ```
   npm install
   ```

2. **Build the Application**: Build the Next.js application for production:

   ```
   npm run build
   ```

3. **Start the Application**: Start the application in production mode:

   ```
   npm start
   ```

## Deployment

### Vercel

1. **Connect to Vercel**: Go to [Vercel](https://vercel.com) and create an account if you don't have one. Connect your GitHub repository.

2. **Import Project**: Import your StarBond project from your GitHub repository.

3. **Set Environment Variables**: In the Vercel dashboard, go to your project settings and add the environment variables defined in the `.env` file.

4. **Deploy**: Click on the "Deploy" button. Vercel will automatically build and deploy your application.

### Heroku

1. **Create a Heroku App**: Go to [Heroku](https://heroku.com) and create a new app.

2. **Set Up PostgreSQL**: Add the Heroku PostgreSQL add-on to your app.

3. **Configure Environment Variables**: In the Heroku dashboard, go to "Settings" and add the environment variables from your `.env` file.

4. **Deploy Your Code**: You can deploy your code using Git:

   ```
   git add .
   git commit -m "Deploying StarBond"
   git push heroku main
   ```

5. **Run Migrations**: After deployment, run the migrations on Heroku:

   ```
   heroku run npx prisma migrate deploy
   ```

## Accessing the Application

Once deployed, you can access your application at the URL provided by your hosting provider. Make sure to test all functionalities, including user authentication, paste creation, and URL shortening.

## Conclusion

You have successfully deployed the StarBond application! For any issues, refer to the logs provided by your hosting provider or consult the documentation for troubleshooting.