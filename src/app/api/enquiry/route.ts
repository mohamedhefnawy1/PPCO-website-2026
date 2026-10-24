import { NextResponse } from "next/server";

/**
 * Receives the contact / RFQ form and emails it to the PPCO team.
 *
 * Delivery uses Resend's HTTP API (https://resend.com) when these environment variables are set:
 *   RESEND_API_KEY   API key
 *   ENQUIRY_TO       where requests go, e.g. info@ppco-ksa.com
 *   ENQUIRY_FROM     a sender on a verified domain, e.g. "PPCO Website <website@ppco-ksa.com>"
 * Without them the route answers 503, and the form offers to send the same message from the
 * visitor's own email app instead, so no request is lost.
 */

type Payload = {
  type?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  location?: string;
  timeline?: string;
  message?: string;
  website?: string; // honeypot
};

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success and drop it.
  if (clean(body.website)) return NextResponse.json({ ok: true });

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
  if (missing.length) return NextResponse.json({ error: "Missing or invalid fields.", fields: missing }, { status: 422 });

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) {
    return NextResponse.json({ error: "Online sending is not set up." }, { status: 503 });
  }

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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: ENQUIRY_FROM,
      to: ENQUIRY_TO.split(",").map((s) => s.trim()),
      reply_to: d.email,
      subject: `${d.type}${d.service ? ` – ${d.service}` : ""} – ${d.company || d.name}`,
      text,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "Sending failed." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
