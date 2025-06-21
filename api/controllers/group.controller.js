const Group = require('../models/group.model');

exports.create = async (req,res) => {
    const {name, members} = req.body;
    const group = await Group.create({
        name,
        members: [...new Set([...members,req.userId])],
        createdBy: req.userId
    });
    res.status(201).json(group);
};

exports.list = async(req,res) => {
    const groups = await Group.find({members:req.userId});
    res.json(groups);
};