const Expense = require('../models/expense.model');
const balanceSvc = require('../services/balance.service');
const socket = require('../utils/socket');

exports.create = async (req,res,next)=>{
  try{
    const exp = await Expense.create(req.body);

    await balanceSvc.invalidateGroup(exp.group);             // bust cache
    // io.to(exp.group.toString()).emit('expense:new', exp);    // live push
    const io = socket.get()
    io.to(exp.group.toString()).emit('expense:new', exp);

    res.status(201).json(exp);
  }catch(err){ next(err); }
};

exports.listByGroup = async (req,res) => {
    const expenses = await Expense.find({
        group: req.params.id
    });
    res.json(expenses);
};