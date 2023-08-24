import {
  Modal,
  LegacyStack,
  Spinner,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  LegacyCard,
  Card,
  Thumbnail,
  TextField,
  Divider,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useAppQuery } from '../../hooks';
import { useLocation } from 'react-router-dom';

const resourceName = {
  singular: 'product',
  plural: 'products',
};

export default function CustomResourcePicker({
  open,
  closeModal,
  setSelectedProducts,
  selectedProducts,
}) {
  const location = useLocation();
  const initialSelectionProducts = location.state?.selectedProducts || [];

  const { isLoading: isProductsLoading, data: productsData } = useAppQuery({
    url: '/api/products',
    reactQueryOptions: {
      refethOnMount: false,
    },
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filterProdcuts = (products) => {
    if (!searchTerm.length) return products;
    return products.filter((item) => item.title.toLowerCase().includes(searchTerm));
  };

  const handleCancel = () => {
    setSelectedProducts(initialSelectionProducts);
    closeModal()
  };

  const handleSelection = (sku)=>{
    const selectedItems = productsData.filter((item) => sku.includes(item.sku));

    const uniqueProductsMap = new Map();
    for(const obj of selectedItems){
      uniqueProductsMap.set(obj.sku, obj)
    }
    const uniqueArrrayOfProducts  = Array.from(uniqueProductsMap.values());
    setSelectedProducts(uniqueArrrayOfProducts);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={closeModal}
        title="Select Products"
        primaryAction={{
          content: 'Confirm',
          onAction: closeModal,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCancel,
          },
        ]}
      >
        <Modal.Section>
          {isProductsLoading && open && <Spinner />}
          <TextField
            placeholder="Search products"
            autoFocus={true}
            type="text"
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
          <LegacyCard>
            <ResourceList
              resourceName={resourceName}
              items={filterProdcuts(productsData)}
              renderItem={renderItem}
              selectedItems={selectedProducts.map((item) => item.sku)}
              onSelectionChange={handleSelection}
              selectable
            />
          </LegacyCard>
        </Modal.Section>
      </Modal>
    </div>
  );
}

function renderItem(item) {
  const { sku, title, imageUrl } = item;
  const media = <Avatar customer size="medium" name={name} source={imageUrl} />;

  return (
    <ResourceItem
      id={sku}
      media={media}
      accessibilityLabel={`View details for ${name}`}
    >
      <div
        style={
          {
            // width: '100%',
            // display: 'flex',
            // alignItems: 'center',
          }
        }
      >
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {title}
        </Text>
        <Text variant="bodySm" fontWeight="bold" as="h3">
          SKU: {sku}
        </Text>
        {/* <div>{location}</div> */}
      </div>
    </ResourceItem>
  );
}
