/* eslint-disable react/prop-types */
import {
  Box,
  LegacyCard,
  Modal,
  TextField,
  Select,
  DropZone,
  Button,
  Popover,
  Icon,
  DatePicker,
  Card,
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import OrderDataPreview from './OrderDataPreview';
import InvoiceDataPreview from './InvoiceDataPreview';
import { CalendarMinor } from '@shopify/polaris-icons';

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

const initialInvoiceData = {
  totalCost: 0,
  date: '',
  filePaths: [],
};

const shipmentFields = {
  unitCount: 'unitCount',
  tracking: 'tracking',
  status: 'status',
  notes: 'notes',
};

function validateFields(data) {
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] === '') {
      return false;
    }
  }
  return true;
}
const currentDate = new Date();
export default function ShipmentInvoice({ orderData, setOrderData }) {
  const [files, setFiles] = useState([]);
  const [shipmentModalActive, setShipmentModalActive] = useState(false);
  const [invoiceModalActive, setInvoiceModalActive] = useState(false);
  const [currentInvoiceData, setCurrentInvoiceData] =
    useState(initialInvoiceData);
  const [currenctShipmentData, setCurrentShipmentData] =
    useState(initialShipmentData);
  const [orderDateVisible, setOrderDateVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(currentDate);
  const [{ orderDateMonth, orderDateYear }, setOrderDateValues] = useState({
    orderDateMonth: orderDate.getMonth(),
    orderDateYear: orderDate.getFullYear(),
  });
  function handleOrderDateChange({ end: newSelectedDate }) {
    setOrderDate(newSelectedDate);
    setOrderDateVisible(false);
    setCurrentInvoiceData((prev) => {
      return {
        ...prev,
        date: newSelectedDate.toISOString(),
      };
    });
  }

  function handleOrderMonthChange(month, year) {
    setOrderDateValues({ orderDateMonth: month, orderDateYear: year });
  }
  const orderDateFormattedValue = orderDate.toISOString().slice(0, 10);
  console.log({currentInvoiceData});
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setCurrentInvoiceData((prev) => {
        return {
          ...prev,
          filePaths: [...acceptedFiles],
        };
      });
    },
    []
  );

  const handleConfirmModal = (type) => {
    const orderDataClone = structuredClone(orderData);

    if (type === 'shipment') {
      if (!validateFields(currenctShipmentData)) {
        alert('All fields are required');
        return;
      }
      const currentShipmentDataClone = structuredClone(currenctShipmentData);
      orderDataClone.shipments.push(currentShipmentDataClone);
    }
    if (type === 'invoice') {
      if (!validateFields(currentInvoiceData)) {
        alert('All fields are required');
        return;
      }
      const currentInvoiceDatClone = structuredClone(currentInvoiceData);
      orderDataClone.invoices.push(currentInvoiceDatClone);
      console.log({orderDataClone})
    }
    setOrderData(orderDataClone);
    setCurrentShipmentData(initialShipmentData);
    setCurrentInvoiceData(initialInvoiceData);
    setFiles([]);
    handleClose();
  };

  const cancelShipmentModal = () => {
    setCurrentShipmentData(initialShipmentData);
    handleClose();
  };

  const cancelInvoiceModal = () => {
    setCurrentInvoiceData(initialShipmentData);
    handleClose();
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

  const handleCurrentInvoiceDataChange = useCallback((value, field) => {
    if (field === 'filePaths') {
      setCurrentInvoiceData((prev) => {
        return {
          ...prev,
          filePaths: files,
        };
      });
    } else {
      setCurrentInvoiceData((prev) => {
        return {
          ...prev,
          [field]: value,
        };
      });
    }
  }, []);

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
            onAction: () => handleConfirmModal('shipment'),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: cancelShipmentModal,
            },
          ]}
          onClose={handleClose}
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
        <OrderDataPreview orderData={orderData} />
      </LegacyCard>
      <LegacyCard sectioned title="Invoice Information">
        <Modal
          activator={invoiceModalActivator}
          open={invoiceModalActive}
          title="Add Invoice"
          primaryAction={{
            content: 'Add',
            onAction: () => handleConfirmModal('invoice'),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: cancelInvoiceModal,
            },
          ]}
        >
          <Modal.Section>
            <TextField
              label="Total Cost"
              value={currentInvoiceData.totalCost}
              onChange={(value) =>
                handleCurrentInvoiceDataChange(value, 'totalCost')
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
                  role="combobox"
                  label=" Date"
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
            {/* <TextField
              label="Invoice Date"
              type="date"
              value={currentInvoiceData.date}
              onChange={(value) =>
                handleCurrentInvoiceDataChange(value, 'date')
              }
            /> */}
            <DropZone
              label="Invoice file"
              allowMultiple={true}
              onDrop={handleDropZoneDrop}
            >
              <DropZone.FileUpload />
            </DropZone>
          </Modal.Section>
        </Modal>
        <InvoiceDataPreview orderData={orderData} />
      </LegacyCard>
    </Box>
  );
}
