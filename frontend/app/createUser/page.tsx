"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [access_token, setAccessToken] = useState("");

    const passwordMatch = password !== "" && confirmPassword !== "" && password !== confirmPassword;

    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5001/api/users/register', {
            method: 'POST',
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
         .then((res) => {   
            if (!res.ok) {
                if (res.status === 400)
                {
                    throw new Error('User already exists: ' + res.statusText);
                }
                throw new Error('Creation failed: ' + res.statusText);
            }
            return res.json();
        })
         .then((data) => {
            console.log(data)
            const access_token = data.token;
            setAccessToken(access_token);
            setPassword('');
            setEmail('');
            console.log('Creation successful, token:', access_token); // REMOVE LATER
            router.push('/login') // RE ROUTE TO NEXT PAGE --> Login --> Full portfolio
         })
         .catch((err) => {
            console.log(err.message);
            alert('Creation failed. Please try again.');
         });
    }
    
    return (

        <div className="flex items-center justify-center min-h-screen bg-black px-4">
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-white text-center mb-6">SIGN UP</h1>
            
            {/* USERNAME */}
            <label htmlFor="username" className="block text-md font-semibold text-gray-200 mb-2">Username</label>
            <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Enter your username"
            />
            
            {/* EMAIL */}
            <label htmlFor="email" className="block text-md font-semibold text-gray-200 mb-2">Email</label>
            <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Enter your email"
            />
            
            {/* PASSWORD */}
            <label htmlFor="password" className="block text-md font-semibold text-gray-200 mb-2">Password</label>
            <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Enter your password"
            />
            
            {/* CONFIRM PASSWORD */}
            <label htmlFor="confirmPassword" className="block text-md font-semibold text-gray-200 mb-2">Confirm Password</label>
            <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
                setConfirmPassword(e.target.value);
            }}
            className="w-full px-4 py-2 mb-3 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Confirm your password"
            />
            
            {passwordMatch && (
                <p className="text-red-500 text-base mt-1 mb-6">
                    Passwords do not match.
                </p>
        )}


            {/* SIGNUP */}
            <button
            type="submit"
            onClick={(e) => handleSignUp(e)}
            className="w-full py-3 text-white font-semibold bg-sky-500 hover:bg-sky-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300"
            >
            Sign Up
            </button>
            
            {/* LOGIN */}
            <p className="mt-6 text-center text-gray-400">
            Already have an account? 
            <a href="http://localhost:3000/login" className="text-sky-500 hover:underline ml-1">Login</a>
            </p>
        </div>
        </div>

    )
}

    

export default Home;
