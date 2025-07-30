// api/utils/number.js

/**
 * Round to two decimal places (₹0.01 precision).
 * @param {number} num
 * @returns {number}
 */
exports.round = (num) => Math.round(num * 100) / 100;
