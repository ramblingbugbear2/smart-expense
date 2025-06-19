export const login = async(email,password) => {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({email,password})
    });
    if(!res.ok) throw new Error('Login failed!!');
    const {access} = await res.json();
    localStorage.setItem('accessToken',access);
};