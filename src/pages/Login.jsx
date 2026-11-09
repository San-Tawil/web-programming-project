
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container.jsx';
import volunteerPhoto from '../assets/photos/volunteers-packing-donations.webp';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/brand/aidconnect-logo.webp';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        // For later
    }

    return (
        <section className="py-12 md:py-16">
            <Container>
                <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:grid-cols-2 dark:border-[#3b5044] dark:bg-[#1a2a21]">
                    {/*Left side*/}
                    <div className="flex flex-col gap-5 bg-aid-footer p-6 text-white sm:p-8 md:p-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-200 dark:bg-lime-100">
                            <img
                                src={logo}
                                alt="AidConnect logo"
                                className="h-9 w-9 rounded-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <h1 className="font-display text-3xl font-bold">
                            Make a difference, together.
                        </h1>
                        <p className="text-white/80">
                            Connect with meaningful volunteering opportunities
                            and be part of something bigger.
                        </p>
                        <img
                            src={volunteerPhoto}
                            alt="Volunteers preparing donations"
                            className="mt-auto h-64 w-full rounded-2xl object-cover md:h-72"
                        />
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                        <h2 className="font-display text-2xl font-bold text-aid-footer dark:text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                            Log in to your AidConnect account.
                        </p>
                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium dark:text-[#e6efe8]"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-aid-primary dark:border-[#3b5044] dark:bg-[#101a15] dark:text-[#e6efe8] dark:placeholder:text-[#b4c6bb]"
                                />
                            </div>
                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium dark:text-[#e6efe8]"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 pr-20 outline-none focus:border-aid-primary dark:border-[#3b5044] dark:bg-[#101a15] dark:text-[#e6efe8] dark:placeholder:text-[#b4c6bb]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute inset-y-0 right-4 flex items-center justify-center !border-0 !bg-transparent !p-0 !shadow-none cursor-pointer text-gray-500 hover:text-aid-primary dark:text-[#b4c6bb] dark:hover:text-lime-400"
                                    >
                                        {showPassword
                                            ? <EyeOff size={20} />
                                            : <Eye size={20} />
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 cursor-pointer accent-aid-primary"
                                    />
                                    Remember me
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-aid-primary hover:underline dark:text-lime-400"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            {/* Login button */}
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-aid-primary py-3 font-semibold text-white transition hover:opacity-90 cursor-pointer"
                            >
                                Log in
                            </button>
                        </form>

                        {/* Register */}
                        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-aid-primary hover:underline dark:text-lime-400"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
