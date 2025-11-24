// app/routes/app.analytics.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Select,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  
  const analytics = {
    thisMonthRevenue: 0,
    allTimeRevenue: 0,
    totalVisitors: 2,
    totalConversions: 0,
    averageOrderValue: 0,
  };

  return json({ analytics });
};

export default function Analytics() {
  const { analytics } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("30days");

  const statCards = [
    {
      title: "This Month's Revenue",
      value: `$${analytics.thisMonthRevenue.toFixed(2)}`,
      description: "Added revenue from bundles",
    },
    {
      title: "All Time Revenue",
      value: `$${analytics.allTimeRevenue.toFixed(2)}`,
      description: "Total bundle revenue",
    },
    {
      title: "Total Visitors",
      value: analytics.totalVisitors.toString(),
      description: "Unique bundle page views",
    },
    {
      title: "Conversion Rate",
      value: `${analytics.totalConversions}%`,
      description: "Visitors who purchased",
    },
    {
      title: "Average Order Value",
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      description: "Average bundle purchase",
    },
  ];

  return (
    <Page
      title="Analytics"
      backAction={{ onAction: () => navigate("/app") }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Performance Overview
                </Text>
                <Select
                  label=""
                  labelInline
                  options={[
                    { label: "Last 7 days", value: "7days" },
                    { label: "Last 30 days", value: "30days" },
                    { label: "Last 90 days", value: "90days" },
                    { label: "All time", value: "alltime" },
                  ]}
                  value={dateRange}
                  onChange={setDateRange}
                />
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {statCards.map((stat, index) => (
              <Card key={index}>
                <BlockStack gap="200">
                  <Text as="p" variant="bodySm" tone="subdued">
                    {stat.title}
                  </Text>
                  <Text as="p" variant="heading2xl">
                    {stat.value}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {stat.description}
                  </Text>
                </BlockStack>
              </Card>
            ))}
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Revenue Chart
              </Text>
              <div style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
              }}>
                <Text as="p" tone="subdued">
                  Chart visualization will appear here
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}