// @ts-check
import 'dotenv/config'
import { join } from "path";
import { readFileSync } from "fs";
import { setUncaughtExceptionCaptureCallback } from "process";

import express from "express";
import serveStatic from "serve-static";
import bodyParser from "body-parser";

import db from './config/database.js';
import User from './models/user.js';
import Order from "./models/order.js";
import AppSettings from "./models/appSettings.js"

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import ordersWebhook from "./ordersWebhook.js";

import * as userController from './controllers/userController.js';
import { handleOrderCreate } from './controllers/webhookController.js';
import { getSettings, postSettings } from './controllers/settingsController.js';

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
    //   webhook.address = "https://echo-sight-trash-syndrome.trycloudflare.com/webhooks/orders/create"; // replace with your endpoint
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

    try {
      const webhooksResponse  = await shopify.api.rest.Webhook.all({session: res.locals.shopify.session});

      if (webhooksResponse.data) {
        webhooksResponse.data.forEach(webhook => {
        console.log(webhook);
        });
      }

    } catch (error) {
      console.log(`Failed to retrieve webhooks: ${error.message}`);
      next(error);
    }

  },
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: {...GDPRWebhookHandlers, ...ordersWebhook} })
);

const rawBodyParser = bodyParser.raw({type: 'application/json'});

//app.post('/webhooks/orders/create', rawBodyParser, handleOrderCreate);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.post('/api/users', userController.createUser);

app.get('/api/users', userController.getUsers);

app.get('/api/appsettings', getSettings);

app.post('/api/appsettings', postSettings);

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

app.get("/api/products/levels", async (_req, res) => {
  const countData = await shopify.api.rest.InventoryLevel.all({
    session: res.locals.shopify.session,
  });

// Fetch all SKUs

// Fetch all orders from start date - [SoldUnits]

// Fetch from MySQL PO and Inventory tables - [OnHand, DeliveredPO]

// 

// Get all orders


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
