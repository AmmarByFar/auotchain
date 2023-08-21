import User from './user.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Shipment from './shipment.js';
import Invoice from './invoice.js';

Order.belongsTo(User, { as: 'Supplier', foreignKey: 'supplierID' });
Order.belongsTo(User, { as: 'WarehouseManager', foreignKey: 'warehouseManagerID' });
Order.hasMany(OrderItem, { foreignKey: 'orderID' });
Order.hasMany(Shipment, { foreignKey: 'orderID' });
Order.hasMany(Invoice, { foreignKey: 'orderID' });
OrderItem.belongsTo(Order, { foreignKey: 'orderID' });

Shipment.belongsTo(Order, {foreignKey: 'orderID'});

Invoice.belongsTo(Order, {foreignKey: 'orderID'});