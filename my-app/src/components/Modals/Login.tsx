import { authModalState } from '@/atoms/authModalAtom';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import { limitToLast } from 'firebase/firestore';
import { toast } from 'react-toastify';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const handleClick = (type: "login" | "register" | "forgotPassword") => {
        setAuthModalState((prev) => ({...prev,type}));
    };
    const [inputs,setInputs] = useState({email: "",password: ""});
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);
      const router = useRouter();
      const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev,[e.target.name]:e.target.value}));
      }
      const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password) return toast.error("Please fill all details", {position: "top-center",autoClose: 3000,theme: "dark"});
        try{
        const newUser = await signInWithEmailAndPassword(inputs.email,inputs.password);
        if(!user) return;
        router.push("/");
        }
        catch(error:any){
            toast.error(error.message, {position: "top-center",autoClose: 3000,theme: "dark"});
        }
      };
      useEffect(() => {
        if(error) toast.error(error.message, {position: "top-center",autoClose: 3000,theme: "dark"});
      },[error])
    return (
    <form className ="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
        <h3 className='text-x; font-medium text-white'>Sign in to LeetClone</h3>
        <div>
            <label htmlFor='email' className='text-sm font-medium block mb- text-gray-300'>
                Your Email
            </label>
            <input
            onChange = {handleInputChange}
            type = 'email'
            name = 'email'
            id = 'email'
            className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' 
            placeholder='name@company.com'/>

        </div>
        <div>
            <label htmlFor='password' className='text-sm font-medium block mb- text-gray-300'>
                Your Password
            </label>
            <input
            onChange = {handleInputChange}
            type = 'password'
            name = 'password'
            id = 'password'
            className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white
            ' 
            placeholder='********'/>
            
        </div>
        <button type = "submit" className="w-full text-white focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-900 hover:bg-blue-900">
            {loading ? "Loading..." :"Log In"}

        </button>
        <button className="flex w-full justify-end" onClick={() => handleClick("forgotPassword")}>
            <a href="#" className="text-sm block text-blue-200 hover:underline w-full text-right">
                Forgot Password?
            </a>
        </button>
        <div className="text-sm font-medium text-gray-500">
            Not Registered?{" "}
            <a href="#" className="text-blue-700 hover:underline" onClick={() => handleClick("register")}>
                Create Account</a></div>
    </form>
    );
};

export default Login;