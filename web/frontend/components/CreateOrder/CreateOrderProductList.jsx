import {
  HorizontalStack,
  Thumbnail,
  Text,
  TextField,
  Button,
  Icon,
  Box,
  CalloutCard,
  LegacyCard,
} from '@shopify/polaris';
import { CancelMinor, DeleteMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { useState } from 'react';

const mapProductsFromResourcePicker = (products) => {
  return products.selection
    .map((product) => {
      return product.variants.map((variant) => {
        return {
          id: variant.id.split('gid://shopify/ProductVariant/')[1],
          sku: variant.sku,
          imageUrl: variant.image
            ? variant.image
            : product.images[0].originalSrc,
          title: product.title + ' - ' + variant.title,
          orderAmount: 1,
        };
      });
    })
    .flat();
};
const CreateOrderProductList = ({ products, setProducts }) => {
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
  const handleOrderAmountChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].orderAmount = value;
    setProducts(newProducts);
  };

  const handleRemoveProduct = (id) => {
    console.log('removing,', id);
    const newProducts = [...products].filter((p) => p.id !== id);
    setProducts(newProducts);
  };

  const emptyProductComponent = products.length ? null : (
    <Box as="div">
      <CalloutCard
        title="No products selcted to create purchase order."
        illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
        primaryAction={{
          content: 'Select Products',
          onAction: () => {
            setResourcePickerOpen(true);
          },
        }}
      >
        <p>Select some product(s) first to create an order.</p>
      </CalloutCard>
    </Box>
  );
  const resourcePickerComponent = (
    <ResourcePicker
      resourceType="Product"
      showVariants={true}
      open={resourcePickerOpen}
      selectMultiple={true}
      onSelection={(selection) => {
        setProducts(mapProductsFromResourcePicker(selection));
        setResourcePickerOpen(false);
      }}
      onCancel={() => {
        setResourcePickerOpen(false);
      }}
    />
  );

  let prodcutListComponent = !products.length ? null : (
    <LegacyCard
      sectioned
      title="Product Details"
      actions={[
        {
          content: 'Change Products',
          onAction: () => setResourcePickerOpen(true),
        },
      ]}
    >
      {products.map((product, index) => (
        <div className="product-list-item">
          <HorizontalStack
            wrap={false}
            gap="4"
            align="space-between"
            blockAlign="center"
            key={product.id}
          >
            <div
              style={{
                width: '100px',
              }}
            >
              <Thumbnail
                source={product.imageUrl}
                alt={`Product ${product.sku}`}
                size="medium"
                transparent={true}
              />
            </div>
            <div style={{ width: '200px' }}>
              <Text variant="bodyMd" as="h3">
                {product.title}
              </Text>
              <Text variant="headingXs" as="h6">
                {`SKU: ${product.sku}`}
              </Text>
            </div>
            <TextField
              placeholder="Order Amount"
              type="number"
              value={product.orderAmount}
              onChange={(value) => handleOrderAmountChange(index, value)}
            />
            <Button
              destructive
              onClick={() => {
                console.log('remove product');
                handleRemoveProduct(product.id);
              }}
            >
              <Icon source={DeleteMinor} color="critical" />
            </Button>
          </HorizontalStack>
        </div>
      ))}
    </LegacyCard>
  );

  console.log({ resourcePickerOpen });

  return (
    <>
      {prodcutListComponent}
      {resourcePickerComponent}
      {emptyProductComponent}
    </>
  );
};

export default CreateOrderProductList;
