const Expense = require('../models/expense.model');

exports.create = async (req,res) => {
    const { group, payer, participants, amount, description, date} = req.body;

    const exp = await Expense.create({ group, payer, participants, amount, description, date});
    res.status(201).json(exp);
};

exports.listByGroup = async (req,res) => {
    const expenses = await Expense.find({
        group: req.params.id
    });
    res.json(expenses);
};