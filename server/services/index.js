// Example service function
function calculateRoomPrice(basePrice, nights, addons = 0) {
  return basePrice * nights + addons
}

module.exports = { calculateRoomPrice } 