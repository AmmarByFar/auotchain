import { Page, Card, IndexTable, Avatar, TextStyle } from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetch = useAuthenticatedFetch();

  // Fetch users from the API
  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);  // The empty array means this effect will only run once, after the first render

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
          onSelectionChange={handleSelectionChange}
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