import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  Badge,
  IndexFiltersMode,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

const orderBadges = {
  Created: 'enabled-experimental',
  Delivered: 'success',
  Pending: 'incomplete',
  Shipped: 'attention',
};
const sortOptions = [
  { label: 'Order', value: 'order asc', directionLabel: 'A-Z' },
  { label: 'Order', value: 'order desc', directionLabel: 'Z-A' },
  { label: 'Date', value: 'date asc', directionLabel: 'Ascending' },
  { label: 'Date', value: 'date desc', directionLabel: 'Descending' },
  { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
  { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
];
const filters = [];
const appliedFilters = [];

const resourceName = {
  singular: 'order',
  plural: 'orders',
};

export default function OrdersComponent({ orders }) {
  const [itemStrings, setItemStrings] = useState([
    'All',
    'Created',
    'Delivered',
    'Pending',
    'Shipped',
  ]);
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: (value) => {
      console.log('tab action', item, index);
    },
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions: index === 0 ? [] : [],
  }));
  const [selected, setSelected] = useState(0);
  const [sortSelected, setSortSelected] = useState(['order asc']);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const onHandleCancel = () => {};

  const [queryValue, setQueryValue] = useState('');
  const filterOrders = useCallback((order) => {
    if (selected === 0) return order;
    if (selected === 1) return order.orderStatus === 'Created';
    if (selected === 2) return order.orderStatus === 'Delivered';
    if (selected === 3) return order.orderStatus === 'Pending';
    if (selected === 4) return order.orderStatus === 'Shipped';
  });
  const filterSearchedOrders = useCallback(
    (data) => {
      if (queryValue === '') return data;
      return (
        data.id.toString().includes(queryValue) ||
        data.orderCost?.toString().includes(queryValue) ||
        data.orderDate?.toString().includes(queryValue) ||
        data.orderNotes?.toString().includes(queryValue) ||
        data.orderStatus?.toString().includes(queryValue) ||
        data.Supplier?.username?.toString().includes(queryValue) ||
        data.WarehouseManager?.username?.toString().includes(queryValue)
      );
    },
    [queryValue]
  );
  const sortOrders = useCallback(
    (a, b) => {
      if (sortSelected[0] === 'order asc') return a.id - b.id;
      if (sortSelected[0] === 'order desc') return b.id - a.id;
      if (sortSelected[0] === 'date asc')
        return new Date(a.orderDate) - new Date(b.orderDate);
      if (sortSelected[0] === 'date desc')
        return new Date(b.orderDate) - new Date(a.orderDate);
      if (sortSelected[0] === 'total asc') return a.orderCost - b.orderCost;
      if (sortSelected[0] === 'total desc') return b.orderCost - a.orderCost;
    },
    [sortSelected]
  );

  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, []);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders
    .filter(filterSearchedOrders)
    .filter(filterOrders)
    .sort(sortOrders)
    .map((order, index) => (
      <IndexTable.Row
        id={order.id}
        key={order.id}
        selected={selectedResources.includes(order.id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {order.id}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{order.orderAmount}</IndexTable.Cell>
        <IndexTable.Cell>${Number(order.orderCost).toFixed(2)}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge status={orderBadges[order.orderStatus]}>
            {order.orderStatus}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {new Date(order.orderDate).toLocaleDateString()}
        </IndexTable.Cell>
        <IndexTable.Cell>{order.Supplier.username}</IndexTable.Cell>
        <IndexTable.Cell>{order.WarehouseManager.username}</IndexTable.Cell>
        <IndexTable.Cell>{order.orderNotes}</IndexTable.Cell>
      </IndexTable.Row>
    ));

  return (
    <LegacyCard>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Searching from all orders"
        onQueryChange={handleQueryValueChange}
        hideFilters
        onQueryClear={() => {}}
        onSort={setSortSelected}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView={false}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        resourceName={resourceName}
        itemCount={
          orders
            .filter(filterSearchedOrders)
            .filter(filterOrders)
            .sort(sortOrders).length
        }
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Order ID' },
          { title: 'Unit Amount' },
          { title: 'Total Cost' },
          { title: 'Order Status' },
          { title: 'Order Date' },
          { title: 'Supplier' },
          { title: 'Warehouse Manager' },
          { title: 'Order Notes' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}
