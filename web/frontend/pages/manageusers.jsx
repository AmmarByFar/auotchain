import { Page, Card, IndexTable, Avatar, TextStyle, AlphaCard, useIndexResourceState } from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { EditMajor, DeleteMinor } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(users);

  const fetch = useAuthenticatedFetch();

  // Fetch users from the API
  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);  // The empty array means this effect will only run once, after the first render

  const resourceName = {
    singular: 'user',
    plural: 'users',
  };

  const rowMarkup = users.map(
    ({ id, UserName, UserRole }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Avatar name={UserName} initials={UserName ? UserName.slice(0, 2).toUpperCase() : ''} initialsCount={2} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextStyle variation="strong">{UserName}</TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>{UserRole}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const secondaryActionsEnabled = selectedResources.length > 0;
  const navigate = useNavigate();

  return (
    <Page
      title="Inventory Personnel"
      primaryAction={{ content: "Create User", onAction: () => { navigate("/createuser") } }}
      secondaryActions={[
        {
          content: "Edit",
          icon: EditMajor,
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
          disabled: !secondaryActionsEnabled
        },
        {
          content: "Delete",
          icon: DeleteMinor,
          destructive: true,
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Delete action"),
          disabled: !secondaryActionsEnabled
        },
      ]}
    >
      <AlphaCard padding={0}>
        <IndexTable
          resourceName={resourceName}
          itemCount={users.length}
          selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Avatar" },
            { title: "Username" },
            { title: "User Role" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </AlphaCard>
    </Page>
  );
}