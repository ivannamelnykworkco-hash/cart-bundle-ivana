import { authenticate } from "../shopify.server";
import { getGeneralStyle } from "app/models/generalStyle.server";
import { getCountdownTimer } from "app/models/countdownTimer.server";
import { getQuantityBreaks } from "app/models/quantityBreak.server";
import { getBuyXGetYs } from "app/models/buyXGetY.server";
import { getBundleUpsells } from "app/models/bundleUpsell.server";
import { getGeneralSetting } from "app/models/generalSetting.server";
import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const url = new URL(request.url);

  await authenticate.public.appProxy(request);

  const getGeneralStyleConfigS = await getGeneralStyle().catch(() => null);
  const cornerRadius = Number(getGeneralStyleConfigS?.cornerRadius) || '';
  const spacing = Number(getGeneralStyleConfigS?.spacing) || '';
  const cardsBgColor = String(getGeneralStyleConfigS?.cardsBgColor) || '';
  const selectedBgColor = String(getGeneralStyleConfigS?.selectedBgColor) || '';
  const borderColor = String(getGeneralStyleConfigS?.borderColor) || '';
  const blockTitleColor = String(getGeneralStyleConfigS?.blockTitleColor) || '';
  const barTitleColor = String(getGeneralStyleConfigS?.barTitleColor) || '';
  const barSubTitleColor = String(getGeneralStyleConfigS?.barSubTitleColor) || '';
  const barPriceColor = String(getGeneralStyleConfigS?.barPriceColor) || '';
  const barFullPriceColor = String(getGeneralStyleConfigS?.barFullPriceColor) || '';
  const barLabelBackColor = String(getGeneralStyleConfigS?.barLabelBackColor) || '';
  const barLabelTextColor = String(getGeneralStyleConfigS?.barLabelTextColor) || '';
  const barBadgebackColor = String(getGeneralStyleConfigS?.barBadgebackColor) || '';
  const barBadgeTextColor = String(getGeneralStyleConfigS?.barBadgeTextColor) || '';
  const barUpsellBackColor = String(getGeneralStyleConfigS?.barUpsellBackColor) || '';
  const barUpsellTextColor = String(getGeneralStyleConfigS?.barUpsellTextColor) || '';
  const barUpsellSelectedBackColor = String(getGeneralStyleConfigS?.barUpsellSelectedBackColor) || '';
  const barUpsellSelectedTextColor = String(getGeneralStyleConfigS?.barUpsellSelectedTextColor)
  const barBlocktitle = Number(getGeneralStyleConfigS?.barBlocktitle) || 16;
  const bartitleSize = Number(getGeneralStyleConfigS?.bartitleSize) || 16;
  const subTitleSize = Number(getGeneralStyleConfigS?.subTitleSize) || 16;
  const labelSize = Number(getGeneralStyleConfigS?.labelSize) || 16;
  const upsellSize = Number(getGeneralStyleConfigS?.upsellSize) || 16;
  const unitLabelSize = Number(getGeneralStyleConfigS?.unitLabelSize) || 16;

  const countdownTimerConfig = await getCountdownTimer().catch(() => null);
  const msgAlignmentIndex = Number(countdownTimerConfig?.msgAlignment) || '';
  const msgAlignment = msgAlignmentIndex === 0 ? "left" : msgAlignmentIndex === 1 ? "center" : "right";
  const msgBold = countdownTimerConfig?.msgBold ? '700' : '400';
  const msgItalic = countdownTimerConfig?.msgItalic ? 'italic' : 'normal';
  const msgSize = Number(countdownTimerConfig?.msgSize) || '14';
  const msgBgColor = String(countdownTimerConfig?.msgBgColor) || '';
  const msgTextColor = String(countdownTimerConfig?.msgTextColor) || '';

  const css = `
      :root {
      --corner-radius: ${cornerRadius}px;
      --spacing: ${spacing}px;
      --cardsBg-color: ${cardsBgColor};
      --selectedBg-color: ${selectedBgColor};
      --border-color: ${borderColor};
      --blockTitle-color: ${blockTitleColor};
      --bartitle-color: ${barTitleColor};
      --barSubtitle-color: ${barSubTitleColor};
      --barPrice-color: ${barPriceColor};
      --barFullPrice-color: ${barFullPriceColor};
      --barLabelBack-color: ${barLabelBackColor};
      --barLabelText-color: ${barLabelTextColor};
      --barBadgeback-color: ${barBadgebackColor};
      --barBadgeText-color: ${barBadgeTextColor};
      --barUpsellBack-color: ${barUpsellBackColor};
      --barUpsellText-color: ${barUpsellTextColor};
      --barUpsellSelected-color: ${barUpsellSelectedBackColor};
      --barUpsellSelectedText-color: ${barUpsellSelectedTextColor};
      --barBlock-title: ${barBlocktitle}px;
      --bartitle-size: ${bartitleSize}px;
      --subTitle-size: ${subTitleSize}px;
      --label-size: ${labelSize}px;
      --upsell-size: ${upsellSize}px;
      --unitLabel-size: ${unitLabelSize}px;

      --msg-alignment: ${msgAlignment};
      --msgItalic-style: ${msgItalic};
      --msgBold-weight: ${msgBold};
      --msg-size: ${msgSize}px;
      --msgBg-color: ${msgBgColor};
      --msgText-color: ${msgTextColor};
      }
    `;

  return new Response(css, {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });

  // return new Response("Not found", { status: 404 });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.public.appProxy(request);

  // const upsellConfig = await getBundleUpsells().catch(() => null);

  // quantity Break
  const qbList = await getQuantityBreaks().catch(() => null);
  // get x, buy Y free
  const xyList = await getBuyXGetYs().catch(() => null);
  // bundle upsell
  const buList = await getBundleUpsells().catch(() => null);
  // generalsetting 
  const gsList = await getGeneralSetting();

  // Fetch products and countdown config in parallel
  const [response, countdownTimerConfig] = await Promise.all([
    admin.graphql(`
      query getProducts {
        products(first: 3) {
          edges {
            node {
              id
              title
              featuredImage {
                url
              }
              metafields(first: 1) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                    type
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                    compareAtPrice
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `),
    getCountdownTimer().catch(() => null),
  ]);

  const body = await response.json();
  const nodes = body?.data?.products?.edges?.map(edge => edge.node) ?? [];

  if (!nodes.length) {
    return new Response(JSON.stringify({ error: "Products not found" }), {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  // Normalize countdown config once
  const isCountdown = Boolean(countdownTimerConfig?.isCountdown);
  const visibility = String(countdownTimerConfig?.visibility || "");
  const fixedDurationTime = Number(countdownTimerConfig?.fixedDurationTime) || 0;
  const endDateTime = countdownTimerConfig?.endDateTime || "";
  const msgText = String(countdownTimerConfig?.msgText || "");


  const products = nodes.map(node => {
    // const firstVariant = node.variants?.edges?.[0]?.node ?? null;

    return {
      node,

      countdownTimerConfig: {
        isCountdown,
        visibility,
        fixedDurationTime,
        endDateTime,
        msgText,
      },
      qbList: Array.isArray(qbList) ? qbList : [],
      xyList: Array.isArray(xyList) ? xyList : [],
      buList: Array.isArray(buList) ? buList : [],
      gsList: gsList ? [gsList] : [],
    };
  });

  return new Response(JSON.stringify(products), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
// function QuantityBreak() {
//   throw new Error("Function not implemented.");
// }

