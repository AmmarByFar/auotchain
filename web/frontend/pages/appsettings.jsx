import { Page, Layout, TextContainer, Text, TextField, VerticalStack, HorizontalGrid, Box, AlphaCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function AppSettings() {
  // const [value, setValue] = useState('1');

  // const handleChange = useCallback(
  //   (newValue: string) => setValue(newValue),
  //   [],
  // );

  return (
    <Page
      divider
      primaryAction={{ content: "Save Settings", disabled: true }}
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
                // value={value}
                // onChange={handleChange}
                autoComplete="off"
              />
              <TextField
                label="Amount to reorder"
                type="number"
                // value={value}
                // onChange={handleChange}
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
  )
}