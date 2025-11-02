import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('❌ Auth failed: No Authorization header');
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      console.log('❌ Auth failed: No token provided');
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET not defined in environment variables');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    // Add user ID to request object
    req.userId = decoded.userId;
    
    // Log successful auth (remove in production for security)
    console.log(`✅ Auth successful for user: ${decoded.userId.substring(0, 8)}...`);
    
    // Continue to next middleware/route handler
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      console.error('❌ Auth error: Invalid token');
      res.status(401).json({ message: 'Token is not valid' });
    } else if (error.name === 'TokenExpiredError') {
      console.error('❌ Auth error: Token expired');
      res.status(401).json({ message: 'Token has expired' });
    } else {
      console.error('❌ Auth middleware error:', error.message);
      res.status(401).json({ message: 'Authentication failed' });
    }
  }
};