"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";
import { company, enquiry as copy } from "@/content/site";

type Type = "quote" | "general";
type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  timeline: string;
  message: string;
  website: string; // honeypot, hidden from people
};
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "offline" | "failed";

const empty: Fields = { name: "", company: "", email: "", phone: "", service: "", location: "", timeline: "", message: "", website: "" };
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function validate(f: Fields, type: Type): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Enter your name.";
  if (type === "quote" && !f.company.trim()) e.company = "Enter your company name.";
  if (!f.email.trim()) e.email = "Enter your email address.";
  else if (!isEmail(f.email)) e.email = "Enter an email address like name@company.com.";
  if (f.phone && !/^[+\d][\d\s()-]{6,}$/.test(f.phone.trim())) e.phone = "Enter a phone number using digits, spaces and +.";
  if (type === "quote" && !f.service) e.service = "Choose the service you need.";
  if (!f.message.trim()) e.message = type === "quote" ? "Describe the scope of work." : "Enter your message.";
  return e;
}

/**
 * Contact and request-for-quote form.
 * - Validates on submit (not while typing), marks fields with aria-invalid, links each error to its
 *   field and moves focus to the first problem.
 * - Prefills from the URL: /contact/?type=quote&service=civil#enquiry
 * - Posts to /api/enquiry. If online sending isn't configured, it offers the same message as a
 *   ready-to-send email instead, so nothing typed is lost.
 */
