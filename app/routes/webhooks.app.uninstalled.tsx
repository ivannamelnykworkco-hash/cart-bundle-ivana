import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const rawBody = await request.text(); // raw string
    const shopifyHmac = request.headers.get("x-shopify-hmac-sha256")!;

    const verified = await authenticate.verifyWebhook({
      rawBody,
      hmacHeader: shopifyHmac,
    });

    if (!verified) throw new Error("Webhook HMAC validation failed");

    const { shop, session, topic } = await authenticate.webhook({ rawBody });

    console.log(`Received ${topic} webhook for ${shop}`);

    if (session) {
      await db.session.deleteMany({ where: { shop } });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Invalid webhook (app_uninstalled)", error);
    return new Response("Unauthorized", { status: 401 });
  }
};

};
