import React, { useContext, useState } from 'react'
import image from '../assets/loginSide.jpg'
import AppContext from '../contexts/AppContext';

const Login = () => {
    const { login, loadingUser } = useContext(AppContext);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        login(userId, password);
    };


  return (
    <div className="sm:min-h-screen flex items-center justify-center bg-slate-50 px-2 pt-5">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Illustration Section */}
        <div className="hidden md:flex items-center justify-center bg-indigo-50 p-8">
          <img
            src={image}
            alt="Student Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Login Form */}
        <div className="p-4 sm:p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Login</h2>
          <p className="text-gray-500 mb-8">Welcome back! Please login to your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">User Id</label>
              <input
                type="text"
                value={userId}
                onChange={(e)=>setUserId(e.target.value)}
                placeholder="student@email.com"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loadingUser}
              className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition"
            >
              {loadingUser ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
