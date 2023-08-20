import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  CancelMajor,
  ArchiveMinor,
  DeleteMinor,
  CalendarMinor,
} from '@shopify/polaris-icons';

import {
  Page,
  FormLayout,
  TextField,
  DatePicker,
  Button,
  ChoiceList,
  Form,
  Banner,
  Popover,
  Icon,
  AlphaCard,
  Select,
  DropZone,
  Label,
  Text,
  HorizontalGrid,
  VerticalStack,
  HorizontalStack,
  Thumbnail,
  Modal
} from '@shopify/polaris';

const currentDate = new Date();
export default function CreateOrder() {
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

  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];

function handleOrderDateChange({ end: newSelectedDate }) {
  setOrderDate(newSelectedDate);
  setOrderDateVisible(false);
}

function handleOrderMonthChange(month, year) {
  setOrderDateValues({ orderDateMonth: month, orderDateYear: year  });
}

function handleProductChange(index, value) {
  const newProducts = [...products];
  newProducts[index].orderAmount = value;
  setProducts(newProducts);
}


  const handleSubmit = () => {
    // Call API to create the order, shipment, and invoice using orderData
  };

  const orderStatusOptions = [
    { label: '', value: '' },
    { label: 'Created', value: 'created' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  const [active, setActive] = useState(false);

  const handleModalChange = useCallback(() => setActive(!active), [active]);

  const handleClose = () => {
    handleModalChange();
  };

  const activator = <Button onClick={handleModalChange}>Add Shipment</Button>;

  const [products, setProducts] = useState(selectedProducts.map(p => ({
    ...p, 
    orderAmount: ''
  })));

  return (
  <Page
    breadcrumbs={[{ content: "Orders", url: "/orders" }]}
    title="New Purchase Order"
    primaryAction={{ content: "Create Purchase Order", onAction: () => {  } }} 
    secondaryActions={[
      {
        content: "Cancel",
        icon: CancelMajor,
        accessibilityLabel: "Secondary action label",
        onAction: () => { navigate("/orders"); },
      }      
    ]}
  >
    <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
      <VerticalStack gap="4">
        <Banner title="Order Information">
          {products.map((product, index) => (
          <HorizontalStack gap="4" wrap={false} key={product.id}>
            <Thumbnail
              source={product.imageUrl}
              alt={`Product ${product.sku}`}
            />
            <Text variant="headingXs" as="h6">{`SKU: ${product.sku}`}</Text>
            <TextField
              value={product.orderAmount}
              onChange={(value) => handleProductChange(index, value)}
            />
            <Icon source={CancelMinor} color="critical" />
          </HorizontalStack>
          ))}
          {/* <TextField
            label="SKU"
            value={orderData.SKU}
            onChange={(value) => setOrderData(prevState => ({ ...prevState, SKU: value }))}
          /> */}
          <TextField
            label="Supplier"
            value={orderData.supplierID}
            onChange={(value) => setOrderData(prevState => ({ ...prevState, supplierID: value }))}
          />
          <TextField
            label="Warehouse Manager"
            value={orderData.warehouseManagerID}
            onChange={(value) => setOrderData(prevState => ({ ...prevState, warehouseManagerID: value }))}
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
            role="combobox"
            label={"Order Date"}
            prefix={<Icon source={CalendarMinor} />}
            value={orderDateFormattedValue}
            onFocus={() => setOrderDateVisible(true)}
            onChange={() => {}} 
            autoComplete="off"
            />
            }
          >
            <AlphaCard ref={orderDatePickerRef}>
              <DatePicker
              month={orderDateMonth}
              year={orderDateYear}
              selected={orderDate}
              onMonthChange={handleOrderMonthChange}
              onChange={handleOrderDateChange}
              />
            </AlphaCard>
          </Popover>
          <TextField
          label="Order Notes"
          value={orderData.deliveryNotes}
          onChange={(value) => setOrderData(prevState => ({ ...prevState, deliveryNotes: value }))}
          />
        </Banner>
      </VerticalStack>
      <VerticalStack gap={{ xs: "4", md: "2" }}>
      <Banner title="Shipment Information">
        <Modal
          activator={activator}
          open={active}
          onClose={handleClose}
          title="Add Shipment"
          primaryAction={{
            content: 'Add',
            onAction: handleClose,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleClose,
            },
          ]}
        >
        <Modal.Section>
          <TextField
              label="Shipment Tracking"
              value={orderData.shipmentTracking}
              onChange={(value) => setOrderData(prevState => ({ ...prevState, shipmentTracking: value }))}
            />
            <Select
              label="Shipment Status"
              options={orderStatusOptions}
              onChange={(value) => setOrderData(prevState => ({ ...prevState, shipmentStatus: value }))}
              value={orderData.shipmentStatus}
            />
            <TextField
              label='Order Amount'
              type='number'
              value={orderData.orderAmount}
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  orderAmount: value,
                }))
              }
            />
        </Modal.Section>
      </Modal>
      </Banner>
      <Banner title="Invoice Information">
        <Modal
            activator={activator}
            open={active}
            onClose={handleClose}
            title="Add Shipment"
            primaryAction={{
              content: 'Add',
              onAction: handleClose,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: handleClose,
              },
            ]}
          >
            <Modal.Section>
            <TextField
                label="Invoice Number"
                value={orderData.invoiceNumber}
                onChange={(value) => setOrderData(prevState => ({ ...prevState, invoiceNumber: value }))}
              />
              <TextField
                label="Invoice Date"
                value={orderData.invoiceNumber}
                onChange={(value) => setOrderData(prevState => ({ ...prevState, invoiceNumber: value }))}
              />
              <DropZone label="Invoice file" allowMultiple={false}>
                <DropZone.FileUpload />
              </DropZone>
          </Modal.Section>   
          </Modal>
        </Banner>
      </VerticalStack>
      </HorizontalGrid>
    </Page>
  );
}
