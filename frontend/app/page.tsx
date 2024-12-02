"use client";

import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();


  const HandleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push('/login'); // reroute to the login page
  }

  const HandleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push('/createUser'); // reroute to the signup page
  }
  
  
  return (
    <div className="flex-col flex items-center justify-center min-h-screen bg-black px-4">
      <h1 className="text-white text-6xl font-extrabold mb-12">
        STOCKIFY
      </h1>
      <div className="flex space-x-4">
        <button 
        className="text-white px-6 py-3 font-semibold bg-sky-500 hover:bg-sky-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300"
        onClick={(e) => HandleLogin(e)}
        >LOGIN
        </button>

        <button 
        className="text-white px-6 py-3 font-semibold bg-sky-500 hover:bg-sky-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300"
        onClick={(e) => HandleSignUp(e)}
        >SIGN UP
        </button>
      </div>
    </div>
  );
}

export default Home;