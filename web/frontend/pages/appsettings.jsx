import { Page, Layout, Text, Icon, Popover, TextField, VerticalStack, HorizontalGrid, Box, AlphaCard, Toast, Frame, Checkbox, DatePicker } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useState, useEffect, useRef } from 'react';
import { CalendarMinor} from '@shopify/polaris-icons';

export default function AppSettings() {

  const [reorderLevel, setReorderLevel] = useState("");
  const [reorderAmount, setReorderAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState({ content: null });
  const [isFormModified, setIsFormModified] = useState(false);

  const [initialReorderLevel, setInitialReorderLevel] = useState("");
  const [initialReorderAmount, setInitialReorderAmount] = useState("");

  const [startDate, setStartDate] = useState("");
  const [initialStartDate, setInitialStartDate] = useState("");

  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [initialTrackingEnabled, setInitialTrackingEnabled] = useState(false);


  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    const getInitialSettings = async () => {
      const response = await fetch('/api/appsettings');
      const data = await response.json();
      if(data.settings) {
        setInitialReorderLevel(data.settings.reorderLevel.toString());
        setInitialReorderAmount(data.settings.reorderAmount.toString());
        setReorderLevel(data.settings.reorderLevel.toString());
        setReorderAmount(data.settings.reorderAmount.toString());
        setInitialStartDate(data.settings.startDate || "");
        setStartDate(data.settings.startDate || "");
        setSelectedDate(new Date(data.settings.startDate || new Date()));
        setInitialTrackingEnabled(data.settings.trackingEnabled || false);
        setTrackingEnabled(data.settings.trackingEnabled || false);
      }
    }
    getInitialSettings();
  }, []);
  
  const handleStartDateChange = (newDate) => {
    setStartDate(newDate.toISOString().slice(0, 10));
  };

  const handleReorderLevelChange = (value) => {
    setReorderLevel(value);
  };

  const handleReorderAmountChange = (value) => {
    setReorderAmount(value);
  };

  const handleTrackingEnabledChange = (newValue) => {
    setTrackingEnabled(newValue);
  };

  useEffect(() => {
    checkFormModification();
  }, [reorderLevel, reorderAmount, startDate, trackingEnabled]);

  const checkFormModification = () => {
    if (
      reorderLevel !== initialReorderLevel ||
      reorderAmount !== initialReorderAmount ||
      startDate !== initialStartDate ||
      trackingEnabled !== initialTrackingEnabled
    ) {
      setIsFormModified(true);
    } else {
      setIsFormModified(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await fetch('/api/appsettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reorderLevel, reorderAmount, startDate, trackingEnabled }),
    });

    if(response.ok) {
      setToastProps({ content: "Settings saved successfully!" });
    } else {
      setToastProps({
        content: "There was an error saving your settings",
        error: true,
      });
    }
    setIsLoading(false);
  };

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps({ content: null })} />
  );

  function nodeContainsDescendant(rootNode, descendant) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const formattedValue = selectedDate.toISOString().slice(0, 10);
  const datePickerRef = useRef(null);
  function isNodeWithinPopover(node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    setSelectedDate(newSelectedDate);
    handleStartDateChange(newSelectedDate);
    setVisible(false);
  }
  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  return (
    <Frame>
    {toastMarkup}
    <Page
      divider
      primaryAction={{ content: "Save Settings", disabled: !isFormModified, loading: isLoading, onAction: () => handleSubmit() }}
      secondaryActions={[
        {
          content: "Default",
          accessibilityLabel: "Reset settings to default.",
          onAction: () => alert("Duplicate action"),
        },
      ]}
    >
      <VerticalStack gap={{ xs: "8", sm: "4" }}>
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Inventory Reorder Levels
              </Text>
              <Text as="p" variant="bodyMd">
                Products will be flagged when inventory levels fall below these values.
              </Text>
            </VerticalStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <VerticalStack gap="4">
              <TextField
                label="Reorder level"
                type="number"
                value={reorderLevel}
                onChange={handleReorderLevelChange}
                autoComplete="off"
              />
            </VerticalStack>
          </AlphaCard>
        </HorizontalGrid>
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Tracking
              </Text>
              <Text as="p" variant="bodyMd">
                Track sales begining at specified date. Sales prior to this date will not be tracked. Ensure inventory levels are accurate before enabling.
              </Text>
            </VerticalStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <VerticalStack gap="4">
              <Checkbox 
                label="Enable Tracking" 
                checked={trackingEnabled}
                onChange={handleTrackingEnabledChange}
              />
                <Popover
                  active={visible}
                  autofocusTarget="none"
                  preferredAlignment="left"
                  fullWidth
                  preferInputActivator={false}
                  preferredPosition="below"
                  preventCloseOnChildOverlayClick
                  onClose={handleOnClose}
                  activator={
                    <TextField
                      role="combobox"
                      label={"Start date"}
                      prefix={<Icon source={CalendarMinor} />}
                      value={formattedValue}
                      onFocus={() => setVisible(true)}
                      onChange={handleInputValueChange}
                      autoComplete="off"
                    />
                  }
                >
                  <AlphaCard ref={datePickerRef}>
                    <DatePicker
                      month={month}
                      year={year}
                      selected={selectedDate}
                      onMonthChange={handleMonthChange}
                      onChange={handleDateSelection}
                    />
                  </AlphaCard>
                </Popover>
            </VerticalStack>
          </AlphaCard>
        </HorizontalGrid>
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Notifications
              </Text>
              <Text as="p" variant="bodyMd">
                Email notifications sent to suppliers when a PO is placed.
              </Text>
            </VerticalStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <VerticalStack gap="4">
              <Checkbox label="Notify suppliers when PO is created" />
              <Checkbox label="CC store owner for all notifications" />
            </VerticalStack>
          </AlphaCard>
        </HorizontalGrid>
      </VerticalStack>
    </Page>
    </Frame>
  )
}