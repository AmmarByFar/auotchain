import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Page, HorizontalGrid, VerticalStack, SkeletonDisplayText, SkeletonBodyText, Box, AlphaCard, Bleed, Divider } from '@shopify/polaris';
import { CancelMajor, ArchiveMinor, DeleteMinor } from '@shopify/polaris-icons';



// This example is for guidance purposes. Copying it will come with caveats.
export default function CreateOrder() {
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
    const navigate = useNavigate();
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
            <AlphaCard roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonLabel />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel maxWidth="8rem" />
                <Box border="divider" borderRadius="base" minHeight="20rem" />
              </VerticalStack>
            </AlphaCard>
            <AlphaCard roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonDisplayText size="small" />
                <HorizontalGrid columns={{ xs: 1, md: 2 }}>
                  <Box border="divider" borderRadius="base" minHeight="10rem" />
                  <Box border="divider" borderRadius="base" minHeight="10rem" />
                </HorizontalGrid>
              </VerticalStack>
            </AlphaCard>
          </VerticalStack>
          <VerticalStack gap={{ xs: "4", md: "2" }}>
            <AlphaCard roundedAbove="sm">
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
            </AlphaCard>
            <AlphaCard roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonLabel />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel maxWidth="4rem" />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel />
                <SkeletonBodyText />
              </VerticalStack>
            </AlphaCard>
          </VerticalStack>
        </HorizontalGrid>
      </Page>
    )
  }