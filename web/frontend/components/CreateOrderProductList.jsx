import {
  HorizontalStack,
  Thumbnail,
  Text,
  TextField,
  Button,
  Icon,
} from '@shopify/polaris';
import { CancelMinor } from '@shopify/polaris-icons';

const CreateOrderProductList = ({ products, setProducts }) => {
  const handleOrderAmountChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].orderAmount = value;
    setProducts(newProducts);
  };

  const handleRemoveProduct = (id) => {
    console.log('removing,', id);
    const newProducts = [...products].filter((p) => p.id !== id);
    setProducts(newProducts);
  };
  return (
    <div>
      {products.map((product, index) => (
        <HorizontalStack
          wrap={false}
          gap='4'
          align='space-between'
          blockAlign='center'
        >
          <div
            style={{
              width: '100px',
            }}
          >
            <Thumbnail
              source={product.imageUrl}
              alt={`Product ${product.sku}`}
              size='medium'
              transparent={true}
            />
          </div>
          <div style={{ width: '200px' }}>
            <Text variant='bodyMd' as='h3'>
              {product.title}
            </Text>
            <Text variant='headingXs' as='h6'>
              {`SKU: ${product.sku}`}
            </Text>
          </div>
          <TextField
            placeholder='Order Amount'
            type='number'
            value={product.orderAmount}
            onChange={(value) => handleOrderAmountChange(index, value)}
          />
          <Button
            destructive
            onClick={() => {
              console.log('remove product');
              handleRemoveProduct(product.id);
            }}
          >
            <Icon source={CancelMinor} color='critical' />
          </Button>
        </HorizontalStack>
      ))}
    </div>
  );
};

export default CreateOrderProductList;
