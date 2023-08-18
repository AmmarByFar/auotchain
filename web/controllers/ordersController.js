import Order from "../models/order.js"
import User from "../models/user.js"
import shopify from "../shopify.js"
import Sequelize from 'sequelize';

export const getOrders = async (req, res) => {
    try {
        const shopDomain = res.locals.shopify.session.shop
        console.log(shopDomain);
        const orders = await Order.findAll({
          attributes: [
            'id',
            'SKU',
            'orderAmount',
            'orderStatus',
            'orderDate',
            'orderNotes'
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

}

export const updateOrder = async(req, res) =>{
    try{
        const shopDomain = res.locals.shopify.session.shop;

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error on updateOrder' });
    }

}

export const createOrder = async(req, res) => {
    try{
        const shopDomain = res.locals.shopify.session.shop;

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error on createOrder' });
    }

}