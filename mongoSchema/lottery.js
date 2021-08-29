const mongoose = require('mongoose');

const lotterySchema = new mongoose.Schema(
  {
    true: {type: Boolean},
    users: { type: Array },
    lastSort: { type: Date },
    winners: {type: Array}
  }
);

const lotteryModel = mongoose.model('Lottery', lotterySchema);

module.exports = lotteryModel;