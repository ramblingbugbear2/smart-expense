import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';

export default function LoginPage(){
  const [email,setEmail]       = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr]           = useState('');
  const { set } = useAuth();
  const nav = useNavigate();

  const submit = async e=>{
    e.preventDefault();
    try{
      const {data} = await api.post('/auth/login',{email,password});
      set(data.access);
      nav('/');
    }catch{ setErr('Bad credentials'); }
  };

  return (
    <form onSubmit={submit}
          className="max-w-sm mx-auto mt-24 space-y-3 p-6 border rounded">
      <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/>
      <Input type="password" value={password}
             onChange={e=>setPassword(e.target.value)} placeholder="password"/>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <Button className="w-full">Login</Button>
    </form>
  );
}
