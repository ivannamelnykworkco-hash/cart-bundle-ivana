import { Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

// Define types for the GraphQL response
interface Product {
  id: string;
  title: string;
}

export interface LoaderData {
  products: Product[];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Server-side logic
  const { admin } = await authenticate.admin(request);  // This only runs on the server
  const response = await admin.graphql(
    `#graphql
    query GetProducts {
      products(first: 1) {
        nodes {
          id
          title
        }
      }
    }`
  );
  const json = await response.json();
  return { products: json.data.products.nodes };
};

export function ProductList() {
  // Client-side logic
  const { products } = useLoaderData<LoaderData>();  // Fetch data provided by the loader

  const [clicked, setClicked] = useState(false);

  const handleButtonClick = () => {
    setClicked(true);
  };

  return (
    <Card>
      <BlockStack>
        {products.length > 0 ? (
          <Text variant="bodyLg" as="h3">
            Product Title: {products[0].title}
          </Text>
        ) : (
          <Text as="span">No products found</Text>
        )}

        <Button onClick={handleButtonClick}>Click me</Button>

        {clicked && <Text variant="bodyMd" as="span">Button has been clicked!</Text>}
      </BlockStack>
    </Card>
  );
}
