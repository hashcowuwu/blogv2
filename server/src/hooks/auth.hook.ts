import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

// export async function authenticate(
//   request: FastifyRequest,
//   reply: FastifyReply,
// ) {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.status(401).send({ message: "Unauthorized" });
//   }
// }

//
interface CustomRequest extends FastifyRequest {
  user?: {
    id: string;
    username: string;
    // 其他用户信息
  };
}

export async function authenticate(
  request: CustomRequest,
  reply: FastifyReply,
) {
  const token = request.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("authToken="))
    ?.split("=")[1];

  if (!token) {
    reply
      .status(401)
      .send({ message: "Unauthorized - No token provided in cookie" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as CustomRequest["user"];
    request.user = decoded; // 将解码后的用户信息设置到 request.user
  } catch (err) {
    console.error("JWT verification error:", err);
    reply
      .status(401)
      .send({ message: "Unauthorized - Invalid token in cookie" });
  }
}
