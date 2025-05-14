// src/app.ts
import Fastify from "fastify";
import databasePlugin from "./plugins/database";
import authPlugin from "./plugins/auth";
import authRoutes from "./modules/auth /auth.route";
import articleRoutes from "./modules/article/article.route";
import adminRoutes from "./modules/admin/admin.route";

import config from "./config/auth";

const server = Fastify({
  logger: true,
});

async function main() {
  await server.register(databasePlugin); // databaseConfig 会在插件内部使用
  await server.register(authPlugin);
  await server.register(authRoutes, { prefix: "/auth" });
  await server.register(adminRoutes, { prefix: "/" });
  await server.register(articleRoutes, { prefix: "/blog" });

  try {
    await server.listen({ port: 3000 });
    console.log("Server listening on http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

export default server;
