/* eslint-disable react/prop-types */
import {
  Box,
  LegacyCard,
  Modal,
  TextField,
  Select,
  DropZone,
  Button,
  Text,
  Card,
  List,
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';

const orderStatusOptions = [
  { label: '', value: '' },
  { label: 'Created', value: 'created' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];
const initialShipmentData = {
  unitCount: 0,
  tracking: '',
  status: '',
  notes: '',
};

const shipmentFields = {
  unitCount: 'unitCount',
  tracking: 'tracking',
  status: 'status',
  notes: 'notes',
};

export default function ShipmentInvoice({ orderData, setOrderData }) {
  console.log('order data from state', orderData);
  const [active, setActive] = useState(false);
  const [shipmentModalActive, setShipmentModalActive] = useState(false);
  const [invoiceModalActive, setInvoiceModalActive] = useState(false);

  const [currenctShipmentData, setCurrentShipmentData] =
    useState(initialShipmentData);

  const [currenctInvoiceData, setCurrenctInvoiceData] = useState({
    totalCost: 0,
    date: '',
    filePath: '',
  });

  const handleConfirmShipmentData = () => {
    const orderDataClone = structuredClone(orderData);
    const currenOrderDataClone = structuredClone(currenctShipmentData);
    orderDataClone.shipments.push(currenOrderDataClone);
    console.log({ orderDataClone });
    setOrderData(orderDataClone);
    handleClose();
  };

  const handleCancelCurrentShipmentData = () => {
    setCurrentShipmentData(initialShipmentData);
  };

  const handleClose = () => {
    setInvoiceModalActive(false);
    setShipmentModalActive(false);
  };

  const shipmentModalActivator = (
    <Button onClick={() => setShipmentModalActive(true)} size="slim">
      Add Shipments
    </Button>
  );
  const invoiceModalActivator = (
    <Button onClick={() => setInvoiceModalActive(true)} size="slim">
      Add Invoices
    </Button>
  );

  const handleCurrentShipmentDataChange = (value, field) => {
    setCurrentShipmentData((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return (
    <Box>
      <LegacyCard sectioned title="Shipment Information">
        <Modal
          activator={shipmentModalActivator}
          open={shipmentModalActive}
          title="Add Shipment"
          primaryAction={{
            content: 'Add',
            onAction: handleConfirmShipmentData,
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
              label="Total Units"
              type="number"
              min={0}
              value={currenctShipmentData.unitCount}
              onChange={(value) =>
                handleCurrentShipmentDataChange(value, shipmentFields.unitCount)
              }
            />
            <TextField
              label="Shipment Tracking"
              value={currenctShipmentData.tracking}
              onChange={(value) =>
                handleCurrentShipmentDataChange(value, shipmentFields.tracking)
              }
            />
            <Select
              label="Shipment Status"
              options={orderStatusOptions}
              value={currenctShipmentData.status}
              onChange={(value) =>
                handleCurrentShipmentDataChange(value, shipmentFields.status)
              }
            />
            <TextField
              label="Shipment Note"
              type="text"
              value={currenctShipmentData.notes}
              onChange={(value) =>
                handleCurrentShipmentDataChange(value, shipmentFields.notes)
              }
            />
          </Modal.Section>
        </Modal>
        {orderData.shipments?.map((shipment) => {
          return (
            <div key={shipment.tracking} style={{ margin: '5px 0'}}>
              <Card padding={2}>
                <List>
                  <List.Item>Total Units:{shipment.unitCount}</List.Item>
                  <List.Item>Tracking: {shipment.tracking}</List.Item>
                  <List.Item>Status:{shipment.status} </List.Item>
                  <List.Item>Note:{shipment.notes} </List.Item>
                </List>
              </Card>
            </div>
          );
        })}
      </LegacyCard>
      <LegacyCard sectioned title="Invoice Information">
        <Modal
          activator={invoiceModalActivator}
          open={invoiceModalActive}
          title="Add Invoice"
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
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  invoiceNumber: value,
                }))
              }
            />
            <TextField
              label="Invoice Date"
              value={orderData.invoiceNumber}
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  invoiceNumber: value,
                }))
              }
            />
            <DropZone label="Invoice file" allowMultiple={false}>
              <DropZone.FileUpload />
            </DropZone>
          </Modal.Section>
        </Modal>
      </LegacyCard>
    </Box>
  );
}
