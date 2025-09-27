import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [newPassword, setPassword] = useState('');

    const sendOtp = async () => {
        const res = await fetch('http://localhost:8000/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.message === 'sent') {
            toast.success('OTP sent successfully');
            setStep(2);
        } else {
            toast.error('OTP sending failed');
        }
    };

    const resetPassword = async () => {
        const res = await fetch('http://localhost:8000/verify-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword }),
        });
        const data = await res.json();
        if (data.message === 'password-reset-done') {
            toast.success('Password reset successful');
            setStep(1);
            setEmail('');
            setPassword('');
            setOtp('');
        } else {
            toast.error('Reset failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">Forgot Password</h3>

                {step === 1 ? (
                    <>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={sendOtp}
                            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-200"
                        >
                            Send OTP
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            value={otp}
                            placeholder="Enter OTP"
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            placeholder="Enter new password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={resetPassword}
                            className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition duration-200"
                        >
                            Reset Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgetPassword;
