import User from './user.js';
import Order from './order.js';
import OrderItem from './orderItem.js';

Order.belongsTo(User, { as: 'Supplier', foreignKey: 'supplierID' });
Order.belongsTo(User, { as: 'WarehouseManager', foreignKey: 'warehouseManagerID' });
Order.hasMany(OrderItem, { foreignKey: 'orderID' });
OrderItem.belongsTo(Order, { foreignKey: 'orderID' });