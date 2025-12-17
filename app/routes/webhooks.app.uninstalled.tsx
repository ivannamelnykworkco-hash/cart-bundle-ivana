import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, session, topic } =
      await authenticate.webhook(request);

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
