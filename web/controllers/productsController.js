import Product from "../models/product.js"
import Order from "../models/order.js"
import shopify from "../shopify.js"

import Sequelize from 'sequelize';

export const getProducts = async (req, res) => {
    // 1. Fetch products from Shopify API
    const shopifyProducts = await shopify.api.rest.Product.all({
        session: res.locals.shopify.session,
    });

    console.log("Fetched products from shopify: " + shopifyProducts)

    const shopDomain = res.locals.shopify.session.shop;

    // 2. Fetch OnHand values for all SKUs from your Product table
    const localProducts = await Product.findAll({
        where: { shopDomain },
        attributes: ['sku', 'OnHand', 'productId'],
        raw: true
    });

    console.log("Fetched products from sql: " + localProducts)

    // 3. Calculate Incoming Inventory
    const incomingInventoryList = await Order.findAll({
        where: { 
            shopDomain, 
            orderStatus: "shipped" 
        },
        attributes: ['sku', [Sequelize.fn('SUM', Sequelize.col('orderAmount')), 'totalIncoming']],
        group: ['sku'],
        raw: true
    });

    // 4. Fetch Pending Orders from Shopify
    const pendingOrders = await shopify.rest.Order.all({
        session: res.locals.shopify.session,
        status: "open",
    });
    const pendingOrderQuantities = {}; // Use a hash map to store and sum up quantities by SKU
    pendingOrders.forEach(order => {
        order.line_items.forEach(item => {
            if (pendingOrderQuantities[item.sku]) {
                pendingOrderQuantities[item.sku] += item.quantity;
            } else {
                pendingOrderQuantities[item.sku] = item.quantity;
            }
        });
    });

    const combinedProducts = shopifyProducts.map(product => {
        return product.variants.map(variant => {
            const localProduct = localProducts.find(lp => lp.sku === variant.sku || lp.productId === product.id);
            const onHand = localProduct ? localProduct.OnHand : 0;

            const incomingInventory = incomingInventoryList.find(ii => ii.sku === variant.sku);
            const incoming = incomingInventory ? incomingInventory.totalIncoming : 0;

            const pending = pendingOrderQuantities[variant.sku] || 0;

            return {
                title: product.title,
                sku: variant.sku,
                onHand: onHand,
                incomingInventory: incoming,
                pendingOrders: pending,
                netInventory: onHand + incoming - pending
            };
        });
    }).flat();

    res.status(200).send(combinedProducts);
}

export const updateProduct = async (req, res) => {

}