import "./express.d.ts";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

const bootstrap = async (): Promise<void> => {
  await pool.query("SELECT 1");

  if (env.NODE_ENV === "production" && !env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required in production");
  }

  const server = app.listen(env.API_PORT, () => {
    console.log(`coffee-api listening on ${env.API_PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`Received ${signal}, shutting down`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      void shutdown(signal);
    });
  }
};

bootstrap().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
