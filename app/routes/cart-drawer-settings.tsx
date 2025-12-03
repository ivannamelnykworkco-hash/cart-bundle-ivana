import { authenticate } from "../shopify.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getGeneralStyle } from "app/models/generalStyle.server";

export const loader = async ({ request }) => {
  await authenticate.public.appProxy(request);

  const config = await getGeneralStyle().catch(() => null);

  const cornerRadius = Number(config?.cornerRadius) || '';
  const spacing = Number(config?.spacing) || '';
  const cardsBgColor = String(config?.cardsBgColor) || '';
  const selectedBgColor = String(config?.selectedBgColor) || '';
  const borderColor = String(config?.borderColor) || '';
  const blockTitleColor = String(config?.blockTitleColor) || '';
  const barTitleColor = String(config?.barTitleColor) || '';
  const barSubTitleColor = String(config?.barSubTitleColor) || '';
  const barPriceColor = String(config?.barPriceColor) || '';
  const barFullPriceColor = String(config?.barFullPriceColor) || '';
  const barLabelBackColor = String(config?.barLabelBackColor) || '';
  const barLabelTextColor = String(config?.barLabelTextColor) || '';
  const barBadgebackColor = String(config?.barBadgebackColor) || '';
  const barBadgeTextColor = String(config?.barBadgeTextColor) || '';
  const barUpsellBackColor = String(config?.barUpsellBackColor) || '';
  const barUpsellTextColor = String(config?.barUpsellTextColor) || '';
  const barUpsellSelectedBackColor = String(config?.barUpsellSelectedBackColor) || '';
  const barUpsellSelectedTextColor = String(config?.barUpsellSelectedTextColor)
  const barBlocktitle = Number(config?.barBlocktitle) || 16;
  const bartitleSize = Number(config?.bartitleSize) || 16;
  const subTitleSize = Number(config?.subTitleSize) || 16;
  const labelSize = Number(config?.labelSize) || 16;
  const upsellSize = Number(config?.upsellSize) || 16;
  const unitLabelSize = Number(config?.unitLabelSize) || 16;


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
    }
  `;

  return new Response(css, {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
};
