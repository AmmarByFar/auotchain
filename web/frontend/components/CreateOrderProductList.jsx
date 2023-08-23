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
  Spinner,
} from '@shopify/polaris';
import { CancelMinor, DeleteMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { useCallback, useState } from 'react';
import { useAppQuery } from '../hooks';
import CustomResourcePicker from './CustomResourcePicker/CustomResourcePicker';

const CreateOrderProductList = ({ products, setProducts }) => {
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
  const handleOrderAmountChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].orderAmount = value;
    setProducts(newProducts);
  };

  const handleRemoveProduct = (id) => {
    const newProducts = [...products].filter((p) => p.id !== id);
    setProducts(newProducts);
  };

  const toggleModal = () => setResourcePickerOpen((open) => !open);

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
      {products?.map((product, index) => (
        <div className="product-list-item" key={product.title}>
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
            <Text>Available: {product.onHand}</Text>
            <TextField
              placeholder="Order Amount"
              type="number"
              value={product.orderAmount}
              onChange={(value) => handleOrderAmountChange(index, value)}
              inputMode="numeric"
            />
            <Button
              destructive
              onClick={() => {
                handleRemoveProduct(product.id);
              }}
              size="micro"
            >
              <Icon source={DeleteMinor} color="critical" />
            </Button>
          </HorizontalStack>
        </div>
      ))}
    </LegacyCard>
  );

  return (
    <>
      {prodcutListComponent}
      {emptyProductComponent}
      <CustomResourcePicker
        selectedProducts={products}
        closeModal={toggleModal}
        open={resourcePickerOpen}
        setSelectedProducts={setProducts}
      />
    </>
  );
};

export default CreateOrderProductList;
