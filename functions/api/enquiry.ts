/** Cloudflare Pages Function: POST /api/enquiry (used when the site is deployed as a Pages project). */
import { handleEnquiry, type EnquiryEnv } from "../../server/enquiry";

export const onRequestPost = ({ request, env }: { request: Request; env: EnquiryEnv }) => handleEnquiry(request, env);
