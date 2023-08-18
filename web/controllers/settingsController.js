import AppSettings from "../models/appSettings.js";

export const getSettings = async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    let settings = await AppSettings.findOne({ where: { shopDomain } });
    if(settings) {
      res.json({ message: 'Settings retrieved successfully!', settings });
    } else {
      res.status(404).json({ message: 'No settings found for this shopDomain' });
    }  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const postSettings = async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    const { reorderLevel, reorderAmount, startDate } = req.body;

    // Find existing settings for this shopDomain
    let settings = await AppSettings.findOne({ where: { shopDomain } });

    if(settings) {
      settings.reorderLevel = reorderLevel;
      settings.reorderAmount = reorderAmount;
      settings.startDate = startDate;
      await settings.save();
    } else {
      settings = await AppSettings.create({ shopDomain, reorderLevel, reorderAmount, startDate });
    }

    res.json({ message: 'Settings saved successfully!', settings });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};