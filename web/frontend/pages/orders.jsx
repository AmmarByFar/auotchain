import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/orders.css';
import { Page, useIndexResourceState, Spinner } from '@shopify/polaris';
import { useAppQuery } from '../hooks';
import {
  ChecklistMajor,
  ArchiveMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import OrdersComponent from '../components/Orders/Orders';

const OrdersList = () => {
  const { isLoading, data, error } = useAppQuery({ url: '/api/orders' });

  const { selectedResources } = useIndexResourceState(data);

  const navigate = useNavigate();
  const secondaryActionsEnabled = selectedResources.length > 0;

  let contentToRender = null;
  if (isLoading) {
    contentToRender = (
      <div
        style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}
      >
        <Spinner size="large" />
      </div>
    );
  }

  if (!isLoading && data) {
    contentToRender = <OrdersComponent orders={data} />;
  }

  if (!isLoading && error) {
    console.log(error);
    contentToRender = <div>Error occured!</div>;
  }

  return (
    <Page
      fullWidth
      title="Purchase Orders"
      primaryAction={{
        content: 'New Purchase Order',
        onAction: () => {
          navigate('/createorder');
        },
      }}
      secondaryActions={[
        {
          content: 'Update Status',
          icon: ChecklistMajor,
          accessibilityLabel: 'Secondary action label',
          onAction: () => alert('Duplicate action'),
          disabled: !secondaryActionsEnabled,
        },
        {
          content: 'Archive',
          icon: ArchiveMinor,
          accessibilityLabel: 'Secondary action label',
          onAction: () => alert('Archive action'),
          disabled: !secondaryActionsEnabled,
        },
        {
          content: 'Delete',
          icon: DeleteMinor,
          destructive: true,
          accessibilityLabel: 'Secondary action label',
          onAction: () => alert('Delete action'),
          disabled: !secondaryActionsEnabled,
        },
      ]}
    >
      {contentToRender}
    </Page>
  );
};

export default OrdersList;
