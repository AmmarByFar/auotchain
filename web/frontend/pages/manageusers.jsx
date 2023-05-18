import { Page, Card, IndexTable, Avatar, TextStyle } from "@shopify/polaris";
import { useState, useCallback } from "react";

// Data fetch would be done in real application
const users = [
  { id: '1', username: 'user1', shopDomain: 'domain1', userRole: 'Supplier' },
  { id: '2', username: 'user2', shopDomain: 'domain2', userRole: 'Warehouse Manager' },
  // ...
];

export default function UserManagement() {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectionChange = useCallback(
    (selected) => setSelectedItems(selected),
    []
  );

  const resourceName = {
    singular: 'user',
    plural: 'users',
  };

  const rowMarkup = users.map(
    ({ id, username, shopDomain, userRole }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedItems.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Avatar name={username} initialsCount={2} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextStyle variation="strong">{username}</TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>{shopDomain}</IndexTable.Cell>
        <IndexTable.Cell>{userRole}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page
      title="User Management"
      primaryAction={{ content: "Add User", onAction: () => { /* Handle add user action */ } }}
    >
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={users.length}
          selectedItemsCount={
            selectedItems.length === users.length
              ? "All"
              : selectedItems.length
          }
          onSelectionChange={handleSelectionChange}q
          headings={[
            { title: "Avatar" },
            { title: "Username" },
            { title: "Shop Domain" },
            { title: "User Role" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );
}