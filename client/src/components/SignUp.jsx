import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const [showPassword,setShowPassword]=useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/SignUp', formData);
      toast.success('Registration successful!');
      navigate('/'); // Redirect to login page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="home">
      <h1 className='title'>Qwik Food</h1>
      <p>Your one-stop destination for fast, smart, and seamless online food ordering.</p>
      <div className="login">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name"
            placeholder="Username" 
            value={formData.name}
            onChange={handleChange}
            required
          /><br />
          <input 
            type="email" 
            name="email"
            placeholder="E-Mail" 
            value={formData.email}
            onChange={handleChange}
            required
          /><br />
          <input 
            type={showPassword ? 'text' : 'password'} 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required
          />

          <span onClick={()=>setShowPassword(!showPassword)} style={{marginLeft:'10px'}}>
            {showPassword ? <i class="fa-solid fa-eye"></i>: <i class="fa-solid fa-eye-slash"></i>}
          </span><br />

          <button type="submit">Sign up</button><br />
        </form>
        <p className='logState'>
          <p style={{color:'black'}}>Already have an account?</p>
          <Link to={'/'}>
            <a href="#" >Login to continue</a>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;