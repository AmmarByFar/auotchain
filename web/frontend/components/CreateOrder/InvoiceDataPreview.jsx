import { Card, LegacyStack, List, Thumbnail,Text } from "@shopify/polaris";
import { NoteMinor } from "@shopify/polaris-icons";
const validFileTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'application/pdf',
];
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
                (validFileTypes.includes(file.type) && file.type !== 'application/pdf')
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
export default function InvoiceDataPreview({ orderData = {} }) {
  return orderData.invoices.map((invoice) => {
    return (
      <div
        key={invoice.invoiceNumber}
        style={{
          margin: '7px 0',
          border: '1px solid grey',
          borderRadius: '5px',
        }}
      >
        <Card padding={3}>
          <List>
            <List.Item>Total Cost: {invoice.totalCost}</List.Item>
            <List.Item>
              Invoice Date: {new Date(invoice.date).toLocaleDateString()}
            </List.Item>
            <List.Item>
              Invoice Files: {uploadedFiles(invoice.filePaths)}
            </List.Item>
          </List>
        </Card>
      </div>
    );
  });
}
