import User from '../models/user.js';

// Handle user creation on POST
export const createUser = async (req, res) => {
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
};

// Handle user listing on GET
export const getUsers = async (_req, res) => {
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
};

function generateTempPassword() {
    return Math.random().toString(36).slice(-8);
}