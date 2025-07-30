// client/src/hooks/useSocket.js
import { useEffect, useMemo } from 'react';
import { io }            from 'socket.io-client';
import { getAccess }     from './useAuth';

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:3000';

/**
 * One socket shared by the component that calls the hook.
 * Re-created only if API_ORIGIN changes (dev vs prod build).
 */
export function useSocket(groupId) {
  const socket = useMemo(
    () =>
      io(API_ORIGIN, {
        auth:            { token: getAccess() },
        withCredentials: true,             // ← send cookies if you ever need them
        transports:      ['websocket'],    // ← skip long-polling in dev
        autoConnect:     false,
      }),
    [API_ORIGIN]                           // ✅ include env var just in case
  );

  // open / close
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, [socket]);

  // join the room when a valid groupId arrives
  useEffect(() => {
    if (groupId) socket.emit('joinGroup', groupId);
  }, [socket, groupId]);

  return socket;                           // caller registers its own handlers
}
