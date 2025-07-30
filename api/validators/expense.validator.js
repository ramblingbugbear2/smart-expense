const {z} = require('zod');

const objectId = z.string().length(24).regex(/^[0-9a-fA-F]+$/);

exports.createExpense = z.object({
    group: objectId,
    amount: z.number().positive(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    payer: z.string().length(24),
    participants: z.array(
        z.object({
            user: z.string().length(24),
            share: z.number().positive()
        })).min(1)
});

exports.updateExpense = z.object({
  description: z.string().min(1).optional(),
  amount:      z.number().positive().optional(),
});
