import Order from "../models/order.js"
import OrderItem from "../models/orderItem.js";
import User from "../models/user.js"
import Invoice from "../models/invoice.js"
import Shipment from "../models/shipment.js"
import shopify from "../shopify.js"
import Sequelize from 'sequelize';

export const getOrders = async (req, res) => {
  try {
      const shopDomain = res.locals.shopify.session.shop;
      const orders = await Order.findAll({
          attributes: [
              'id',
              'orderStatus',
              'orderDate',
              'orderNotes',
              // Aggregate function to calculate total amount
              [Sequelize.fn('SUM', Sequelize.col('OrderItems.quantity')), 'totalAmount']
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
              },
              {
                  model: OrderItem,
                  attributes: [],
                  duplicating: false
              }
          ],
          where: { shopDomain },
          group: [ 
              'Order.id',
              'Supplier.id',
              'WarehouseManager.id'
          ]
      });
      console.log(JSON.stringify(orders, null, 2));

      res.json(orders);
  } catch (error) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrder = async (req, res) => {
  try {
      const { orderId } = req.params;
      
      const order = await Order.findOne({
          where: { id: orderId },
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
              },
              {
                  model: OrderItem,
                  attributes: ['SKU', 'quantity']
              },
              {
                  model: Shipment,
                  attributes: ['amount', 'tracking', 'status', 'notes']
              },
              {
                  model: Invoice,
                  attributes: ['amount', 'date', 'filePath']
              }
          ]
      });

      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);

  } catch (error) {
      console.error('Failed to fetch the order:', error);
      res.status(500).json({ message: 'Failed to fetch the order' });
  }
};



export const updateOrder = async(req, res) =>{
    try{
        const shopDomain = res.locals.shopify.session.shop;

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error on updateOrder' });
    }

}

export const createOrder = async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;

    console.log("Files: ", req.files);
    const filePaths = req.files.map(file => file.path);
    console.log("File paths: ", filePaths);

    const { 
        orderDate, 
        orderNotes, 
        supplierID, 
        warehouseManagerID,
        items, // Array of {SKU, quantity}
        shipments, // Array of {unitCount, tracking, status, notes}
        invoices  // Array of {totalCost, date, filePath}
    } = req.body;

    const result = await db.transaction(async (t) => {
      // Create the Order first
      const newOrder = await Order.create({
          shopDomain,
          orderDate,
          orderNotes,
          supplierID,
          warehouseManagerID,
          orderStatus: "Pending"
      }, { transaction: t });

      const orderItems = items.map(item => ({
          orderID: newOrder.id,
          SKU: item.SKU,
          quantity: item.quantity,
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      const orderShipments = shipments.map(shipment => ({
          orderID: newOrder.id,
          amount: shipment.amount,
          tracking: shipment.tracking,
          status: shipment.status,
          notes: shipment.notes,
      }));

      await Shipment.bulkCreate(orderShipments, { transaction: t });

      const orderInvoices = invoices.map((invoice, index) => ({
        orderID: newOrder.id,
        amount: invoice.amount,
        date: invoice.date,
        filePath: filePaths[index] || null
      }));
    
      await Invoice.bulkCreate(orderInvoices, { transaction: t });

      return newOrder; 
    });

    res.json(result);  

  } catch (err) {
      console.error('Error in createOrder:', err);
      res.status(500).json({ message: 'Server error on createOrder' });
  }
};