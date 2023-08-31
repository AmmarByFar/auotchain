import { Card, LegacyStack, List, Text, Thumbnail } from "@shopify/polaris";
import { NoteMinor } from "@shopify/polaris-icons";
const uploadedFiles = (files) =>
  files.length > 0 && (
    <div style={{ padding: '0' }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validFileTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteMinor
              }
            />
            <div>
              {file.name}{' '}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );
export default function OrderDataPreview({ orderData = {} }) {
  
  return orderData.shipments?.map((shipment) => {
    return (
      <div
        key={shipment.tracking}
        style={{
          margin: '7px 0',
          border: '1px solid grey',
          borderRadius: '5px',
        }}
      >
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
  });
}
