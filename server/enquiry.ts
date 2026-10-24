/**
 * The enquiry / RFQ form handler, shared by the Cloudflare Worker (worker/index.ts) and the
 * Cloudflare Pages Function (functions/api/enquiry.ts). Emails each request through Resend.
 *
 * Settings (Cloudflare → your project → Settings → Variables and Secrets):
 *   RESEND_API_KEY   API key (add it as a Secret)
 *   ENQUIRY_TO       where requests go, e.g. info@ppco-ksa.com (comma-separate several)
 *   ENQUIRY_FROM     a sender on a domain verified in Resend, e.g. "PPCO Website <website@ppco-ksa.com>"
 * Without them it answers 503, and the form offers to send the same message from the visitor's
 * own email app instead, so no request is lost.
 */

export type EnquiryEnv = { RESEND_API_KEY?: string; ENQUIRY_TO?: string; ENQUIRY_FROM?: string };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function handleEnquiry(request: Request, env: EnquiryEnv): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Bots fill the hidden field; pretend success and drop it.
  if (clean(body.website)) return json({ ok: true });

  const d = {
    type: clean(body.type, 20) === "general" ? "General enquiry" : "Request for quote",
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    service: clean(body.service, 80),
    location: clean(body.location, 160),
    timeline: clean(body.timeline, 40),
    message: clean(body.message, 5000),
  };
  const missing = [!d.name && "name", !isEmail(d.email) && "email", !d.message && "message"].filter(Boolean);
  if (missing.length) return json({ error: "Missing or invalid fields.", fields: missing }, 422);

  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO || !env.ENQUIRY_FROM) return json({ error: "Online sending is not set up." }, 503);

  const fields: [string, string][] = [
    ["Type", d.type],
    ["Name", d.name],
    ["Company", d.company],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Service", d.service],
    ["Project location", d.location],
    ["Expected start", d.timeline],
  ];
  const text = [...fields.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", d.message].join("\n");

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM,
        to: env.ENQUIRY_TO.split(",").map((s) => s.trim()),
        reply_to: d.email,
        subject: `${d.type}${d.service ? ` – ${d.service}` : ""} – ${d.company || d.name}`,
        text,
      }),
    });
  } catch {
    return json({ error: "Sending failed." }, 502);
  }
  if (!res.ok) return json({ error: "Sending failed." }, 502);
  return json({ ok: true });
}
