import { Page, Layout, TextContainer, Text, TextField, VerticalStack, HorizontalGrid, Box, AlphaCard, Toast, Frame } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useState, useEffect } from 'react';

export default function AppSettings() {

  const [reorderLevel, setReorderLevel] = useState("");
  const [reorderAmount, setReorderAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState({ content: null });
  const [isFormModified, setIsFormModified] = useState(false);

  const [initialReorderLevel, setInitialReorderLevel] = useState("");
  const [initialReorderAmount, setInitialReorderAmount] = useState("");

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
      }
    }
    getInitialSettings();
  }, []);
  

  const handleReorderLevelChange = (value) => {
    setReorderLevel(value);
    checkFormModification();
  };

  const handleReorderAmountChange = (value) => {
    setReorderAmount(value);
    checkFormModification();
  };

  const checkFormModification = () => {
    if (reorderLevel !== initialReorderLevel || reorderAmount !== initialReorderAmount) {
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
      body: JSON.stringify({ reorderLevel, reorderAmount }),
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
                These values dicate when AutoChain will place a an order with a supplier to restock products crossing the reorder level.
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
              <TextField
                label="Amount to reorder"
                type="number"
                value={reorderAmount}
                onChange={handleReorderAmountChange}
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
                Dimensions
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </VerticalStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <VerticalStack gap="4">
              <TextField label="Horizontal" />
              <TextField label="Interjamb ratio" />
            </VerticalStack>
          </AlphaCard>
        </HorizontalGrid>
      </VerticalStack>
    </Page>
    </Frame>
  )
}