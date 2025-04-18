import { MdAlternateEmail } from 'react-icons/md';
import { FaFingerprint } from 'react-icons/fa';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import api from '../axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [passwordView, setPasswordView] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const togglePasswordView = () => {
    setPasswordView(!passwordView);
  };

  const loginHandle = async () => {
    await api
      .post('/login', { name: userName, password: password })
      .then((res) => {
        const { username } = res.data;
        username ? navigate('/welcome') : navigate('/');
      })
      .catch(() => navigate('/'));
    setUserName('');
    setPassword('');
  };

  return (
    <div className="loginWrapper w-full h-screen flex justify-center items-center">
      <div className="loginCard w-[85%] max-w-sm md:max-w-md flex flex-col items-center bg-gray-900 p-5 rounded-xl gap-3 shadow-slate-500 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-12 md:w-14" />
        <h1 className="text-lg md:text-xl font-semibold">Login</h1>
        <p className="text-sm" onClick={() => navigate('/register')}>
          <span className="text-gray-500">Don't have an account? </span>
          <span
            className="cursor-pointer "
            onClick={() => navigate('/register')}
          >
            Sign up
          </span>
        </p>
        <div className="emailinput flex justify-start items-center gap-2 p-2 rounded-xl bg-gray-800 w-full">
          <MdAlternateEmail />
          <input
            type="text"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            className="w-full border-0 focus:outline-none"
            placeholder="User Name"
          />
        </div>
        <div className="passwordinput flex justify-start items-center gap-2 p-2 mb-2 rounded-xl bg-gray-800 w-full ">
          <FaFingerprint />
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full border-0 focus:outline-none"
            placeholder="Password"
          />
          {passwordView ? (
            <FaRegEye
              className="text-xl mx-3 cursor-pointer"
              onClick={togglePasswordView}
            />
          ) : (
            <FaRegEyeSlash
              className="text-xl mx-3 cursor-pointer"
              onClick={togglePasswordView}
            />
          )}
        </div>

        <button
          onClick={loginHandle}
          className="bg-blue-500 hover:bg-blue-600 w-full rounded-xl p-2 cursor-pointer mb-7"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
