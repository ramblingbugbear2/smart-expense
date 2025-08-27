// hooks/useLocalUsers.js
import { useState } from 'react';

export const useLocalUsers = () => {
  const [localUsers, setLocalUsers] = useState(() => {
    const saved = localStorage.getItem('smart-expense-local-users');
    return saved ? JSON.parse(saved) : [];
  });

  const addLocalUser = (name) => {
    const newUser = {
      _id: `local_${Date.now()}`, // 🔧 FIX: Use _id instead of id
      name: name.trim(),
      type: 'local',
      email: null
    };
    const updated = [...localUsers, newUser];
    setLocalUsers(updated);
    localStorage.setItem('smart-expense-local-users', JSON.stringify(updated));
    return newUser;
  };

  const removeLocalUser = (id) => {
    const updated = localUsers.filter(user => user._id !== id); // 🔧 FIX: Use _id
    setLocalUsers(updated);
    localStorage.setItem('smart-expense-local-users', JSON.stringify(updated));
  };

  const updateLocalUser = (id, name) => {
    const updated = localUsers.map(user => 
      user._id === id ? { ...user, name: name.trim() } : user // 🔧 FIX: Use _id
    );
    setLocalUsers(updated);
    localStorage.setItem('smart-expense-local-users', JSON.stringify(updated));
  };

  return { localUsers, addLocalUser, removeLocalUser, updateLocalUser };
};
