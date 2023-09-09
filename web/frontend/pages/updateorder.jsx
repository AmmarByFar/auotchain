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
  Select
} from '@shopify/polaris';
import CreateOrderProductList from '../components/CreateOrderProductList';
import ShipmentInvoice from '../components/CreateOrder/ShipmentInvoice';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import useUsers from '../hooks/useUsers';
import useUpdateOrder from '../hooks/useUpdateOrder';

const currentDate = new Date();
function validateFields(data) {
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] === '') {
      return false;
    }
  }
  return true;
}
export default function UpdateOrder() {
    const fetch = useAuthenticatedFetch();
    const { orderId } = useParams();
    const { updateOrder } = useUpdateOrder(fetch);

    const { isLoading, data, error } = useAppQuery({ url: `/api/order/${orderId}` });

    const navigate = useNavigate();
    const location = useLocation();
    const [selectedProducts, setSelectedProducts] = useState(
    data?.orderItems || []
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

  const allUsers = useUsers();
  const suppliers = allUsers
  .filter(user => user.UserRole === 'Supplier')
  .map(user => ({ label: user.UserName, value: user.id.toString() }));

  const warehouseManagers = allUsers
    .filter(user => user.UserRole === 'Warehouse Manager')
    .map(user => ({ label: user.UserName, value: user.id.toString() }));

  suppliers.unshift({ label: 'Select a Supplier', value: '' });
  warehouseManagers.unshift({ label: 'Select a Warehouse Manager', value: '' });


  const isAllFieldDisabled = !selectedProducts.length;
  const orderDateFormattedValue = orderDate.toISOString().slice(0, 10);

  function handleOrderDateChange({ end: newSelectedDate }) {
    setOrderDate(newSelectedDate);
    setOrderDateVisible(false);
  }

  function handleOrderMonthChange(month, year) {
    setOrderDateValues({ orderDateMonth: month, orderDateYear: year });
  }

  if (!isLoading && data) {
    setOrderData(data);
  }

  if (!isLoading && error) {
    console.log(error);
    contentToRender = <div>Error occured!</div>;
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
      invoices: orderData.invoices,
    };

    if (!validateFields(payload)) {
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
    formData.append(
      'invoices',
      JSON.stringify(
        orderData.invoices.map((item) => ({
          totalCost: item.totalCost,
          date: item.date,
        }))
      )
    );
    for (let i = 0; i < orderData.invoices.length; i++) {
      for (let j = 0; j < orderData.invoices[i].filePaths.length; j++) {
        formData.append(`invoiceFiles`, orderData.invoices[i].filePaths[j]);
      }
    }

    console.log(payload);
    // Call API to create the order, shipment, and invoice using orderData
    const result = await updateOrder(orderId, formData);

    console.log('update order result', result);
  };

  return (
    <Page
      fullWidth
      backAction={{
        content: 'Update Order',
        url: location?.state?.previousPath || '/updateorder',
      }}
      title="Update Purchase Order"
      primaryAction={{
        content: 'Update Purchase Order',
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
              <Select
                  disabled={isAllFieldDisabled}
                  label="Supplier"
                  options={suppliers}
                  value={orderData.supplierID}
                  onChange={(value) =>
                    setOrderData(prevState => ({ ...prevState, supplierID: value }))
                  }
                />
                <Select
                  disabled={isAllFieldDisabled}
                  label="Warehouse Manager"
                  options={warehouseManagers}
                  value={orderData.warehouseManagerID}
                  onChange={(value) =>
                    setOrderData(prevState => ({ ...prevState, warehouseManagerID: value }))
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