const prisma = require('../config/prisma');

function calculateBookingTotal(roomPrice, nights, totalAddon, customerDiscount) {
  return roomPrice * nights + totalAddon - customerDiscount;
}

async function processAddons(addon) {
  let totalAddon = 0;
  let addonListData = [];
  const validAddons = Array.isArray(addon)
    ? addon.filter(a => a.addonId !== undefined && a.quantity !== undefined)
    : [];
  if (addon && addon.length > 0 && validAddons.length !== addon.length) {
    throw new Error('Invalid addon format. Each addon must have addonId and quantity.');
  }
  if (validAddons.length > 0) {
    const addonsData = await prisma.addon.findMany({
      where: {
        addonId: {
          in: validAddons.map(a => a.addonId)
        }
      },
      select: {
        addonId: true,
        price: true
      }
    });
    addonListData = validAddons.map((addonItem) => {
      const addonId = addonItem.addonId;
      const quantity = addonItem.quantity;
      const foundAddon = addonsData.find((a) => a.addonId === addonId);
      if (foundAddon) {
        totalAddon += foundAddon.price * Number(quantity);
        return {
          addonId: Number(addonId),
          quantity: Number(quantity)
        };
      }
      return null;
    }).filter((a) => a !== null);
  }
  return { totalAddon, addonListData };
}

module.exports = { calculateBookingTotal, processAddons }; 