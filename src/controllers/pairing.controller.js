const PairingModel = require('../models/pairing.model.js');

const createPairing = async (req, res) => {
  try {
    const pairingData = req.body;
    const pairing = await PairingModel.create(pairingData);
    res.status(201).json(pairing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPairing,
};
