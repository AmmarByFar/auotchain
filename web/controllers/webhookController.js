// Import necessary modules
import verifyWebhook from '../utils/verifyWebhook.js'; // Assuming you have a utility function for webhook verification
import shopify from '../shopify.js'; // Assuming this is your Shopify connection object
import AppSettings from '../models/appSettings.js'; // Assuming this is your AppSettings model

// Handle order creation webhook
export const handleOrderCreate = async (req, res) => {
  console.log('received webhook: orders/create');
  res.status(200).end();

  // Verify webhook signature
  const hmacHeader = req.get('X-Shopify-Hmac-SHA256');
  if (!verifyWebhook(req.body.toString(), hmacHeader)) {
    console.error('Failed to verify webhook signature');
    return;
  }

  console.log('hmac verified');

  try {
    const order = req.body;
    console.log("orders/create webhook called!");
    const lineItems = order.line_items;

    // Loop through lineItems to get product details and quantity
    for (let item of lineItems) {
      const productId = item.product_id;
      const variantId = item.variant_id;
      const quantity = item.quantity;

      // Fetch product details
      const product = await shopify.api.rest.Product.find({
        session: res.locals.shopify.session,
        id: productId,
      });

      // Fetch inventory level of the variant
      const inventoryLevel = await shopify.api.rest.InventoryLevel.all({
        session: res.locals.shopify.session,
        inventory_item_id: variantId,
      });

      if(product != null && inventoryLevel != null){
        console.log(`Product: ${product.title}, Quantity Ordered: ${quantity}, Inventory Level: ${inventoryLevel.data[0].available}`);
        try {
          const appSettings = await AppSettings.findOne({
            where: {
              shopDomain: res.locals.shopify.shop,
            },
          });
    
          if (!appSettings) {
            console.log("no appSettings found!");
          } else {
            console.log("Shop's confiugured reorder level: " + appSettings.reorderLevel);
          }
        } catch (err) {
          console.error(err);
          res.status(500).send('An error occurred');
        }
      }
    }
  } catch (error) {
    console.error('Failed at orders/create webhook', error);
  }
};