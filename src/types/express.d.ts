import { User } from '../user.entity'; // Adjust the path to your User entity

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust this to your actual user object structure
    }
  }
}