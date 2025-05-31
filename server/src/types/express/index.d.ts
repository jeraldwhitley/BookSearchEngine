
// declare namespace Express {
//   interface Request {
//     user: {
//       _id: unknown;
//       username: string;
//     };
//   }
// }



import type { JwtPayload } from '../../services/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
