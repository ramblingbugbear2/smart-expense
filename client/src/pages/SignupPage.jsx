import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api           from '../api/axios.js';
import { useAuth }   from '../hooks/useAuth.jsx';

export default function SignupPage () {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [pass,  setPass]      = useState('');
  const [err,   setErr]       = useState('');
  const { set }               = useAuth();          // save token
  const nav                   = useNavigate();

  async function submit (e){
    e.preventDefault();
    try{
      const { data } = await api.post('/auth/signup',
        { name, email, password:pass });
      set(data.access);                // auto-login after sign-up
      nav('/');                         // go to groups page
    }catch(e){
      setErr(e?.response?.data?.msg ?? 'Sign-up failed');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-20 space-y-4">
      <input  className="input w-full" placeholder="name"
              value={name}  onChange={e=>setName(e.target.value)} />
      <input  className="input w-full" placeholder="email"
              value={email} onChange={e=>setEmail(e.target.value)} />
      <input  className="input w-full" placeholder="password" type="password"
              value={pass}  onChange={e=>setPass(e.target.value)} />
      {err && <p className="text-red-600">{err}</p>}
      <button className="btn btn-primary w-full">Create account</button>
    </form>
  );
}