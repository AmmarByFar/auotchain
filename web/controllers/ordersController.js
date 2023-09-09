import Order from "../models/order.js"
import OrderItem from "../models/orderItem.js";
import User from "../models/user.js"
import Invoice from "../models/invoice.js"
import Shipment from "../models/shipment.js"
import shopify from "../shopify.js"
import Sequelize from 'sequelize';
import db from '../config/database.js';

export const getOrders = async (req, res, next) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    const orders = await Order.findAll({
      attributes: [
        'id',
        [Sequelize.fn('SUM', Sequelize.col('OrderItems.quantity')), 'orderAmount'],
        [Sequelize.fn('SUM', Sequelize.col('Invoices.totalCost')), 'orderCost'],
        'orderDate',
        'orderNotes',
        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Shipments.status = "Delivered" THEN 1 ELSE 0 END')), 'deliveredCount'],
        [Sequelize.fn('COUNT', Sequelize.col('Shipments.id')), 'shipmentCount'],
        [
          Sequelize.literal(`
            CASE 
              WHEN SUM(CASE WHEN Shipments.status = "Delivered" THEN 1 ELSE 0 END) = 0 THEN "Created" 
              WHEN SUM(CASE WHEN Shipments.status = "Delivered" THEN 1 ELSE 0 END) = COUNT(Shipments.id) THEN "Delivered" 
              WHEN SUM(CASE WHEN Shipments.status = "Delivered" THEN 1 ELSE 0 END) < COUNT(Shipments.id) AND SUM(CASE WHEN Shipments.status = "Delivered" THEN 1 ELSE 0 END) > 0 THEN "Partially Delivered" 
              ELSE "Shipped" 
            END`),
          'orderStatus'
        ]
      ],
      include: [
        {
          model: User,
          as: 'Supplier',
          attributes: ['username'],
        },
        {
          model: User,
          as: 'WarehouseManager',
          attributes: ['username'],
        },
        {
          model: OrderItem,
          attributes: [],
          duplicating: false,
        },
        {
          model: Shipment,
          attributes: [],
          duplicating: false,
        },
        {
          model: Invoice,
          attributes: [],
          duplicating: false,
        }
      ],
      where: { shopDomain },
      group: ['Order.id', 'Supplier.id', 'WarehouseManager.id'],
    });
    console.log(JSON.stringify(orders, null, 2));

    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    next(error)
  }
};


export const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    // Fetch the order with associated models
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        { model: User, as: 'Supplier', attributes: ['username'], foreignKey: 'supplierID' },
        { model: User, as: 'WarehouseManager', attributes: ['username'], foreignKey: 'warehouseManagerID' },
        { model: OrderItem, attributes: ['productId', 'SKU', 'quantity'], foreignKey: 'orderID' },
        { model: Shipment, attributes: ['amount', 'tracking', 'status', 'notes'], foreignKey: 'orderID' },
        { model: Invoice, attributes: ['amount', 'date', 'filePath'], foreignKey: 'orderID' }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Extract productIds from order items
    const productIds = order.OrderItems.map(item => item.productId).join(',');
    
    // Fetch the necessary products from Shopify
    const shopifyProducts = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      ids: productIds,
    });
    
    // Fetch the OnHand values for these products
    const localProducts = await Product.findAll({
      where: { productId: productIds.split(",") },
      attributes: ['sku', 'OnHand', 'productId'],
      raw: true,
    });

    // Match Shopify and local products with order items and map the additional properties
    order.OrderItems = order.OrderItems.map(item => {
      const shopifyProduct = shopifyProducts.data.find(p => p.id.toString() === item.productId);
      const localProduct = localProducts.find(lp => lp.productId.toString() === item.productId);
      const variant = shopifyProduct.variants.find(v => v.sku === item.SKU);
      const variantImage = shopifyProduct.images.find(img => img.id === variant.image_id);
      
      return {
        ...item,
        imageUrl: variantImage ? variantImage.src : shopifyProduct.images[0]?.src || shopifyProduct?.image?.src,
        title: `${shopifyProduct.title} - ${variant.title}`,
        productId: shopifyProduct.id,
        onHand: localProduct ? localProduct.OnHand : 0,
      };
    });

    res.json(order);

  } catch (error) {
    console.error('Failed to fetch the order:', error);

    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ message: 'Validation errors occurred', errors: error.errors });
    }
    
    res.status(500).json({ message: 'Failed to fetch the order' });
  }
};

