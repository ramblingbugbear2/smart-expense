const {z} = require('zod');

exports.createGroup = z.object({
    name: z.string().min(1),
    members: z.array(z.string().length(24)).min(1)
});