import React, { useState, useRef } from 'react';
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
} from '@shopify/polaris';
import CreateOrderProductList from '../components/CreateOrder/CreateOrderProductList';
import ShipmentInvoice from '../components/CreateOrder/ShipmentInvoice';

const currentDate = new Date();
export default function CreateOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProducts, setSelectedProducts] = useState(
    location.state?.selectedProducts || []
  );

  const isAllFieldDisabled = !selectedProducts.length;

  const [orderData, setOrderData] = useState({
    shopDomain: '',
    productID: '',
    SKU: '',
    orderAmount: '',
    supplierID: '',
    warehouseManagerID: '',
    orderStatus: '',
    orderDate: currentDate,
    deliveryNotes: '',
    shipmentTracking: '',
    shipmentDate: currentDate,
    expectedArrivalDate: currentDate,
    shipmentStatus: '',
    shipmentNotes: '',
    invoiceNumber: '',
    invoiceDate: currentDate,
    filePath: '',
  });

  const [orderDateVisible, setOrderDateVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(currentDate);
  const [{ orderDateMonth, orderDateYear }, setOrderDateValues] = useState({
    orderDateMonth: orderDate.getMonth(),
    orderDateYear: orderDate.getFullYear(),
  });
  const orderDateFormattedValue = orderDate.toISOString().slice(0, 10);
  const orderDatePickerRef = useRef(null);

  function handleOrderDateChange({ end: newSelectedDate }) {
    setOrderDate(newSelectedDate);
    setOrderDateVisible(false);
  }

  function handleOrderMonthChange(month, year) {
    setOrderDateValues({ orderDateMonth: month, orderDateYear: year });
  }

  const handleSubmit = () => {
    // Call API to create the order, shipment, and invoice using orderData
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
        onAction: () => {},
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
      <Layout>
        <Layout.Section>
          <CreateOrderProductList
            products={selectedProducts}
            setProducts={setSelectedProducts}
            key="CreateOrderProductList"
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
                <Card ref={orderDatePickerRef}>
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
          <ShipmentInvoice orderData={orderData} setOrderData={setOrderData} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
