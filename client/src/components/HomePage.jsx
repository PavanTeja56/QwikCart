import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';
import {BrowserRouter as Router,Routes,Route,Link,useNavigate} from "react-router-dom";

const HomePage = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [showPassword,setShowPassword]=useState(false);
  const cookie=Cookie.get('email')
  const navigate=useNavigate()
  const handleChange=async(e)=>{
    e.preventDefault();

    try{
      const response = await fetch('http://localhost:8000/login2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password})
    });

    const data=await response.json()
    if(data==='done'){
      Cookie.set('email',email,{expires:7})
      toast.success('login done')
    }
    else if(data==='unmatched'){
      toast.error('password unmatched')
      }
      else if(data==='notexists'){
        toast.error('user not found')
      }
    }
    catch(err){
      console.log('error:',err)
      toast.error('something wrong')
    }
  }
const itemsRender=()=>{
  if(cookie){
    navigate('/pageChange')
  }
}
  return (
    <div className="home">
      <h1 className='title'>Qwik Food</h1>
      <p >Your one-stop destination for fast, smart, and seamless online food ordering.</p>

      <div className="login">
        

        <h2>Login</h2>

        <form onSubmit={handleChange}>
          <input type="email" name="email" placeholder="E-Mail" value={email} onChange={(e)=>setEmail(e.target.value)}  required/><br />
          <input type={showPassword ? 'text' : 'password'} 
          placeholder="Password" value={password} 
          onChange={(e)=>setPassword(e.target.value)} required/>
          <span onClick={()=>setShowPassword(!showPassword)} style={{marginLeft:'10px'}}>
            {showPassword ? <i class="fa-solid fa-eye"></i>:<i class="fa-solid fa-eye-slash"></i>}
          </span>
          <br />
          {/* <button type="submit"> Login</button><br /> */}
          <button type="submit" onClick={itemsRender()}> Login</button><br />
          
          {/* <Link to={cookie  ? '/pageChange': ''} >Login</Link> */}
        </form>
        <p className='logState'>
          <p style={{color:'black'}}>Don’t have an account?</p>
          <Link to={'/SignUp'}>
          
            Create an account.
          
          </Link>
        </p>

        <p><Link to={"/forgot-password"}>Forgot Password?</Link></p>

      </div>
    </div>
  );
};

export default HomePage;
