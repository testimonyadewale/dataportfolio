import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

// In GitHub storage mode, Keystatic throws as soon as the handler is created
// unless KEYSTATIC_GITHUB_CLIENT_ID / KEYSTATIC_GITHUB_CLIENT_SECRET /
// KEYSTATIC_SECRET are set. Creating it at module scope means that throw happens
// while `next build` collects page data, which fails the whole deploy before the
// GitHub App has even been created. Build it on the first request instead, so the
// site deploys and only /keystatic reports the missing variables.
export const dynamic = "force-dynamic";

type Handler = (request: Request) => Promise<Response>;

let handler: Handler | undefined;

async function route(request: Request) {
  if (!handler) {
    try {
      handler = makeRouteHandler({ config }).GET as Handler;
    } catch (error) {
      return new Response(
        error instanceof Error ? error.message : "Keystatic is not configured",
        { status: 503, headers: { "content-type": "text/plain" } }
      );
    }
  }
  return handler(request);
}

export { route as GET, route as POST };
