import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Page, IndexTable, Text, LegacyCard, useIndexResourceState, AlphaCard } from '@shopify/polaris';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ChecklistMajor, ArchiveMinor, DeleteMinor, EditMinor } from '@shopify/polaris-icons';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useAuthenticatedFetch();

    // Fetch orders from the API
    useEffect(() => {
        fetch('/api/orders')
        .then(response => response.json())
        .then(data => {
            setOrders(data);
            setLoading(false);
        })
        .catch(error => console.error('Error fetching orders:', error));
    }, []);
  

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(orders);

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
              itemCount={orders.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                {title: 'Product ID'},
                {title: 'SKU'},
                {title: 'On Hand'},
                {title: 'Units Sold'},
                {title: 'Incoming Inventory'},
                {title: 'Net Inventory'},
                {title: 'Pending Orders'},
              ]}
            >
              {orders.map((order, index) => (
                <IndexTable.Row
                  id={order.id}
                  key={order.id}
                  selected={selectedResources.includes(order.id)}
                  position={index}
                >
                  <IndexTable.Cell><Text variant="bodyMd" fontWeight="bold" as="span">{order.productID}</Text></IndexTable.Cell>
                  <IndexTable.Cell>{order.SKU}</IndexTable.Cell>
                  <IndexTable.Cell>{order.orderAmount}</IndexTable.Cell>
                  <IndexTable.Cell>{order.Supplier.username}</IndexTable.Cell>
                  <IndexTable.Cell>{order.WarehouseManager.username}</IndexTable.Cell>
                  <IndexTable.Cell>{order.orderStatus}</IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </AlphaCard>
      }
    </Page>
  );  
};

export default OrdersList;