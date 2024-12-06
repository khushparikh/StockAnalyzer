"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { after } from "node:test";

interface PostData {
    email: string;
    password: string;
};



const Home = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    
    const HandleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5001/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                "email": email,
                "password": password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
         .then((res) => {   
            if (!res.ok) {
                if (res.status === 401)
                {
                    throw new Error('Invalid credentials: ' + res.statusText);
                }
                throw new Error('Login failed: ' + res.statusText);
            }
            return res.json();
        })
         .then((data) => {
            const access_token = data.token;
            sessionStorage.setItem("JWT", access_token);
            setPassword('');
            setEmail('');
            router.push('/fullPortfolio') // RE ROUTE TO NEXT PAGE --> Full portfolio
         })
         .catch((err) => {
            console.log(err.message);
            alert('Login failed. Please try again.');
         });
   };
    
    
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
            <div className="w-full max-w-md p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-lg shadow-lg">
                <h1 className="text-4xl font-extrabold text-white text-center mb-6">LOGIN</h1>
                
                {/* EMAIL */}
                <label htmlFor="email" className="block text-md font-semibold text-white mb-2">Email</label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mb-4 text-gray-900 rounded-md border border-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your email"
                />
                
                {/* PASSWORD */}
                <label htmlFor="password" className="block text-md font-semibold text-white mb-2">Password</label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mb-6 text-gray-900 rounded-md border border-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Enter your password"
                />
                
                {/* LOGIN */}
                <button
                type="submit"
                onClick={(e) => HandleClick(e)}
                className="w-full py-3 text-white font-semibold bg-sky-500 hover:bg-sky-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300"
                >Login</button>
                
                {/* SIGNUP */}
                <p className="mt-6 text-center text-white">
                Need an account? 
                <a href="http://localhost:3000/createUser" className="text-sky-500 hover:underline ml-1">Sign Up</a>
                </p>
            </div>
            </div>





    );
}

export default Home;