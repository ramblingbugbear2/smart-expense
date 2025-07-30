import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

export const usePending = (groupId) =>
  useQuery({
    queryKey: ['pending', groupId],
    queryFn:  () => api.get(`/settlements/pending/${groupId}`).then(r => r.data),
    enabled:  !!groupId,            // skip until we actually have an id
  });

export const useCreateSettlement = () => {
  const qc = useQueryClient();
    return useMutation({
    // mutationFn: (body, cfg) =>
    //   api.post('/settlements', body, cfg).then(r => r.data),
    mutationFn: ({ clear = false, ...body }) =>
      api.post(`/settlements${clear ? '?clear=1' : ''}`, body)
         .then(r => r.data),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['pending',  vars.group] });
      qc.invalidateQueries({ queryKey: ['balances', vars.group] });
      qc.invalidateQueries({ queryKey: ['expenses', vars.group] });
    },
  });
};
    
