import React, { useState, useRef, useCallback } from 'react';
import '../styles/createOrder.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { CancelMajor, CalendarMinor } from '@shopify/polaris-icons';
import {
  Page,
  TextField,
  DatePicker,
  Popover,
  Icon,
  Card,
  LegacyCard,
  Layout,
  Frame,
} from '@shopify/polaris';
import CreateOrderProductList from '../components/CreateOrderProductList';
import ShipmentInvoice from '../components/CreateOrder/ShipmentInvoice';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import useCreateOrder from '../hooks/useCreateOrder';

const currentDate = new Date();
function validateFields(data) {
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] === '') {
      return false;
    }
  }
  return true;
}
export default function CreateOrder() {
  const fetch = useAuthenticatedFetch();
  const { createOrder } = useCreateOrder(fetch);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProducts, setSelectedProducts] = useState(
    location.state?.selectedProducts || []
  );
  const [orderData, setOrderData] = useState({
    shopDomain: '',
    supplierID: '',
    warehouseManagerID: '',
    orderStatus: '',
    orderDate: currentDate,
    deliveryNotes: '',
    shipmentTracking: '',
    shipmentDate: currentDate,
    expectedArrivalDate: currentDate,
    invoiceDate: currentDate,
    shipments: [],
    invoices: [],
  });
  const [orderDateVisible, setOrderDateVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(currentDate);
  const [{ orderDateMonth, orderDateYear }, setOrderDateValues] = useState({
    orderDateMonth: orderDate.getMonth(),
    orderDateYear: orderDate.getFullYear(),
  });
  const isAllFieldDisabled = !selectedProducts.length;
  const orderDateFormattedValue = orderDate.toISOString().slice(0, 10);

  function handleOrderDateChange({ end: newSelectedDate }) {
    setOrderDate(newSelectedDate);
    setOrderDateVisible(false);
  }

  function handleOrderMonthChange(month, year) {
    setOrderDateValues({ orderDateMonth: month, orderDateYear: year });
  }

  const handleSubmit = async () => {
    const payload = {
      orderDate: orderDate.toISOString(),
      orderNotes: orderData.deliveryNotes,
      supplierID: orderData.supplierID,
      warehouseManagerID: orderData.warehouseManagerID,
      items: selectedProducts.map((product) => ({
        SKU: product.sku,
        quantity: product.orderAmount,
      })),
      shipments: orderData.shipments,
      invoices: orderData.invoices
    };

    if(!validateFields(payload)){
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('orderDate', payload.orderDate);
    formData.append('orderNotes', payload.orderNotes);
    formData.append('supplierID', payload.supplierID);
    formData.append('warehouseManagerID', payload.warehouseManagerID);
    formData.append('items', JSON.stringify(payload.items));
    formData.append('shipments', JSON.stringify(payload.shipments));
    for (let i = 0; i < orderData.invoices.length; i++) {
      for(let j = 0; j < orderData.invoices[i].filePaths.length; j++){
        formData.append(`invoiceFiles`, orderData.invoices[i].filePaths[j]);
      }
    }

    console.log(formData.getAll('invoiceFiles')); 
    console.log(payload)
    // Call API to create the order, shipment, and invoice using orderData
    const result = await createOrder(formData);

    console.log('order create result', result);
  };


  return (
    <Page
      fullWidth
      backAction={{
        content: 'Orders',
        url: location?.state?.previousPath || '/orders',
      }}
      title="New Purchase Order"
      primaryAction={{
        content: 'Create Purchase Order',
        onAction: handleSubmit,
        disabled: isAllFieldDisabled,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          icon: CancelMajor,
          accessibilityLabel: 'Secondary action label',
          onAction: () => navigate(-1),
        },
      ]}
    >
      <Frame>
        <Layout>
          <Layout.Section>
            <CreateOrderProductList
              products={selectedProducts}
              setProducts={setSelectedProducts}
            />
            <div style={{ marginTop: '20px' }}>
              <LegacyCard sectioned title="Order Information" padding={5}>
                <TextField
                  disabled={isAllFieldDisabled}
                  label="Supplier"
                  value={orderData.supplierID}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      supplierID: value,
                    }))
                  }
                />
                <TextField
                  disabled={isAllFieldDisabled}
                  label="Warehouse Manager"
                  value={orderData.warehouseManagerID}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      warehouseManagerID: value,
                    }))
                  }
                />
                <Popover
                  active={orderDateVisible}
                  autofocusTarget="none"
                  preferredAlignment="left"
                  fullWidth
                  preferInputActivator={false}
                  preferredPosition="below"
                  preventCloseOnChildOverlayClick
                  onClose={() => setOrderDateVisible(false)}
                  activator={
                    <TextField
                      disabled={isAllFieldDisabled}
                      role="combobox"
                      label="Order Date"
                      prefix={<Icon source={CalendarMinor} />}
                      value={orderDateFormattedValue}
                      onFocus={() => setOrderDateVisible(true)}
                      onChange={() => {}}
                      autoComplete="off"
                    />
                  }
                >
                  <Card>
                    <DatePicker
                      month={orderDateMonth}
                      year={orderDateYear}
                      selected={orderDate}
                      onMonthChange={(month, year) =>
                        handleOrderMonthChange(month, year)
                      }
                      onChange={(date) => handleOrderDateChange(date)}
                    />
                  </Card>
                </Popover>
                <TextField
                  disabled={isAllFieldDisabled}
                  label="Order Notes"
                  value={orderData.deliveryNotes}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      deliveryNotes: value,
                    }))
                  }
                />
                
              </LegacyCard>
            </div>
          </Layout.Section>
          <Layout.Section oneThird>
            <ShipmentInvoice
              orderData={orderData}
              setOrderData={setOrderData}
            />
          </Layout.Section>
        </Layout>
      </Frame>
    </Page>
  );
}
