import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  CancelMajor,
  ArchiveMinor,
  DeleteMinor,
  CalendarMinor,
  CancelMinor,
} from '@shopify/polaris-icons';

import {
  Page,
  FormLayout,
  TextField,
  DatePicker,
  Button,
  Form,
  Banner,
  Popover,
  Icon,
  Card,
  Select,
  DropZone,
  Label,
  Text,
  HorizontalGrid,
  VerticalStack,
  HorizontalStack,
  Thumbnail,
  Modal,
  LegacyCard,
  ResourceList,
  ResourceItem,
  Avatar,
  Grid,
} from '@shopify/polaris';
import CreateOrderProductList from '../components/CreateOrderProductList';

const currentDate = new Date();
export default function CreateOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProducts, setSelectedProducts] = useState(
    location.state?.selectedProducts || []
  );

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

  console.log(location);

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

  const [products, setProducts] = useState(
    selectedProducts.map((p) => ({
      ...p,
      orderAmount: '',
    }))
  );

  return (
    <Page
      fullWidth
      backAction={{
        content: 'Orders',
        url: location?.state?.previousPath || '/orders',
      }}
      title='New Purchase Order'
      primaryAction={{ content: 'Create Purchase Order', onAction: () => {} }}
      secondaryActions={[
        {
          content: 'Cancel',
          icon: CancelMajor,
          accessibilityLabel: 'Secondary action label',
          onAction: () => navigate(-1),
        },
      ]}
    >
      <HorizontalGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='4'>
        <VerticalStack gap='4'>
          <LegacyCard sectioned title='Product Details' padding={5}>
            <CreateOrderProductList
              products={selectedProducts}
              setProducts={setSelectedProducts}
              key={'CreateOrderProductList'}
            />
          </LegacyCard>
          <LegacyCard sectioned title='Order Information' padding={5}>
            <TextField
              label='Supplier'
              value={orderData.supplierID}
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  supplierID: value,
                }))
              }
            />
            <TextField
              label='Warehouse Manager'
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
              autofocusTarget='none'
              preferredAlignment='left'
              fullWidth
              preferInputActivator={false}
              preferredPosition='below'
              preventCloseOnChildOverlayClick
              onClose={() => setOrderDateVisible(false)}
              activator={
                <TextField
                  role='combobox'
                  label={'Order Date'}
                  prefix={<Icon source={CalendarMinor} />}
                  value={orderDateFormattedValue}
                  onFocus={() => setOrderDateVisible(true)}
                  onChange={() => {}}
                  autoComplete='off'
                />
              }
            >
              <Card ref={orderDatePickerRef}>
                <DatePicker
                  month={orderDateMonth}
                  year={orderDateYear}
                  selected={orderDate}
                  onMonthChange={handleOrderMonthChange}
                  onChange={handleOrderDateChange}
                />
              </Card>
            </Popover>
            <TextField
              label='Order Notes'
              value={orderData.deliveryNotes}
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  deliveryNotes: value,
                }))
              }
            />
          </LegacyCard>
        </VerticalStack>
        <VerticalStack gap={{ xs: '4', md: '2' }}>
          <Card sectioned title='Shipment Information'>
            <Modal
              activator={activator}
              open={active}
              onClose={handleClose}
              title='Add Shipment'
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
                  label='Shipment Tracking'
                  value={orderData.shipmentTracking}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      shipmentTracking: value,
                    }))
                  }
                />
                <Select
                  label='Shipment Status'
                  options={orderStatusOptions}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      shipmentStatus: value,
                    }))
                  }
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
          </Card>
          <Card sectioned title='Invoice Information'>
            <Modal
              activator={activator}
              open={active}
              onClose={handleClose}
              title='Add Shipment'
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
                  label='Invoice Number'
                  value={orderData.invoiceNumber}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      invoiceNumber: value,
                    }))
                  }
                />
                <TextField
                  label='Invoice Date'
                  value={orderData.invoiceNumber}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      invoiceNumber: value,
                    }))
                  }
                />
                <DropZone label='Invoice file' allowMultiple={false}>
                  <DropZone.FileUpload />
                </DropZone>
              </Modal.Section>
            </Modal>
          </Card>
        </VerticalStack>
      </HorizontalGrid>
    </Page>
  );
}
