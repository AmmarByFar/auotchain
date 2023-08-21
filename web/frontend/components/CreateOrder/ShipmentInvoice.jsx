/* eslint-disable react/prop-types */
import {
  Box,
  LegacyCard,
  Modal,
  TextField,
  Select,
  DropZone,
  Button,
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';

const orderStatusOptions = [
  { label: '', value: '' },
  { label: 'Created', value: 'created' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];

export default function ShipmentInvoice({ orderData, setOrderData }) {
  const [active, setActive] = useState(false);
  const handleModalChange = useCallback(() => setActive(!active), [active]);

  const handleClose = () => {
    handleModalChange();
  };

  const activator = <Button onClick={handleModalChange}>Add Shipment</Button>;
  return (
    <Box>
      <LegacyCard sectioned title="Shipment Information">
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
              onChange={(value) =>
                setOrderData((prevState) => ({
                  ...prevState,
                  shipmentTracking: value,
                }))
              }
            />
            <Select
              label="Shipment Status"
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
              label="Order Amount"
              type="number"
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
      </LegacyCard>
      <LegacyCard sectioned title="Invoice Information">
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
