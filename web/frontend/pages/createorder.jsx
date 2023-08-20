import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  HorizontalGrid,
  VerticalStack,
  Modal,
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

  return (
    <Page
      breadcrumbs={[{ content: 'Orders', url: '/orders' }]}
      title='New Purchase Order'
      primaryAction={{ content: 'Create Purchase Order', onAction: () => {} }}
      secondaryActions={[
        {
          content: 'Cancel',
          icon: CancelMajor,
          accessibilityLabel: 'Secondary action label',
          onAction: () => {
            navigate('/orders');
          },
        },
      ]}
    >
      <HorizontalGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='4'>
        <VerticalStack gap='4'>
          <Banner title='Order Information'>
            <TextField
              label='SKU'
              value={orderData.SKU}
              onChange={(value) =>
                setOrderData((prevState) => ({ ...prevState, SKU: value }))
              }
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
                  onChange={() => {}} // keep this empty since the date picker handles the change
                  autoComplete='off'
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
              label='Order Notes'
              value={orderData.deliveryNotes}
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  deliveryNotes: value,
                }))
              }
            />
          </Banner>
        </VerticalStack>
        <VerticalStack gap={{ xs: '4', md: '2' }}>
          <Banner title='Shipment Information'>
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
                  label='Shipment Notes'
                  value={orderData.shipmentNotes}
                  onChange={(value) =>
                    setOrderData((prevState) => ({
                      ...prevState,
                      shipmentNotes: value,
                    }))
                  }
                />
                {/* <LegacyStack vertical>
            <LegacyStack.Item>
              <ChoiceList
                title="Export"
                choices={[
                  {label: 'Current page', value: CURRENT_PAGE},
                  {label: 'All customers', value: ALL_CUSTOMERS},
                  {label: 'Selected customers', value: SELECTED_CUSTOMERS},
                ]}
                selected={selectedExport}
                onChange={handleSelectedExport}
              />
            </LegacyStack.Item>
            <LegacyStack.Item>
              <ChoiceList
                title="Export as"
                choices={[
                  {
                    label:
                      'CSV for Excel, Numbers, or other spreadsheet programs',
                    value: CSV_EXCEL,
                  },
                  {label: 'Plain CSV file', value: CSV_PLAIN},
                ]}
                selected={selectedExportAs}
                onChange={handleSelectedExportAs}
              />
            </LegacyStack.Item>
          </LegacyStack> */}
              </Modal.Section>
            </Modal>
          </Banner>
          <Banner title='Invoice Information'>
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
          </Banner>
        </VerticalStack>
      </HorizontalGrid>
    </Page>
  );
}

// // This example is for guidance purposes. Copying it will come with caveats.
// export default function CreateOrder() {
//     const SkeletonLabel = (props) => {
//       return (
//         <Box
//           background="surface-neutral"
//           minHeight="1rem"
//           maxWidth="5rem"
//           borderRadius="base"
//           {...props}
//         />
//       );
//     };
//     const navigate = useNavigate();
//     return (
//       <Page
//         breadcrumbs={[{ content: "Orders", url: "/orders" }]}
//         title="New Purchase Order"
//         primaryAction={{ content: "Create Purchase Order", onAction: () => {  } }}
//         secondaryActions={[
//           {
//             content: "Cancel",
//             icon: CancelMajor,
//             accessibilityLabel: "Secondary action label",
//             onAction: () => { navigate("/orders"); },
//           }
//         ]}
//       >
//         <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
//           <VerticalStack gap="4">
//             <AlphaCard roundedAbove="sm">
//               <VerticalStack gap="4">
//                 <SkeletonLabel />
//                 <Box border="divider" borderRadius="base" minHeight="2rem" />
//                 <SkeletonLabel maxWidth="8rem" />
//                 <Box border="divider" borderRadius="base" minHeight="20rem" />
//               </VerticalStack>
//             </AlphaCard>
//             <AlphaCard roundedAbove="sm">
//               <VerticalStack gap="4">
//                 <SkeletonDisplayText size="small" />
//                 <HorizontalGrid columns={{ xs: 1, md: 2 }}>
//                   <Box border="divider" borderRadius="base" minHeight="10rem" />
//                   <Box border="divider" borderRadius="base" minHeight="10rem" />
//                 </HorizontalGrid>
//               </VerticalStack>
//             </AlphaCard>
//           </VerticalStack>
//           <VerticalStack gap={{ xs: "4", md: "2" }}>
//             <AlphaCard roundedAbove="sm">
//               <VerticalStack gap="4">
//                 <SkeletonDisplayText size="small" />
//                 <Box border="divider" borderRadius="base" minHeight="2rem" />
//                 <Box>
//                   <Bleed marginInline={{ xs: 4, sm: 5 }}>
//                     <Divider />
//                   </Bleed>
//                 </Box>
//                 <SkeletonLabel />
//                 <Divider />
//                 <SkeletonBodyText />
//               </VerticalStack>
//             </AlphaCard>
//             <AlphaCard roundedAbove="sm">
//               <VerticalStack gap="4">
//                 <SkeletonLabel />
//                 <Box border="divider" borderRadius="base" minHeight="2rem" />
//                 <SkeletonLabel maxWidth="4rem" />
//                 <Box border="divider" borderRadius="base" minHeight="2rem" />
//                 <SkeletonLabel />
//                 <SkeletonBodyText />
//               </VerticalStack>
//             </AlphaCard>
//           </VerticalStack>
//         </HorizontalGrid>
//       </Page>
//     )
//   }
