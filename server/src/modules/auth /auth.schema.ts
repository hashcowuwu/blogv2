// src/modules/auth/auth.schema.ts
import { Type, Static } from '@sinclair/typebox';

const RegisterBody = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 50 }),
  email: Type.String({ format: 'email', maxLength: 100 }),
  password: Type.String({ minLength: 6, maxLength: 100 }),
});
export type RegisterBodyType = Static<typeof RegisterBody>;

const RegisterResponse201 = Type.Object({
  id: Type.Number(),
  username: Type.String(),
  email: Type.String(),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
});
export type RegisterResponse201Type = Static<typeof RegisterResponse201>;

const RegisterResponse400 = Type.Object({
  message: Type.String(),
});
export type RegisterResponse400Type = Static<typeof RegisterResponse400>;

const RegisterResponse409 = Type.Object({
  message: Type.String(),
});
export type RegisterResponse409Type = Static<typeof RegisterResponse409>;

const RegisterResponse500 = Type.Object({
  message: Type.String(),
});
export type RegisterResponse500Type = Static<typeof RegisterResponse500>;

export const registerSchema = {
  body: RegisterBody,
  response: {
    201: RegisterResponse201,
    400: RegisterResponse400,
    409: RegisterResponse409,
    500: RegisterResponse500,
  },
};

const LoginBody = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 50 }),
  password: Type.String({ minLength: 6, maxLength: 100 }),
});
export type LoginBodyType = Static<typeof LoginBody>;

const LoginResponse200 = Type.Object({
  token: Type.String(),
  user: Type.Object({
    id: Type.Number(),
    username: Type.String(),
    email: Type.String(),
  }),
});
export type LoginResponse200Type = Static<typeof LoginResponse200>;

const LoginResponse401 = Type.Object({
  message: Type.String(),
});
export type LoginResponse401Type = Static<typeof LoginResponse401>;

const LoginResponse500 = Type.Object({
  message: Type.String(),
});
export type LoginResponse500Type = Static<typeof LoginResponse500>;

export const loginSchema = {
  body: LoginBody,
  response: {
    200: LoginResponse200,
    401: LoginResponse401,
    500: LoginResponse500,
  },
};

 // AuthMe

const AuthMeResponse200 = Type.Object({
  id: Type.Number(),
  username: Type.String(),
  email: Type.String(),
});
export type AuthMeResponse200Type = Static<typeof AuthMeResponse200>;

const AuthMeResponse401 = Type.Object({
  message: Type.String(),
});
export type AuthMeResponse401Type = Static<typeof AuthMeResponse401>;

const AuthMeResponse500 = Type.Object({
  message: Type.String(),
});
export type AuthMeResponse500Type = Static<typeof AuthMeResponse500>;

export const authMeSchema = {
  headers: Type.Object({
    authorization: Type.String(),
  }),
  response: {
    200: AuthMeResponse200,
    401: AuthMeResponse401,
    500: AuthMeResponse500,
  },
};

const LogoutResponse204 = Type.Null();
export type LogoutResponse204Type = Static<typeof LogoutResponse204>;

const LogoutResponse401 = Type.Object({
  message: Type.String(),
});
export type LogoutResponse401Type = Static<typeof LogoutResponse401>;

const LogoutResponse500 = Type.Object({
  message: Type.String(),
});
export type LogoutResponse500Type = Static<typeof LogoutResponse500>;

export const logoutSchema = {
  headers: Type.Object({
    authorization: Type.String(),
  }),
  response: {
    204: LogoutResponse204,
    401: LogoutResponse401,
    500: LogoutResponse500,
  },
};