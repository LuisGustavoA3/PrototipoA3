import type { Plugin, Connect } from "vite";
import { handlers as sessions } from "./api/sessoes";
import { handlers as comment } from "./api/sessoes/comentario";
import { handlers as webhook } from "./api/monday/webhook";
import { handlers as health } from "./api/health";

type Handler = (context: { request: Request }) => Promise<Response>;
const endpoints: Record<string, Partial<Record<string, Handler>>> = {
  "/api/sessoes": sessions,
  "/api/sessoes/comentario": comment,
  "/api/monday/webhook": webhook,
  "/api/health": health,
};

export const apiMiddleware: Connect.NextHandleFunction = async (
  req,
  res,
  next,
) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname.replace(/^\/PrototipoA3(?=\/api\/)/, "");
  if (!path.startsWith("/api/")) return next();
  const endpoint = endpoints[path];
  const handler = endpoint?.[req.method ?? "GET"];
  if (!handler) {
    res.statusCode = endpoint ? 405 : 404;
    res.setHeader("Content-Type", "application/json");
    if (endpoint) res.setHeader("Allow", Object.keys(endpoint).join(", "));
    res.end(JSON.stringify({ message: "Endpoint ou método indisponível." }));
    return;
  }
  try {
    if (
      path === "/api/sessoes/comentario" &&
      req.headers.origin &&
      new URL(req.headers.origin).host !== req.headers.host
    ) {
      res.statusCode = 403;
      res.end();
      return;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      const buffer = Buffer.from(chunk);
      size += buffer.length;
      if (size > 1_048_576) {
        res.statusCode = 413;
        res.end();
        return;
      }
      chunks.push(buffer);
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value)
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
    const body = Buffer.concat(chunks).toString("utf8");
    const request = new Request(url, {
      method: req.method ?? "GET",
      headers,
      ...(req.method !== "GET" && req.method !== "HEAD" ? { body } : {}),
    });
    const response = await handler({ request });
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error("Falha na API:", error);
    res.statusCode = error instanceof SyntaxError ? 400 : 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ message: "Não foi possível processar a solicitação." }),
    );
  }
};

export function apiPlugin(): Plugin {
  return {
    name: "a3-development-api",
    configureServer(server) {
      server.middlewares.use(apiMiddleware);
    },
  };
}
