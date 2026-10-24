"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";

/** Email button with a one-click copy action and a confirmation. */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="inline-flex items-stretch">
      <a href={`mailto:${email}`} className="btn btn-primary rounded-r-none">
        <Mail className="size-4" aria-hidden /> {email}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard unavailable: the mail link still works */
          }
        }}
        className="relative grid w-12 place-items-center border-l border-white/20 bg-ink text-white transition-colors hover:bg-ink-deep"
        aria-label={copied ? "Email address copied" : "Copy email address"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "y" : "n"}
            initial={{ scale: 0.8, opacity: 0, filter: "blur(2px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.8, opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.15 }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence>
          {copied && (
            <motion.span
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-10 right-0 whitespace-nowrap bg-ink px-3 py-1.5 text-xs text-white"
            >
              Copied
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