export const updateOrder = async (req, res, next) => {
  try {
      const shopDomain = res.locals.shopify.session.shop;
      const { orderId } = req.params;

      const { 
          orderDate, 
          orderNotes, 
          supplierID, 
          warehouseManagerID,
          orderStatus, 
          items,
          shipments,
          invoices 
      } = req.body;

      const order = await Order.findByPk(orderId);
      
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      await db.transaction(async (t) => {
          if (items && items.length > 0) {
              await OrderItem.destroy({ where: { orderID: orderId } }, { transaction: t });
              
              const orderItems = items.map(item => ({
                  orderID: orderId,
                  SKU: item.SKU,
                  quantity: item.quantity,
              }));
              
              await OrderItem.bulkCreate(orderItems, { transaction: t });
          }

          if (shipments && shipments.length > 0) {
              await Shipment.destroy({ where: { orderID: orderId } }, { transaction: t });
              
              const orderShipments = shipments.map(shipment => ({
                  orderID: orderId,
                  unitCount: shipment.unitCount,
                  tracking: shipment.tracking,
                  status: shipment.status,
                  notes: shipment.notes,
              }));
              
              await Shipment.bulkCreate(orderShipments, { transaction: t });
          }

          if (invoices && invoices.length > 0) {
              await Invoice.destroy({ where: { orderID: orderId } }, { transaction: t });
              
              const orderInvoices = invoices.map((invoice, index) => ({
                  orderID: orderId,
                  amount: invoice.amount,
                  date: invoice.date,
                  filePath: invoice.filePath,
              }));
              
              await Invoice.bulkCreate(orderInvoices, { transaction: t });
          }

          await Order.update({
              orderDate,
              orderNotes,
              supplierID,
              warehouseManagerID,
              orderStatus
          }, {
              where: { id: orderId },
              transaction: t
          });
      });

      return res.status(200).json({ message: 'Order updated successfully' });

  } catch (err) {
      console.error('Error in updateOrder:', err);
      return next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;

    console.log("Files: ", req.files);
    const filePaths = req.files.map(file => file.url);
    console.log("File paths: ", filePaths);

    const { 
        orderDate, 
        orderNotes, 
        supplierID, 
        warehouseManagerID,
        items, // Array of {productId, SKU, quantity}
        shipments, // Array of {unitCount, tracking, status, notes}
        invoices  // Array of {totalCost, date}
    } = req.body;

    console.log("items: ", items);
    console.log("invoices: ", invoices);
    console.log("shipments: ", shipments);

    const result = await db.transaction(async (t) => {
      const newOrder = await Order.create(
        {
          shopDomain,
          orderDate,
          orderNotes,
          supplierID,
          warehouseManagerID,
          orderStatus: 'Pending',
        },
        { transaction: t }
      );

      const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
      const orderItems = parsedItems.map((item) => ({
        orderID: newOrder.id,
        SKU: item.SKU,
        quantity: item.quantity,
        productID: item.productId
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      if (shipments && shipments.length > 0) {
          const parsedShipments = typeof shipments === "string" ? JSON.parse(shipments) : shipments;
          const orderShipments = parsedShipments.map(shipment => ({
          orderID: newOrder.id,
          unitCount: shipment.unitCount,
          tracking: shipment.tracking,
          status: shipment.status,
          notes: shipment.notes,
          }));
          await Shipment.bulkCreate(orderShipments, { transaction: t });
      }

      if (invoices && invoices.length > 0) {
          const parsedInvoices = typeof invoices === "string" ? JSON.parse(invoices) : invoices;
          const orderInvoices = parsedInvoices.map((invoice, index) => ({
          orderID: newOrder.id,
          totalCost: invoice.totalCost || 0,
          date: invoice.date,
          filePath: filePaths[index] || null
          }));
          await Invoice.bulkCreate(orderInvoices, { transaction: t });
      }
      return newOrder; 
    });

    res.status(201).json({
      success: true,
      result,
      message: 'Order created successfully',
    });
  } catch (err) {
    console.error('Error in createOrder:', err);
    next(err);
  }
};