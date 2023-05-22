// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import appwebhooks from "./appwebhooks.js";
import { setUncaughtExceptionCaptureCallback } from "process";

import db from './config/database.js';
import User from './models/user.js';
import Order from "./models/order.js";
import AppSettings from "./models/appSettings.js"


// TODO: REMOVE alter:true FROM BELOW BEFORE PUSHING TO PRODUCTION
db.sync(/*{ alter: true }*/)
  .then(() => console.log("All models were synchronized successfully."))
  .catch((error) => console.log("An error occurred:", error));

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),async (req, res, next) => {
    // try {
    //   // Create the webhook
    //   const webhook = new shopify.api.rest.Webhook({session: res.locals.shopify.session});
    //   webhook.address = "https://stats-mariah-trails-creating.trycloudflare.com/api/webhooks/orders/create"; // replace with your endpoint
    //   webhook.topic = "orders/create"; // change the topic to 'orders/create'
    //   webhook.format = "json";
    //   await webhook.save({
    //     update: true,
    //   });

    //   next();
    // } catch (error) {
    //   console.log(`Failed to create webhook: ${error.message}`);
    //   next(error);
    // }
  },
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: {...GDPRWebhookHandlers, ...appwebhooks} })
);

// app.post('/api/webhooks/orders/create', async (req, res) => {
//   res.status(200).end();
//   try{
//     const order = req.body;
//     console.log("orders/create webhook called!");
//     console.log("req object: " + req);
//     console.log("res object: " + res);
//     const lineItems = order.line_items;
  
//     // Loop through lineItems to get product details and quantity
//     for (let item of lineItems) {
//       const productId = item.product_id;
//       const variantId = item.variant_id;
//       const quantity = item.quantity;
  
//       // Fetch product details
//       const product = await shopify.api.rest.Product.find({
//         session: res.locals.shopify.session,
//         id: productId,
//       });
  
//       // Fetch inventory level of the variant
//       const inventoryLevel = await shopify.api.rest.InventoryLevel.all({
//         session: res.locals.shopify.session,
//         inventory_item_id: variantId,
//       });
  
//       if(product != null && inventoryLevel != null){
//         console.log(`Product: ${product.title}, Quantity Ordered: ${quantity}, Inventory Level: ${inventoryLevel.data[0].available}`);
//         try {
//           const appSettings = await AppSettings.findOne({
//             where: {
//               shopDomain: res.locals.shopify.shop,
//             },
//           });
      
//           if (!appSettings) {
//             console.log("no appSettings found!");
//           } else {
//             console.log("Shop's confiugured reorder level: " + appSettings.reorderLevel);
//           }
//         } catch (err) {
//           console.error(err);
//           res.status(500).send('An error occurred');
//         }
//       }
//     }
//   }
//   catch (error) {
//     console.error('Failed at orders/create webhook', error);
//   }
  
// });

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

app.post('/api/users', async (req, res) => {
  const { username, shopDomain, userRole } = req.body;
  try {
    const tempPassword = generateTempPassword(); 
    const user = await User.create({
      username,
      password: tempPassword,
      shopDomain,
      userRole
    });

    // TODO: Send an email to the new user with instructions to change their password

    res.status(201).json({
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Failed to create user', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users', async (_req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    console.log(shopDomain);
    const users = await User.findAll({
      where: { shopDomain },
      attributes: ['id', 'UserName', 'UserRole', 'Email'],
    });
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.get('/api/appsettings', async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    let settings = await AppSettings.findOne({ where: { shopDomain } });
    if(settings) {
      res.json({ message: 'Settings retrieved successfully!', settings });
    } else {
      res.status(404).json({ message: 'No settings found for this shopDomain' });
    }  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/appsettings', async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    const { reorderLevel, reorderAmount } = req.body;

    // Find existing settings for this shopDomain
    let settings = await AppSettings.findOne({ where: { shopDomain } });

    if(settings) {
      // If settings already exist, update them
      settings.reorderLevel = reorderLevel;
      settings.reorderAmount = reorderAmount;
      await settings.save();
    } else {
      // If no settings exist yet, create new ones
      settings = await AppSettings.create({ shopDomain, reorderLevel, reorderAmount });
    }

    res.json({ message: 'Settings saved successfully!', settings });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/orders', async (_req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop
    console.log(shopDomain);
    const orders = await Order.findAll({
      attributes: [
        'productID',
        'SKU',
        'orderAmount',
        'orderStatus',
        'orderDate',
        'deliveryDate',
        'deliveryTracking',
        'deliveryNotes'
      ],
      include: [
        { 
          model: User,
          as: 'Supplier', 
          attributes: ['username']
        },
        {
          model: User,
          as: 'WarehouseManager',
          attributes: ['username']
        }
      ],
      where: { shopDomain }
    });
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
