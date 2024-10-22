interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

declare namespace Express {
  interface Request {
    user?: JwtUser;
  }
}
