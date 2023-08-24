import AppSettings from '../models/appSettings.js';

export const getSettings = async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    let settings = await AppSettings.findOne({ where: { shopDomain } });
    if (settings) {
      res.json({ message: 'Settings retrieved successfully!', settings });
    } else {
      res
        .status(404)
        .json({ message: 'No settings found for this shopDomain' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const postSettings = async (req, res) => {
  try {
    const shopDomain = res.locals.shopify.session.shop;
    const { reorderLevel, reorderAmount, startDate, trackingEnabled } =
      req.body;
    // Find existing settings for this shopDomain
    let settings = await AppSettings.findOne({ where: { shopDomain } });
    const payload = {
      reorderLevel: parseInt(reorderLevel),
      reorderAmount: reorderAmount.length ? parseInt(reorderAmount) : 0,
      startDate,
      trackingEnabled,
    };
    console.log('app setting payload', payload);

    if (settings) {
      settings.reorderLevel = payload.reorderLevel;
      settings.reorderAmount = payload.reorderAmount;
      settings.startDate = payload.startDate;
      settings.trackingEnabled = payload.trackingEnabled;
      await settings.save();
    } else {
      settings = await AppSettings.create({
        shopDomain,
        ...payload
      });
    }

    res.json({ message: 'Settings saved successfully!', settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
