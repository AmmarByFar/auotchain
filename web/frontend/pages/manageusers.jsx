import {
  Page,
  IndexTable,
  Avatar,
  Text,
  Card,
  Modal,
  TextField,
  Select,
  useIndexResourceState,
} from '@shopify/polaris';
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from '../hooks';
import { EditMajor, DeleteMinor } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(users);

  const fetch = useAuthenticatedFetch();

  // State for modal visibility and form data
  const [modalActive, setModalActive] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const openModal = useCallback(() => setModalActive(true), []);
  const closeModal = useCallback(() => setModalActive(false), []);

  const handleNameChange = useCallback((value) => setName(value), []);
  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const handleRoleChange = useCallback((value) => setRole(value), []);

    // Handle user creation using the form data and make a POST request
    const handleCreateUser = useCallback(async () => {
      const userData = {
        username: name,
        email: email,
        userRole: role,
      };
  
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log(data.message);
          fetchUsers();
          closeModal();
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to create user:', error);
      }
    }, [name, email, role]);
  
    // Factored out the fetching logic to make it reusable after creating a user
    const fetchUsers = useCallback(() => {
      fetch('/api/users')
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error('Error fetching users:', error));
    }, []);
  
    useEffect(() => {
      fetchUsers();
    }, []);

  const resourceName = {
    singular: 'user',
    plural: 'users',
  };

  const rowMarkup = users.map(({ id, UserName, UserRole, Email }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Avatar
          name={UserName}
          initials={UserName ? UserName.slice(0, 2).toUpperCase() : ''}
          initialsCount={2}
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variation="strong">{UserName}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{UserRole}</IndexTable.Cell>
      <IndexTable.Cell>{Email}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  const secondaryActionsEnabled = selectedResources.length > 0;

  const userRoleOptions = [
    { label: '', value: '' },
    { label: 'Supplier', value: 'Supplier' },
    { label: 'Warehouse Manager', value: 'Warehouse Manager' },
  ];

  return (
    <Page
      title="Inventory Personnel"
      primaryAction={{
        content: 'Add User',
        onAction: openModal,
      }}
      secondaryActions={[
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
      <Modal
        open={modalActive}
        onClose={closeModal}
        title="Create New User"
        primaryAction={{
          content: 'Create',
          onAction: handleCreateUser, 
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: closeModal,
          },
        ]}
      >
        <Modal.Section>
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            autoComplete="off"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="off"
          />
          <Select
            label="Role"
            options={userRoleOptions}
            onChange={handleRoleChange}
            value={role}
          />
        </Modal.Section>
      </Modal>
      <Card padding={0}>
        <IndexTable
          resourceName={resourceName}
          itemCount={users.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Avatar' },
            { title: 'Name' },
            { title: 'User Role' },
            { title: 'Email' },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );
}