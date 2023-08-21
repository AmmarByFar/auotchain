import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/inventory.css';
import {
  Page,
  IndexTable,
  Text,
  useIndexResourceState,
  Card,
  EmptySearchResult,
  TextField,
} from '@shopify/polaris';
import { ChecklistMajor, EditMinor } from '@shopify/polaris-icons';
import { useToast } from '@shopify/app-bridge-react';
import { useAppQuery, useAuthenticatedFetch } from '../hooks';
import usePagination from '../hooks/usePagination';
import Paginator from '../components/UI/Paginator';
import ContextualSaveBar from '../components/UI/ContextualSaveBar';

const isEqual = (object1, object2) =>
  JSON.stringify(object1) === JSON.stringify(object2);

const tableHeadings = [
  { title: 'Image' },
  { title: 'SKU' },
  { title: 'Title' },
  { title: 'On Hand' },
  { title: 'Incoming Inventory' },
  { title: 'Net Inventory' },
  { title: 'Pending Orders' },
];

function ProductsList() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [isProductsDataChanged, setIsProductsDataChanged] = useState(false);

  const [prdouctsOnEdit, setPrdouctsOnEdit] = useState([]);

  const { show: showToast } = useToast();
  const {
    isLoading,
    isFetching,
    data,
    refetch: refetchProducts,
  } = useAppQuery({
    url: '/api/products',
    reactQueryOptions: {
      queryKey: 'products',
      onSuccess: (result) => {
        const clone1 = structuredClone(result);
        const clone2 = structuredClone(result);
        setProducts(clone1);
        setOriginalProducts(clone2);
      },
    },
  });

  useEffect(() => {
    const isSameData = isEqual(products, originalProducts);
    if (isSameData) {
      setPrdouctsOnEdit([]);
    }
    setIsProductsDataChanged(!isSameData);
  }, [products]);

  const isLoadingState = isLoading || isFetching;
  const fetch = useAuthenticatedFetch();

  // pagination settings
  const itemsPerPage = 20;
  const {
    currentItems: currentProducts,
    handlePageClick,
    pageCount,
    itemOffset,
  } = usePagination(products, itemsPerPage);

  // index table utilites
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    removeSelectedResources,
  } = useIndexResourceState(products);
  const secondaryActionsEnabled = selectedResources.length > 0;

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
    removeSelectedResources(selectedResources);
    () => {};
  }, [itemOffset]);
  const handleDiscardAction = () => {
    setProducts(structuredClone(originalProducts));
    setPrdouctsOnEdit([]);
  };

  // Handler to update OnHand value locally
  const handleOnHandChange = useCallback(
    (product, value) => {
      if (!prdouctsOnEdit.includes(product.id)) {
        setPrdouctsOnEdit((prev) => [...prev, product.id]);
      }
      const productsCopy = structuredClone(products);
      const upadateProductsOnHand = (p) => {
        const productCopy = structuredClone(p);
        if (p.id === product.id) {
          productCopy.onHand = Number(value);
        }
        return productCopy;
      };
      const updatedProducts = productsCopy.map(upadateProductsOnHand);
      setProducts(updatedProducts);
    },
    [products]
  );

  // Handler to save the edited OnHand value to the backend
  const saveOnHand = () => {
    const productsToUpdate = prdouctsOnEdit.map((pId) => {
      const product = products.find((p) => p.id === pId);
      return {
        onHand: product.onHand,
        sku: product.sku,
      };
    });
    setIsSaving(true);
    // Send POST request to save the new value
    fetch('/api/products/updateOnHand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productsToUpdate), // can be one or more sku to update
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save OnHand value');
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful save, perhaps show a success notification
        setIsSaving(false);
        showToast('Saved Successfully');
      })
      .catch((error) => {
        console.error('Error saving OnHand value:', error);
        setIsSaving(false);
        refetchProducts();
        showToast('Failed to save OnHand value');
      });
  };

  const emptyStateMarkup = (
    <EmptySearchResult
      title="No orders yet"
      description="Try changing the filters or search term"
      withIllustration
    />
  );

  return (
    <Page
      fullWidth
      title="Inventory Levels"
      primaryAction={{
        content: 'New Purchase Order',
        onAction: () => {
          navigate('/createorder', {
            state: {
              selectedProducts: products.filter((p) =>
                selectedResources.includes(p.id)
              ),
              previousPath: '/inventory',
            },
          });
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
          content: 'Edit',
          icon: EditMinor,
          accessibilityLabel: 'Secondary action label',
          onAction: () => alert('Edit action'),
          disabled: !secondaryActionsEnabled,
        },
      ]}
    >
      <Card padding={1}>
        <IndexTable
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
          {currentProducts.map((product, index) => (
            <IndexTable.Row
              id={product.id}
              key={product.id}
              selected={selectedResources.includes(product.id)}
              position={index}
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
        {isProductsDataChanged && (
          <ContextualSaveBar
            loading={isSaving}
            onAction={saveOnHand}
            disCardAction={handleDiscardAction}
          />
        )}
      </Card>
    </Page>
  );
}

export default ProductsList;
