import product from "../models/product.js"

export const getProducts = async (req, res) => {
    const countData = await shopify.api.rest.Product.all({
        session: res.locals.shopify.session,
      });
    
    // Fetch all SKUs and check if there's records for them in the inventory table, create them if no records
    
    // Inventory Table [SKU, OnHand, TotalSold]
    
    // Purchase Order 
    
    // Fetch last sync time, if null start at start date specified in settings
    
    // Fetch all orders from last sync date - [SoldUnits]
    
    // Fetch from MySQL PO and Inventory tables - [OnHand, DeliveredPO]
    
    // Get all orders
    
    // Write to MySQL settings table DateTime of last sync (now) 
    
    
      res.status(200).send(countData);
}

export const updateProduct = async (req, res) => {

}