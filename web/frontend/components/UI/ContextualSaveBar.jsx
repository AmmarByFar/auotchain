import { Frame, ContextualSaveBar as ContextSave } from '@shopify/polaris';
import React from 'react';

export default function ContextualSaveBar({
  onAction,
  loading,
  disabled = false,
  disCardAction,
}) {
  return (
    <div style={{ height: '250px' }}>
      <Frame>
        <ContextSave
          fullWidth={true}
          alignContentFlush
          message="Unsaved changes"
          saveAction={{
            onAction: onAction,
            loading,
            disabled,
          }}
          discardAction={{
            onAction: disCardAction,
          }}
        />
      </Frame>
    </div>
  );
}
