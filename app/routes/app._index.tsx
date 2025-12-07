// app/routes/app._index.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  DataTable,
  Badge,
  EmptyState,
  Banner,
  Text,
  Tabs
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import {
  ChartVerticalFilledIcon,
  DeleteIcon,
  DuplicateIcon,
  EditIcon,
  ViewIcon
} from '@shopify/polaris-icons';
import type { Bundle, Analytics } from "../models/types";
import { SwitchIcon } from "app/components/common/SwitchIcon";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  // TODO: Fetch from database
  const bundles: Bundle[] = [
    {
      id: "1",
      name: "Bundle",
      type: "duo",
      status: "draft",
      products: ["All products"],
      discountType: "percentage",
      discountValue: 15,
      stats: {
        visitors: 2,
        conversionRate: 0,
        bundlesRate: 0,
        aov: 0,
        addedRevenue: 0,
        totalRevenue: 0,
        revenuePerVisitor: 0,
        profitPerVisitor: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {},
    },
  ];

  const analytics: Analytics = {
    thisMonthRevenue: 0,
    allTimeRevenue: 0,
    resetDate: "Dec 1",
  };

  return json({ bundles, analytics });
};

export default function Index() {
  const { bundles, analytics } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);


  const tabs = [
    { id: "deals", content: "Deals" },
    { id: "archive", content: "A/B test archive" },
  ];

  const rows = bundles.map((bundle, index) => [
    // Deal Column
    <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Text as="span" fontWeight="semibold">
            {bundle.name}
          </Text>
          <Badge tone="info">{bundle.status}</Badge>
        </div>
        <Text as="span" variant="bodySm" tone="subdued">
          {bundle.products.join(", ")}
        </Text>
      </div>
    </div>,

    // Stats Column
    <div key={index} style={{ display: "flex", gap: "48px", alignItems: "center", paddingLeft: "16px" }}>
      <div style={{ minWidth: "60px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          Visitors
        </Text>
        <Text as="span" fontWeight="semibold">
          {bundle.stats.visitors}
        </Text>
      </div>
      <div style={{ minWidth: "60px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          CR
        </Text>
        <Text as="span" fontWeight="semibold">
          {bundle.stats.conversionRate}%
        </Text>
      </div>
      <div style={{ minWidth: "60px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          Bundles
        </Text>
        <Text as="span" fontWeight="semibold">
          {bundle.stats.bundlesRate}%
        </Text>
      </div>
      <div style={{ minWidth: "60px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          AOV
        </Text>
        <Text as="span" fontWeight="semibold">
          ${bundle.stats.aov.toFixed(2)}
        </Text>
      </div>
      <div style={{ minWidth: "80px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          Add. rev.
        </Text>
        <Text as="span" fontWeight="semibold">
          ${bundle.stats.addedRevenue}
        </Text>
      </div>
      <div style={{ minWidth: "80px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          Total rev.
        </Text>
        <Text as="span" fontWeight="semibold">
          ${bundle.stats.totalRevenue}
        </Text>
      </div>
      <div style={{ minWidth: "100px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          Rev. per visitor
        </Text>
        <Text as="span" fontWeight="semibold">
          ${bundle.stats.revenuePerVisitor.toFixed(2)}
        </Text>
      </div>
      <div style={{ minWidth: "100px" }}>
        <Text as="span" variant="bodySm" tone="subdued">
          Profit per visitor
        </Text>
        <Text as="span" fontWeight="semibold">
          {bundle.stats.profitPerVisitor === 0 ? "-" : `$${bundle.stats.profitPerVisitor}`}
        </Text>
      </div>
    </div>,

    // Actions Column
    <div key={index} style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
      {/* <Button onClick={() => navigate(`/app/bundles/${bundle.id}/test`)}>
        Run A/B test
      </Button> */}
      <Button icon={ChartVerticalFilledIcon} onClick={() => { }} />
      <Button icon={EditIcon} onClick={() => navigate(`/app/bundles/${bundle.id}`)} />
      <Button icon={DuplicateIcon} onClick={() => { }} />
      <Button icon={ViewIcon} onClick={() => { }} />
      <Button icon={DeleteIcon} onClick={() => { }} />
    </div>,
  ]);

  return (
    <Page
      title="Bundle deals"
      primaryAction={{
        content: "Create bundle deal",
        onAction: () => navigate("/app/bundles/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {/* Usage Overview Card */}
            <Card>
              <div style={{ padding: "16px", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <Text as="h2" variant="headingMd">
                    Usage overview
                  </Text>
                </div>
                <Text as="span" tone="subdued">
                  ${analytics.thisMonthRevenue}/∞ added revenue this month
                </Text>
                <Text as="span" variant="bodySm" tone="subdued">
                  Resets on {analytics.resetDate}
                </Text>
              </div>
            </Card>

            {/* Analytics Card */}
            <Card>
              <div style={{ padding: "16px", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <Text as="h2" variant="headingMd">
                    Analytics
                  </Text>
                  <Button onClick={() => navigate("/app/analytics")}>
                    View full analytics
                  </Button>
                </div>
                <div style={{ display: "flex", gap: "40px" }}>
                  <div>
                    <Text as="span" variant="bodySm" tone="subdued">
                      This month's added revenue
                    </Text>
                    <Text as="span" variant="headingLg">
                      ${analytics.thisMonthRevenue}
                    </Text>
                  </div>
                  <div>
                    <Text as="span" variant="bodySm" tone="subdued">
                      All time added revenue
                    </Text>
                    <Text as="span" variant="headingLg">
                      ${analytics.allTimeRevenue}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Theme Extension Card */}
            <Card>
              <div style={{ padding: "16px", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <Text as="h2" variant="headingMd">
                    Theme extension
                  </Text>
                  <Badge tone="success">Active</Badge>
                </div>
                <Text as="span" variant="bodySm">
                  Bundles widget is visible in product pages.
                </Text>
                <Button variant="plain" onClick={() => { }}>
                  Need help?
                </Button>
              </div>
            </Card>
          </div>
        </Layout.Section>

        <Layout.Section>
          <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab} />
          <Card>
            {bundles.length === 0 ? (
              <EmptyState
                heading="Create your first bundle deal"
                action={{
                  content: "Create bundle deal",
                  onAction: () => navigate("/app/bundles/new"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Start boosting your sales with bundle deals</p>
              </EmptyState>
            ) : (
              <DataTable
                columnContentTypes={["text", "text", "text"]}
                headings={["Deal", "Stats", "Actions"]}
                rows={rows}
              />
            )}
          </Card>

          {bundles.length > 0 && showBanner && (
            <div style={{ marginTop: "16px", borderRadius: "8px", overflow: "hidden" }}>
              <Banner
                title="Your bundles need more visibility"
                tone="info"
                action={{ content: "Get started" }}
                secondaryAction={{ content: "Maybe later" }}
                onDismiss={() => setShowBanner(false)}
              >
                <p>Create landing pages to drive traffic and boost sales</p>
              </Banner>
            </div>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}