import {
  EmptySearchResult,
  IndexFilters,
  IndexFiltersMode,
  IndexTable,
  Text,
  TextField,
  useSetIndexFiltersMode,
} from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import Paginator from '../UI/Paginator';
import usePagination from '../../hooks/usePagination';

const emptyStateMarkup = (
  <EmptySearchResult
    title="No orders yet"
    description="Try changing the filters or search term"
    withIllustration
  />
);

const tableHeadings = [
  { title: 'Image' },
  { title: 'SKU' },
  { title: 'Title' },
  { title: 'On Hand' },
  { title: 'Incoming Inventory' },
  { title: 'Net Inventory' },
  { title: 'Pending Orders' },
];

const sortOptions = [
  { label: 'Title', value: 'title asc', directionLabel: 'A-Z' },
  { label: 'Title', value: 'title desc', directionLabel: 'Z-A' },
  { label: 'On Hand', value: 'onhand asc', directionLabel: 'Ascending' },
  { label: 'On Hand', value: 'onhand desc', directionLabel: 'Descending' },
];
const filters = [];
const appliedFilters = [];

const resourceName = {
  singular: 'Inventory Item',
  plural: 'Inventory Items',
};

export default function InventoryList({
  isLoadingState,
  products,
  allResourcesSelected,
  selectedResources,
  handleSelectionChange,
  handleOnHandChange,
  removeSelectedResources,
  appSettingsData,
}) {
  console.log(appSettingsData);
  const reorderLevel = appSettingsData?.settings?.reorderLevel || 0;
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const [sortSelected, setSortSelected] = useState(['title asc']);
  const [queryValue, setQueryValue] = useState('');
  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const onHandleCancel = () => {};
  const [selected, setSelected] = useState(0);

  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, []);
  const filterSearchedItems = useCallback(
    (data) => {
      if (queryValue === '') return data;
      return (
        data?.sku?.toLowerCase().includes(queryValue) ||
        data?.title?.toLowerCase().includes(queryValue)
      );
    },
    [queryValue]
  );
  console.log(sortSelected);
  const sortInventoryItems = useCallback((a, b) => {
    if (sortSelected[0] === 'title asc') return a.title.localeCompare(b.title);
    if (sortSelected[0] === 'title desc') return b.title.localeCompare(a.title);
    if (sortSelected[0] === 'onhand asc') return a.onHand - b.onHand;
    if (sortSelected[0] === 'onhand desc') return b.onHand - a.onHand;
  });

  // pagination settings
  const itemsPerPage = 20;
  const {
    currentItems: currentProducts,
    handlePageClick,
    pageCount,
    itemOffset,
  } = usePagination(
    products.filter(filterSearchedItems).sort(sortInventoryItems),
    itemsPerPage
  );

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
    removeSelectedResources(selectedResources);
    () => {};
  }, [itemOffset]);

  return (
    <>
      {' '}
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Searching from all inventory items"
        onQueryChange={handleQueryValueChange}
        hideFilters
        onQueryClear={() => {}}
        onSort={setSortSelected}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={[]}
        filters={filters}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView={false}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        resourceName={resourceName}
        loading={isLoadingState}
        itemCount={products.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={tableHeadings}
        emptyStateMarkup={emptyStateMarkup}
        hasMoreItems
      >
        {currentProducts
          .filter(filterSearchedItems)
          .sort(sortInventoryItems)
          .map((product, index) => (
            <IndexTable.Row
              id={product.id}
              key={product.id}
              selected={selectedResources.includes(product.id)}
              position={index}
              status={product.onHand <= reorderLevel ? 'critical' : ''}
            >
              <IndexTable.Cell>
                <img
                  src={product.imageUrl}
                  alt={product.sku}
                  style={{ width: '40px', height: '40px' }}
                />
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                  {product.sku || 'NA'}
                </Text>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                  {product.title}
                </Text>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <div onClick={(e) => e.stopPropagation()}>
                  <TextField
                    type="number"
                    value={product.onHand}
                    onChange={(value) => {
                      handleOnHandChange(product, value);
                    }}
                  />
                </div>
              </IndexTable.Cell>
              <IndexTable.Cell>{product.incomingInventory}</IndexTable.Cell>
              <IndexTable.Cell>{product.netInventory}</IndexTable.Cell>
              <IndexTable.Cell>{product.pendingOrders}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
      </IndexTable>
      {products.length !== 0 ? (
        <Paginator pageCount={pageCount} handlePageClick={handlePageClick} />
      ) : null}
    </>
  );
}
