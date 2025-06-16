import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "./accounts";
import transactions from "./transactions";
import summary from "./summary";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  .route("/transactions", transactions)
  .route("/summary", summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
