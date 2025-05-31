import type { JwtPayload } from '../../services/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
