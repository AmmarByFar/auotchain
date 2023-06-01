import { DeliveryMethod } from "@shopify/shopify-api";
import verifyWebhook from './utils/verifyWebhook.js';
import shopify from './shopify.js';
import AppSettings from './models/appSettings.js';
import { getSessionFromStorage } from './utils/sessionStorage.js'; // Import getSessionFromStorage

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks/orders/create",
    callback: async (topic, domain, body, webhookId) => {
      console.log('received webhook: orders/create');
      
      // Verify webhook signature
      const hmacHeader = req.get('X-Shopify-Hmac-SHA256');
      if (!verifyWebhook(body.toString(), hmacHeader)) {
        console.error('Failed to verify webhook signature');
        return;
      }

      console.log('hmac verified');

      try {
        const sessionId = shopify.session.getOfflineId({shop: domain});
        const session = await getSessionFromStorage(sessionId);

        const order = JSON.parse(body);
        console.log("orders/create webhook called!");
        const lineItems = order.line_items;

        // Loop through lineItems to get product details and quantity
        for (let item of lineItems) {
          const productId = item.product_id;
          const variantId = item.variant_id;
          const quantity = item.quantity;

          // Fetch product details
          const product = await shopify.api.rest.Product.find({
            session: session,
            id: productId,
          });

          // Fetch inventory level of the variant
          const inventoryLevel = await shopify.api.rest.InventoryLevel.all({
            session: session,
            inventory_item_id: variantId,
          });

          if(product != null && inventoryLevel != null){
            console.log(`Product: ${product.title}, Quantity Ordered: ${quantity}, Inventory Level: ${inventoryLevel.data[0].available}`);
            try {
              const appSettings = await AppSettings.findOne({
                where: {
                  shopDomain: domain,
                },
              });
        
              if (!appSettings) {
                console.log("no appSettings found!");
              } else {
                console.log("Shop's confiugured reorder level: " + appSettings.reorderLevel);
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      } catch (error) {
        console.error('Failed at orders/create webhook', error);
      }
    },
  },
};