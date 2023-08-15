import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Page, IndexTable, Text, LegacyCard, useIndexResourceState, AlphaCard } from '@shopify/polaris';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ChecklistMajor, ArchiveMinor, DeleteMinor, EditMinor } from '@shopify/polaris-icons';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useAuthenticatedFetch();

    // Fetch products from the API
    useEffect(() => {
        fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            setLoading(false);
        })
        .catch(error => console.error('Error fetching products:', error));
    }, []);
  

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(products);

  const navigate = useNavigate();
  const secondaryActionsEnabled = selectedResources.length > 0;

  return (
    <Page title="Inventory Levels"
      primaryAction={{ content: "New Purchase Order", onAction: () => { navigate("/createorder") } }} 
      secondaryActions={[
        {
          content: "Update Status",
          icon: ChecklistMajor,
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
          disabled: !secondaryActionsEnabled
        },
        {
          content: "Edit",
          icon: EditMinor,
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Edit action"),
          disabled: !secondaryActionsEnabled
        },
      ]}>
      {loading 
        ? <div>Loading...</div>
        : <AlphaCard padding={0}>
            <IndexTable
              itemCount={products.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                {title: 'Product ID'},
                {title: 'Title'},
                {title: 'SKU'},
                {title: 'On Hand'},
                {title: 'Incoming Inventory'},
                {title: 'Net Inventory'},
                {title: 'Pending Orders'},
            ]}
            >
              {products.map((product, index) => (
                <IndexTable.Row
                  id={product.id}
                  key={product.id}
                  selected={selectedResources.includes(product.id)}
                  position={index}
                >
                  <IndexTable.Cell><Text variant="bodyMd" fontWeight="bold" as="span">{product.productID}</Text></IndexTable.Cell>
                  <IndexTable.Cell>{product.title}</IndexTable.Cell>
                  <IndexTable.Cell>{product.sku}</IndexTable.Cell>
                  <IndexTable.Cell>{product.onHand}</IndexTable.Cell>
                  <IndexTable.Cell>{product.incomingInventory}</IndexTable.Cell>
                  <IndexTable.Cell>{product.netInventory}</IndexTable.Cell>
                  <IndexTable.Cell>{product.pendingOrders}</IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </AlphaCard>
      }
    </Page>
  );  
};

export default ProductsList;