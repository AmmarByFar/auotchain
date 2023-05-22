import { DeliveryMethod } from "@shopify/shopify-api";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/orders/create",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);

      console.log("ORDERS_CREATE Webhook recieved: " + payload);
      
      // Use findSessionsByShop() from shopify-app-session-storage-mysql to acquire sesion token
      // Get product thresholds and reorder amounts pertaining to shop from database
      
      // Use session token to make API call to Shopify to get inventory levels

      // Check inventory levels against product thresholds

      // If inventory levels are below product thresholds, create new order to supplier for reorder amount

    },
  },
};
