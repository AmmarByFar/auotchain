import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Page, 
  HorizontalGrid, 
  VerticalStack, 
  SkeletonDisplayText, 
  SkeletonBodyText, 
  Box, 
  Card, 
  Bleed, 
  Divider, 
  TextField, 
  Select 
} from '@shopify/polaris';
import { CancelMajor } from '@shopify/polaris-icons';

// This example is for guidance purposes. Copying it will come with caveats.
export default function CreateUser() {
    const SkeletonLabel = (props) => {
      return (
        <Box
          background="surface-neutral"
          minHeight="1rem"
          maxWidth="5rem"
          borderRadius="base"
          {...props}
        />
      );
    };

    const [value, setValue] = useState('Jaded Pixel');

    const handleChange = useCallback(
        (newValue) => setValue(newValue),
        [],
    );

    const [roleSelected, setSelected] = useState('today');

    const handleSelectChange = useCallback(
        (value) => setSelected(value),
        [],
    );

    const userRoleOptions = [
        {label: 'Supplier', value: 'supplier'},
        {label: 'Warehouse Manager', value: 'warehouseManager'},
      ];

    const navigate = useNavigate();
    return (
      <Page
        breadcrumbs={[{ content: "Users", url: "/manageusers" }]}
        title="Create New Inventory Personnel"
        primaryAction={{ content: "Create User", onAction: () => {  } }} 
        secondaryActions={[
          {
            content: "Cancel",
            icon: CancelMajor,
            accessibilityLabel: "Secondary action label",
            onAction: () => { navigate("/manageusers"); },
          }      
        ]}
      >
        <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
          <VerticalStack gap="4">
            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonLabel />
                <TextField
                    label="Username"
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <TextField
                    label="Password"
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <Select
                    label="Date range"
                    options={userRoleOptions}
                    onChange={handleSelectChange}
                    value={roleSelected}
                />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel maxWidth="8rem" />
                <Box border="divider" borderRadius="base" minHeight="20rem" />
              </VerticalStack>
            </Card>
            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonDisplayText size="small" />
                <HorizontalGrid columns={{ xs: 1, md: 2 }}>
                  <Box border="divider" borderRadius="base" minHeight="10rem" />
                  <Box border="divider" borderRadius="base" minHeight="10rem" />
                </HorizontalGrid>
              </VerticalStack>
            </Card>
          </VerticalStack>
          <VerticalStack gap={{ xs: "4", md: "2" }}>
            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonDisplayText size="small" />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <Box>
                  <Bleed marginInline={{ xs: 4, sm: 5 }}>
                    <Divider />
                  </Bleed>
                </Box>
                <SkeletonLabel />
                <Divider />
                <SkeletonBodyText />
              </VerticalStack>
            </Card>
            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonLabel />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel maxWidth="4rem" />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel />
                <SkeletonBodyText />
              </VerticalStack>
            </Card>
          </VerticalStack>
        </HorizontalGrid>
      </Page>
    )
}