export default function EnquiryForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<Type>("quote");
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  // Prefill from the link that brought the visitor here (also when a link changes the URL on this page).
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search);
      const t = q.get("type");
      if (t === "general" || t === "quote") setType(t);
      const svc = copy.services.find((s) => s.id === q.get("service"));
      if (svc) setF((x) => ({ ...x, service: svc.label }));
    };
    read();
    window.addEventListener("ppco:urlchange", read);
    return () => window.removeEventListener("ppco:urlchange", read);
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((x) => ({ ...x, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const mailto = () => {
    const subject = `${type === "quote" ? "Request for quote" : "Enquiry"}${f.service ? ` – ${f.service}` : ""}${f.company ? ` – ${f.company}` : ""}`;
    const rows: [string, string][] = [
      ["Name", f.name],
      ["Company", f.company],
      ["Email", f.email],
      ["Phone", f.phone],
      ["Service", f.service],
      ["Project location", f.location],
      ["Expected start", f.timeline],
    ];
    const body = [...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", f.message].join("\n");
    return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(f, type);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...f }),
      });
      setStatus(res.ok ? "sent" : res.status === 503 ? "offline" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const fieldId = (k: string) => `${id}-${k}`;
  const describedBy = (k: keyof Fields, hint?: boolean) => [errors[k] && `${fieldId(k)}-error`, hint && `${fieldId(k)}-hint`].filter(Boolean).join(" ") || undefined;
  const input =
    "mt-2 block w-full border bg-white px-3.5 py-3 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-ink aria-[invalid=true]:border-red-600";

  if (status === "sent") {
    return (
      <motion.div role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-line bg-white p-8 md:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-green/15 text-green-deep">
          <Check className="size-6" aria-hidden />
        </span>
        <h3 className="heading mt-6 text-2xl">Thank you, {f.name.split(" ")[0]}.</h3>
        <p className="mt-3 text-muted">
          Your {type === "quote" ? "request for quote" : "message"} has reached our team. We will reply to <strong className="font-medium text-ink">{f.email}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setF(empty);
            setStatus("idle");
          }}
          className="link mt-6"
        >
          Send another request
        </button>
      </motion.div>
    );
  }

  const Field = ({ k, label, required, children, hint }: { k: keyof Fields; label: string; required?: boolean; children: React.ReactNode; hint?: string }) => (
    <div>
      <label htmlFor={fieldId(k)} className="text-sm font-medium">
        {label}
        {required ? <span className="text-muted"> (required)</span> : <span className="text-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${fieldId(k)}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {errors[k] && (
        <p id={`${fieldId(k)}-error`} className="mt-2 text-sm text-red-700">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="relative border border-line bg-white p-6 md:p-10" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="heading text-2xl md:text-3xl">
        {copy.title}
      </h2>
      <p className="mt-3 text-muted">{copy.intro}</p>

      <fieldset className="mt-8">
        <legend className="sr-only">Type of request</legend>
        <div className="grid grid-cols-2 border border-line p-1">
          {copy.types.map((t) => {
            const on = type === t.id;
            return (
              <label
                key={t.id}
                className={`relative flex h-11 cursor-pointer items-center justify-center text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green ${
                  on ? "text-white" : "text-muted hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t.id}
                  checked={on}
                  onChange={() => {
                    setType(t.id as Type);
                    setErrors({});
                  }}
                  className="sr-only"
                />
                {on && <motion.span layoutId={`${id}-type`} className="absolute inset-0 bg-ink" transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} />}
                <span className="relative">{t.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {Field({
          k: "name",
          label: "Full name",
          required: true,
          children: <input id={fieldId("name")} name="name" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={`${input} border-line`} />,
        })}
        {Field({
          k: "company",
          label: "Company",
          required: type === "quote",
          children: (
            <input id={fieldId("company")} name="company" autoComplete="organization" value={f.company} onChange={set("company")} aria-invalid={!!errors.company} aria-describedby={describedBy("company")} className={`${input} border-line`} />
          ),
        })}
        {Field({
          k: "email",
          label: "Email",
          required: true,
          children: (
            <input id={fieldId("email")} name="email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={`${input} border-line`} />
          ),
        })}
        {Field({
          k: "phone",
          label: "Phone",
          children: (
            <input id={fieldId("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={f.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={`${input} border-line text-left`} />
          ),
        })}
      </div>

      <AnimatePresence initial={false}>
        {type === "quote" && (
          <motion.div
            key="quote-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {Field({
                  k: "service",
                  label: "Service needed",
                  required: true,
                  children: (
                    <select id={fieldId("service")} name="service" value={f.service} onChange={set("service")} aria-invalid={!!errors.service} aria-describedby={describedBy("service")} className={`${input} border-line cursor-pointer`}>
                      <option value="">Choose a service</option>
                      {copy.services.map((s) => (
                        <option key={s.id} value={s.label}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  ),
                })}
              </div>
              {Field({
                k: "location",
                label: "Project location",
                children: <input id={fieldId("location")} name="location" placeholder="City or site" value={f.location} onChange={set("location")} className={`${input} border-line`} />,
              })}
              {Field({
                k: "timeline",
                label: "Expected start",
                children: (
                  <select id={fieldId("timeline")} name="timeline" value={f.timeline} onChange={set("timeline")} className={`${input} border-line cursor-pointer`}>
                    <option value="">Choose a timeframe</option>
                    {copy.timelines.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                ),
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {Field({
          k: "message",
          label: type === "quote" ? "Scope of work" : "Message",
          required: true,
          hint: type === "quote" ? "Quantities, specifications and deadlines help us price accurately. You can send drawings by email after we reply." : undefined,
          children: (
            <textarea
              id={fieldId("message")}
              name="message"
              rows={6}
              value={f.message}
              onChange={set("message")}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy("message", type === "quote")}
              className={`${input} border-line resize-y`}
            />
          ),
        })}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
        </label>
      </div>

      {Object.values(errors).some(Boolean) && (
        <p role="alert" className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-700">
          Please check the highlighted fields.
        </p>
      )}

      <div aria-live="polite">
        {status === "offline" && (
          <div className="mt-6 border border-line bg-mist p-5 text-sm">
            <p>Online sending isn’t available at the moment. Your message is ready to send from your email app instead.</p>
            <a href={mailto()} className="btn btn-primary mt-4">
              <Mail className="size-4" aria-hidden /> Open in email app
            </a>
          </div>
        )}
        {status === "failed" && (
          <p className="mt-6 border-l-2 border-red-600 pl-3 text-sm text-red-700">
            We couldn’t send your request. Please try again, or{" "}
            <a href={mailto()} className="underline underline-offset-4">
              email it to {company.email}
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{copy.privacy}</p>
        <button type="submit" aria-busy={status === "sending"} className="btn btn-primary justify-center transition-[background-color,transform] duration-150 active:scale-[0.98]">
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              {type === "quote" ? "Send request" : "Send message"} <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
