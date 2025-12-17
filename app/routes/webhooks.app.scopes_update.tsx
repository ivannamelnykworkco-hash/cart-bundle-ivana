import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const { payload, session, topic, shop } =
            await authenticate.webhook(request);

        console.log(`Received ${topic} webhook for ${shop}`);

        // Only valid for app/scopes_update
        const current = payload.current as string[] | undefined;

        if (session && Array.isArray(current)) {
            await db.session.update({
                where: { id: session.id },
                data: { scope: current.join(",") },
            });
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Invalid webhook (scopes_update)", error);
        return new Response("Unauthorized", { status: 401 });
    }
};
