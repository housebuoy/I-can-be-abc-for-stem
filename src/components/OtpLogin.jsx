"use client"
import React, {FormEvent, useEffect, useState,useTransition, CSSProperties} from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button"
import { auth } from '../../firebase'
import {
    ConfirmationResult,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth"

import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './ui/input-otp'
import { useRouter } from 'next/navigation'
import { SignalHigh } from 'lucide-react';


const OtpLogin = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("")
    const [resendCountdown, setResendCountdown] = useState(0)
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null)
    const [confirmationResult, setConfirmationResult] = useState(null)
    const [isPending, startTransition] =  useTransition();
    const [color, setColor] = useState("#4f47e6");
    let [loading, setLoading] = useState(false);
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "#4f47e6",
      };
      

    useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible",
            }
        )

        setRecaptchaVerifier(recaptchaVerifier);
         return () => {
            recaptchaVerifier.clear()
         }
    }, [auth])

    const requestOtp = async (e) => {
        e?.preventDefault()
        setResendCountdown(60)

        startTransition(async () => {
            setError("")
        })

        if(!recaptchaVerifier){
            return setError("RecaptchaVerifier is not initialized")
        }

        try {
           const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            recaptchaVerifier
           ) 
           setConfirmationResult(confirmationResult)
           setSuccess("OTP sent successfully")
        } catch (err) {
            console.log(err)
            setResendCountdown(0)
        
            if (err.code === "auth/invalid/phone-number"){
                setError("Invalid phone number. Please check the number")
            }else if (err.code === "auth/too-many-requests"){
                setError("Too many requests. Please try again later")
            }else{
                setError("Failed to send OTP. Please try again later")
            }
        }

        
    }

  return (
    <div>
        {!confirmationResult && (
            <form onSubmit={requestOtp}>
                <Input 
                    className="text-black"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className='text-xs text-gray-400 mt-2'>
                    Please enter your number with the country code
                </p>
            </form>
        )}
        <Button
            disabled={!phoneNumber || isPending || resendCountdown > 0}
            onClick={() => requestOtp()}
            className="mt-5"
        >
            {resendCountdown > 0
                ? `Resend OTP in ${resendCountdown}`
                : isPending
                ? "Sending OTP"
                : "Send OTP"
            }
        </Button>
        <div className="">
            {error &&  <p className='text-red-500'>{error}</p>}
            {success &&  <p className='text-green-500'>{success}</p>}
            
        </div>
        {
            isPending &&
                (<div className="sweet-loading">
                    <ClipLoader
                        color="#43bfa4"
                        loading={loading}
                        cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>)
        }
        <div id='recaptcha-container' />
    </div>
  )
}

export default OtpLogin