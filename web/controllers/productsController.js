import Product from "../models/product.js"
import Order from "../models/order.js"
import ShopData from "../models/shopData.js"
import shopify from "../shopify.js"
import AppSettings from "../models/appSettings.js"

import Sequelize from 'sequelize';

export const getProducts = async (req, res) => {
    const shopDomain = res.locals.shopify.session.shop;

    // Fetch trackingEnabled from AppSettings
    const appSettingsResult = await AppSettings.findOne({
        where: { shopDomain },
        attributes: ['startDate', 'trackingEnabled'],
        raw: true
    });

    const trackingEnabled = appSettingsResult ? appSettingsResult.trackingEnabled : false;

    // Fetch products from Shopify API
    const shopifyProducts = await shopify.api.rest.Product.all({
        session: res.locals.shopify.session,
    });

    console.log("Fetched products from shopify: " + shopifyProducts);

    // Fetch OnHand values for all SKUs from your Product table
    const localProducts = await Product.findAll({
        where: { shopDomain },
        attributes: ['sku', 'OnHand', 'productId'],
        raw: true
    });

    // Fetch lastSaleProcessed from ShopData
    const shopDataResult = await ShopData.findOne({
        where: { shopDomain },
        attributes: ['lastSaleProcessed'],
        raw: true
    });

    console.log("shopData lastSaleProcessed date: ", shopDataResult);

    let orderFetchDate;

    if (shopDataResult && shopDataResult.lastSaleProcessed) {
        orderFetchDate = shopDataResult.lastSaleProcessed;
    } else {
        // Fetch startDate from AppSettings if lastSaleProcessed does not exist
        const appSettingsResult = await AppSettings.findOne({
            where: { shopDomain },
            attributes: ['startDate'],
            raw: true
        });
        if (appSettingsResult) {
            orderFetchDate = appSettingsResult.startDate;
        }
        console.log("no date found in lastSaleProcessed, fetched from appSettings: ", appSettingsResult);
    }

    // Use orderFetchDate for the updated_at_min filter when fetching Shopify orders
    const orderFilters = {
        session: res.locals.shopify.session,
        status: "open",
        fulfillment_status: 'unfulfilled',
        updated_at_min: orderFetchDate.toISOString()
    };

    const pendingOrderQuantities = {};
    const cancelledOrderQuantities = {};

    if (trackingEnabled) {
        // Fetch Pending Orders from Shopify
        const pendingOrders = await shopify.api.rest.Order.all(orderFilters);

        pendingOrders.data.forEach(order => {
            order.line_items.forEach(item => {
                if (pendingOrderQuantities[item.sku]) {
                    pendingOrderQuantities[item.sku] += item.quantity;
                } else {
                    pendingOrderQuantities[item.sku] = item.quantity;
                }
            });
        });

        const cancelledOrderFilters = {
            ...orderFilters,
            status: "cancelled",
        };
        
        const cancelledOrders = await shopify.api.rest.Order.all(cancelledOrderFilters);

        cancelledOrders.data.forEach(order => {
            order.line_items.forEach(item => {
                if (cancelledOrderQuantities[item.sku]) {
                    cancelledOrderQuantities[item.sku] += item.quantity;
                } else {
                    cancelledOrderQuantities[item.sku] = item.quantity;
                }
            });
        });

        const allOrders = [...pendingOrders.data, ...cancelledOrders.data];
        const latestUpdatedAt = allOrders.reduce((latest, order) => {
            const orderDate = new Date(order.updated_at);
            return orderDate > latest ? orderDate : latest;
        }, new Date(0));

        await ShopData.upsert({
            shopDomain: shopDomain,
            lastSaleProcessed: latestUpdatedAt
        });
    }

    // Calculate Incoming Inventory
    const incomingInventoryList = await Order.findAll({
        where: { 
            shopDomain, 
            orderStatus: "shipped" 
        },
        attributes: ['sku', [Sequelize.fn('SUM', Sequelize.col('orderAmount')), 'totalIncoming']],
        group: ['sku'],
        raw: true
    });

    const combinedProducts = shopifyProducts.data.map(product => {
        return product.variants.map(variant => {
            const localProduct = localProducts.find(lp => lp.sku === variant.sku || lp.productId === product.id);
            const onHand = (localProduct ? localProduct.OnHand : 0) + (cancelledOrderQuantities[variant.sku] || 0);
    
            const incomingInventory = incomingInventoryList.find(ii => ii.sku === variant.sku);
            const incoming = incomingInventory ? incomingInventory.totalIncoming : 0;
    
            const pending = pendingOrderQuantities[variant.sku] || 0;

            const variantImage = product.images.find(img => img.id === variant.image_id);
    
            return {
                id: variant.id,
                sku: variant.sku,
                onHand: onHand,
                incomingInventory: incoming,
                pendingOrders: pending,
                netInventory: onHand + incoming - pending,
                imageUrl: variantImage ? variantImage.src : null
            };
        });
    }).flat();

    res.status(200).send(combinedProducts);
}

export const updateProducts = async (req, res) => {
    try {
      const shopDomain = res.locals.shopify.session.shop;
  
      await Promise.all(req.body.map(async product => {
        const { sku, onHand } = product;
  
        const [dbProduct, created] = await Product.findOrCreate({
          where: { sku, shopDomain },
          defaults: {
            sku,
            onHand,
            shopDomain,
          }
        });
  
        if (!created) {
          dbProduct.onHand = onHand;
          await dbProduct.save();
        }
      }));
  
      res.status(200).json({ message: 'Products updated successfully' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  