import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../axios';

const Welcome = () => {
  const navigate = useNavigate();
  const [userName, setuserName] = useState('');
  useEffect(() => {
    api
      .get('/welcome')
      .then((res) => {
        res.data.username ? setuserName(res.data.username) : navigate('/');
      })
      .catch((err) => {
        // If the access and refresh token is expired or not available
        if (err.response?.status === 401) {
          navigate('/');
        }
        // If the referesh token is vaild and access token expired
        if (err.response?.status === 403) {
          // creates a new access token if the refresh tokken is valid
          api
            .post('/token')
            .then((res) => {
              console.log(res.data.message);
              navigate('/welcome');
            })
            .catch(() => {
              navigate('/');
            });
        }
      });
  }, []);

  const logoutHandler = async () => {
    await api
      .post('/logout')
      .then((msg) => {
        console.log(msg.data.message);

        navigate('/');
      })
      .catch((err) => console.log('something went wrong:' + err));
  };

  return (
    <div className="loginWrapper w-full h-screen flex justify-center items-center">
      <div className="loginCard w-[85%] max-w-sm md:max-w-md flex flex-col items-center bg-gray-900 p-5 rounded-xl gap-3 shadow-slate-500 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-12 md:w-14" />
        <h1 className="text-lg md:text-xl font-semibold ">Welcome</h1>
        <p className="text-md text-gray-200">
          {`Hi ${userName}, How Are you doing today?`}
        </p>
        <button
          onClick={logoutHandler}
          className="bg-blue-500 hover:bg-blue-600 rounded-xl p-2 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
