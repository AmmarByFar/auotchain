import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { Page, DataTable } from '@shopify/polaris';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:3000/api/orders')
//       .then(response => {
//         setOrders(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Error fetching data: ", error);
//         setLoading(false);
//       });
//   }, []);

  const rows = orders.map(order => [
    order.id,
    order.shopDomain,
    order.productID,
    order.SKU,
    order.orderAmount,
    order.supplierID,
    order.warehouseManagerID,
    order.orderStatus,
    order.orderDate,
    order.deliveryDate,
    order.deliveryTracking,
    order.deliveryNotes
  ]);

  const headings = [
    'ID',
    'Shop Domain',
    'Product ID',
    'SKU',
    'Order Amount',
    'Supplier ID',
    'Warehouse Manager ID',
    'Order Status',
    'Order Date',
    'Delivery Date',
    'Delivery Tracking',
    'Delivery Notes'
  ];

  return (
    <Page title="Orders List">
      {loading 
        ? <div>Loading...</div>
        : <DataTable
            columnContentTypes={[
              'numeric',
              'text',
              'numeric',
              'text',
              'numeric',
              'numeric',
              'numeric',
              'text',
              'text',
              'text',
              'text',
              'text',
            ]}
            headings={headings}
            rows={rows}
          />
      }
    </Page>
  );
};

export default OrdersList;