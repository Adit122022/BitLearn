import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { slidingWindow } from "@/lib/arcjet";
import ip from "@arcjet/ip";
import {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  ProtectSignupOptions,
} from "@arcjet/next";
import { NextRequest } from "next/server";

// export const { POST, GET } = toNextJsHandler(arcjet(auth));
const emailOptions = {
  mode: "LIVE", // will block request , use "DRY_RUN" to log only
  // Block emails that are disposable, invalid , or have no MX records
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
  mode: "LIVE",
  //    configured with a list of bots to allow from
  // https://arcjet.com/bot-list
  allow: [], // prevents bots from submitting the form
} satisfies BotOptions;

const rateLimitOptions = {
  mode: "LIVE",
  interval: "2m",
  max: 5,
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
  email: emailOptions,
  // used a sliding window rate limit
  bots: botOptions,
  //  It would be unusual for a form to be submitted more than  times in 10
  //  minutes from the same IP address
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

async function protect(req: Request): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({ headers: req.headers });
  // if user is logged in use their id as fingerprint
  // otherwise use ip address as fingerprint
  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1"; // Fallback to Local IP
  }
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/auth/sign-up")) {
    const body = await req.clone().json();

    //  If the email is in the body of the request then we can run
    // the email validation checks as well. See
    // https:www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction
    if (typeof body.email === "string") {
      return arcjet
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, fingerprint: userId });
    } else {
      // otherwise user rate limit and detect bot
      return arcjet
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(rateLimitOptions))
        .protect(req, { fingerprint: userId });
    }
  } else {
    // for all other auth requests
    return arcjet
      .withRule(detectBot(botOptions))
      .protect(req, { fingerprint: userId });
  }
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;


// Wrap the POST handler with Arcjet protection
export const POST = async (req: NextRequest) => {

  const decision = await protect(req);
  
  console.log("Arcjet Decision :", decision);
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;
      if (decision.reason.emailTypes.includes("INVALID")) {
        message =
          "Email address formate is Invalid. Are u sure its a write email ??🤔";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email address not allowed 🥲";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "Your Email domain not have an MX records. Is there a typo ??🥲";
      } else {
        // THis is a  catch all , but the above should be  exhaustive based on the configured rules .
        message = "Invalid email address 🥲";
      }
      return new Response(message, { status: 400 });
    } else {
      return new Response(null, { status: 403 });
    }
  }
  return authHandlers.POST(req);
};
