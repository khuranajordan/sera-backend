const ChildModel = require('../models/child.model.js'); 

const createChild = async (req, res) => {
  try {
    const newChild = new ChildModel(req.body);
    const savedChild = await newChild.save();
    res.status(201).json({
      "status": 1,
      "message": "Success"    
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createChild,
};
