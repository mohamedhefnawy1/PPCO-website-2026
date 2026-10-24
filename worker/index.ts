/**
 * Cloudflare Worker entry (used when the site is deployed as a Worker; see wrangler.jsonc).
 * The static site in out/ is served by Cloudflare's asset handling, including public/_headers and the
 * 404 page. Only the paths in run_worker_first reach this code:
 * - /api/*: the enquiry form;
 * - /video/*: the hero videos, so byte-range requests always get a proper "206 Partial Content"
 *   answer. Browsers fetch video in ranges; Safari won't play a video without them, and others
 *   can't resume an interrupted download, which leaves the video stuck until the page is refreshed.
 */
import { handleEnquiry, type EnquiryEnv } from "../server/enquiry";
// Written by scripts/video-sizes.mjs on every build (the asset store doesn't always send Content-Length).
import videoSizes from "./video-sizes.json";

// Cloudflare Workers runtime global: a pass-through stream with a declared byte length.
declare class FixedLengthStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(length: number);
}

type Env = EnquiryEnv & { ASSETS: { fetch: (request: Request) => Promise<Response> } };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/enquiry" || pathname === "/api/enquiry/") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      return handleEnquiry(request, env);
    }
    if (pathname.startsWith("/video/")) return serveRange(request, env);
    return env.ASSETS.fetch(request);
  },
};

/** Serves a static file, answering a single "Range: bytes=…" request with 206 and just those bytes. */
async function serveRange(request: Request, env: Env): Promise<Response> {
  const range = request.headers.get("Range");
  const res = await env.ASSETS.fetch(request);
  if (res.status === 206 || res.status !== 200) return res; // already partial, or 304/404: pass through

  const { pathname } = new URL(request.url);
  const size = Number(res.headers.get("Content-Length") || (videoSizes as Record<string, number>)[pathname]);
  const headers = new Headers(res.headers);
  headers.set("Accept-Ranges", "bytes");
  if (!range || (!res.body && request.method !== "HEAD") || !Number.isFinite(size) || size <= 0) return new Response(res.body, { status: 200, headers });

  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim()); // single ranges only; anything else gets the whole file
  if (!m || (m[1] === "" && m[2] === "")) return new Response(res.body, { status: 200, headers });
  let start: number, end: number;
  if (m[1] === "") {
    start = Math.max(0, size - Number(m[2])); // "bytes=-500": the last 500 bytes
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) {
    res.body?.cancel();
    headers.delete("Content-Length");
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  if (request.method === "HEAD" || !res.body) return new Response(null, { status: 206, headers });

  // Stream the file through, keeping only bytes start…end (no buffering of the whole video).
  let offset = 0;
  const slice = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const from = Math.max(start - offset, 0);
      const to = Math.min(end + 1 - offset, chunk.byteLength);
      offset += chunk.byteLength;
      if (to > from) controller.enqueue(chunk.subarray(from, to));
      if (offset > end) controller.terminate();
    },
  });
  // FixedLengthStream lets Cloudflare send an exact Content-Length (Safari expects one on 206 replies).
  const out = new FixedLengthStream(end - start + 1);
  res.body.pipeThrough(slice).pipeTo(out.writable).catch(() => {});
  return new Response(out.readable, { status: 206, headers });
}
