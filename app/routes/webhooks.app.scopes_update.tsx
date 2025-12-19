// app/routes/webhooks.app.scopes_update.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const { payload, session, topic, shop } = await authenticate.webhook(request);
        console.log(`Received ${topic} webhook for ${shop}`);

        const current = payload.current as string[] | undefined;

        if (session && current) {
            await db.session.update({
                where: { id: session.id },
                data: {
                    scope: current.join(","), // cleaner than toString()
                },
            });
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Invalid webhook (app/scopes_update)", error);
        return new Response("Unauthorized", { status: 401 });
    }
};