import { Request } from "express";
export interface AuthRequest extends Request {
  user: any;
  cookies: Cookie;
}

interface Cookie {
  token: string;
}
