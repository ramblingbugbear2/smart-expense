const { init } = require('../models/expense.model');
const Group = require('../models/group.model');
const balanceSvc = require('../services/balance.service');
const socket = require('../utils/socket');   

exports.create = async (req,res) => {
    try{
        const {name, members} = req.body;
        const group = await Group.create({
            name,
            members: [...new Set([...members,req.userId])],
            createdBy: req.userId
        });
        const io = socket.get()
        io.to(group._id.toString()).emit('group:new', group);
        
        
        res.status(201).json(group);
    } catch (err) { next(err); }
};

exports.listBalances = async (req,res) => {
    const data = await balanceSvc.getBalances(req.params.id);
    res.json(data);
}

exports.list = async(req,res) => {
    const groups = await Group.find({members:req.userId});
    res.json(groups);
};

exports.list = async (req, res) => {
   const groups = await Group.find({ members: req.userId });
   res.json(groups);
 };

exports.list = async (req, res) => {
   const groups = await Group.find({ members: req.userId });
   res.json(groups);
 };

exports.list = async (req, res) => {
   const groups = await Group.find({ members: req.userId });
   res.json(groups);
 };

exports.list = async (req, res) => {
   const groups = await Group.find({ members: req.userId });
   res.json(groups);
 };

exports.list = async (req, res) => {
   const groups = await Group.find({ members: req.userId });
   res.json(groups);
 };

exports.getOne = async (req, res, next) => {
  try {
    // bring back each member’s name & email for the client
    const g = await Group.findById(req.params.id)
                         .populate('members', 'name email');
    if (!g) return res.status(404).json({ msg: 'Group not found' });
    res.json(g);
  } catch (err) {
    next(err);
  }
};