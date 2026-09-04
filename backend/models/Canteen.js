const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Canteen name is required'],
      trim: true,
      unique: true,
    },
    nameLower: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate nameLower before saving for case-insensitive unique searching
canteenSchema.pre('save', function (next) {
  if (this.name) {
    this.nameLower = this.name.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Canteen', canteenSchema);
