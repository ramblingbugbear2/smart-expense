const r  = require('express').Router();
const v  = require('../middleware/validate');
const p  = require('../middleware/protect');
const c  = require('../controllers/settlement.controller');
const loadGroupFromBody = require('../middleware/loadGroupFromBody');
const { z } = require('zod');

/* Pre-load group (attaches req.group for POST guard) */
r.param('id', require('../middleware/loadGroup'));

const createSchema = z.object({
  group : z.string().length(24),
  from  : z.string().length(24),
  to    : z.string().length(24),
  amount: z.number().positive(),
  note  : z.string().max(120).optional(),
});

// r.post('/',            p, v.body(createSchema), c.create);
r.post(
  '/',
  p,                          // auth
  v.body(createSchema),       // validate
  loadGroupFromBody,          // 👈 injects req.group
  c.create                    // controller
);
r.get('/group/:id',    p,                        c.listGroup);
r.get('/pending/:id',  p,                        c.pending);

module.exports = r;
