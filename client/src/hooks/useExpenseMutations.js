import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

export function useEditExpense() {
  const qc = useQueryClient();

  return useMutation({
    /* ---------------- mutation ---------------- */
    mutationFn: ({ id, group, ...body }) =>
      api.patch(`/expenses/${id}`, body).then(r => ({ ...r.data, group })),

    /* -------------- cache/side-effects -------------- */
    onSuccess: (_data, vars) => {
      qc.invalidateQueries(['expenses',  vars.group]);
      qc.invalidateQueries(['balances',  vars.group]);
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => api.delete(`/expenses/${id}`),

    onSuccess: (_ , vars) => {
      qc.invalidateQueries(['expenses', vars.group]);
      qc.invalidateQueries(['balances', vars.group]);
    },
  });
}
