import { Request } from "express";
export interface AuthRequest extends Request {
  user: any;
  cookies: Cookie;
  file: any;
}

interface Cookie {
  token: string;
}
