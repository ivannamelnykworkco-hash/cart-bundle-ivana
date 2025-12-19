// app/routes/webhooks.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // This verifies the HMAC signature.
    // If the HMAC is invalid, authenticate.webhook will throw.
    const { topic, shop, session, payload } = await authenticate.webhook(request);

    console.log(`Received ${topic} webhook for ${shop}`);

    switch (topic) {
      case "APP_UNINSTALLED":
        // May not have a session if already uninstalled
        if (session) {
          await db.session.deleteMany({ where: { shop } });
        }
        break;

      case "CUSTOMERS_DATA_REQUEST":
        // TODO: implement logic to return/export customer data
        // payload will contain `shop_id`, `shop_domain`, `customer`, etc.
        // See: https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request
        break;

      case "CUSTOMERS_REDACT":
        // TODO: implement logic to delete/redact customer data for given ids
        // See: https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-redact
        break;

      case "SHOP_REDACT":
        // TODO: implement logic to erase shop-level data
        // See: https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#shop-redact
        break;

      default:
        // For unknown topics, it's safer to return 404/400
        return new Response("Unhandled webhook topic", { status: 404 });
    }

    // Webhook handled successfully
    return new Response("OK", { status: 200 });
  } catch (error) {
    // If authenticate.webhook throws because of invalid HMAC,
    // app review expects a 401 here.
    console.error("Invalid webhook (generic /webhooks handler)", error);
    return new Response("Unauthorized", { status: 401 });
  }
};