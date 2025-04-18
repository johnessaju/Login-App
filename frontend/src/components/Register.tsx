import { MdAlternateEmail } from 'react-icons/md';
import { FaFingerprint } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';

const Register = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [reEnterPassword, setReEnterPassword] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const navigate = useNavigate();

  const registerHandle = async () => {
    if (password == reEnterPassword) {
      await api
        .post('/register', { name: userName, password: password })
        .then((msg) => {
          console.log(msg.data.message);
          navigate('/');
        })
        .catch((err) => console.log('something went wrong:' + err));
      setUserName('');
      setPassword('');
      setReEnterPassword('');
    } else {
      alert('password do not match');
    }
  };

  return (
    <div className="loginWrapper w-full h-screen flex justify-center items-center">
      <div className="loginCard w-[85%] max-w-sm md:max-w-md flex flex-col items-center bg-gray-900 p-5 rounded-xl gap-3 shadow-slate-500 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-12 md:w-14" />
        <h1 className="text-lg md:text-xl font-semibold ">Register</h1>
        <p className="text-sm">
          <span className="text-gray-500">Already registered ? </span>
          <span className="cursor-pointer " onClick={() => navigate('/')}>
            Sign In
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
            placeholder="User Name "
          />
        </div>
        <div className="passwordinput flex justify-start items-center gap-2 p-2 mb-2 rounded-xl bg-gray-800 w-full">
          <FaFingerprint />
          <input
            type="text"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className="w-full border-0 focus:outline-none"
            placeholder="Password"
          />
        </div>
        <div
          className={`passwordinput ${
            !passwordMatch ? 'border border-red-500' : ''
          } flex justify-start items-center gap-2 p-2 mb-2 rounded-xl bg-gray-800 w-full`}
        >
          <FaFingerprint />
          <input
            type="text"
            value={reEnterPassword}
            onChange={(e) => {
              setReEnterPassword(e.target.value);
              setPasswordMatch(password === e.target.value);
            }}
            className="w-full border-0 focus:outline-none"
            placeholder="Re-Enter password"
          />
        </div>

        <button
          onClick={registerHandle}
          className="bg-blue-500 hover:bg-blue-600 w-full rounded-xl p-2 cursor-pointer mb-6"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
