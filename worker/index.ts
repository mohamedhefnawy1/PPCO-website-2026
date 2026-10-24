/**
 * Cloudflare Worker entry (used when the site is deployed as a Worker; see wrangler.jsonc).
 * The static site in out/ is served by Cloudflare's asset handling, including public/_headers and the
 * 404 page. Only /api/* reaches this code (run_worker_first), where the enquiry form is handled.
 */
import { handleEnquiry, type EnquiryEnv } from "../server/enquiry";

type Env = EnquiryEnv & { ASSETS: { fetch: (request: Request) => Promise<Response> } };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/enquiry" || pathname === "/api/enquiry/") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      return handleEnquiry(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
