function Login() {

  return (

    <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">

      <div className="bg-[#1e293b] p-10 rounded-xl w-[420px]">

        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Login to Abhinandan Events
        </h2>

        <input className="input" placeholder="Email" />

        <input className="input" type="password" placeholder="Password" />

        <select className="input">
          <option>Select Login Type</option>
          <option>Client</option>
          <option>Vendor</option>
          <option>Admin</option>
        </select>

        <button className="w-full bg-pink-500 py-3 rounded-lg text-white font-semibold hover:bg-pink-600">
          Login
        </button>

        <p className="text-gray-400 mt-4 text-center">
          Don't have an account? Signup
        </p>

      </div>

    </div>

  );

}

export default Login;