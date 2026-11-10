
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authDestination } from '../data/authDestination.js';
import Container from '../components/Container.jsx';
import { findAccount, matchesPassword } from '../data/mockAccounts.js';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import volunteerPhoto from '../assets/photos/community-gardening.webp';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/brand/aidconnect-logo.webp';

export default function Login() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { selectAccount } = useDashboardDemo();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [checking, setChecking] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (checking) return;
        const account = findAccount(email);

        if (!account) {
            setLoginError('missing-account');
            return;
        }
        setChecking(true);
        try {
            if (!await matchesPassword(account, password)) {
                setLoginError('wrong-password');
                return;
            }
            selectAccount(account);
            navigate(authDestination(account.role, state?.returnTo), { replace: true });
        } catch {
            setLoginError('unavailable');
        } finally {
            setChecking(false);
        }
    }

    return (
        <section className="py-12 md:py-16">
            <Container>
                <div className="grid overflow-hidden rounded-3xl border border-(--line) bg-(--panel) md:grid-cols-2">
                    {/*Left side*/}
                    <div className="flex flex-col gap-5 bg-(--nav-panel) p-6 sm:p-8 md:p-10">
                        <div className="flex items-center gap-2 font-bold">
                            <img
                                src={logo}
                                alt=""
                                width="28"
                                height="28"
                                className="size-7 shrink-0 rounded-full object-contain"
                            />
                            AidConnect
                        </div>
                        <h1 className="mb-0 font-display text-3xl font-bold">
                            Make a difference, together.
                        </h1>
                        <p className="mb-2 text-(--muted)">
                            Connect with meaningful volunteering opportunities
                            and be part of something bigger.
                        </p>
                        <img
                            src={volunteerPhoto}
                            alt="Neighbors working together on a community garden"
                            className="mt-auto aspect-video w-full rounded-2xl object-cover"
                        />
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                        <h2 className="mb-0 font-display text-2xl font-bold">
                            Welcome back
                        </h2>
                        <p className="mt-2 mb-0 text-sm text-(--muted)">
                            Log in to your AidConnect account.
                        </p>
                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setLoginError('');
                                    }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-(--line) bg-(--bg) px-4 py-3 text-(--text) placeholder:text-(--muted) focus:outline-2 focus:outline-(--primary)"
                                />
                            </div>
                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setLoginError('');
                                        }}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-(--line) bg-(--bg) px-4 py-3 pr-14 text-(--text) placeholder:text-(--muted) focus:outline-2 focus:outline-(--primary)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute inset-y-1 right-1 flex w-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-(--muted) shadow-none hover:text-(--primary) focus-visible:outline-2 focus-visible:outline-(--primary)"
                                    >
                                        {showPassword
                                            ? <EyeOff size={20} />
                                            : <Eye size={20} />
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-(--muted)">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 cursor-pointer accent-(--primary) dark:scheme-dark"
                                    />
                                    Remember me
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-(--primary) underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:decoration-current"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            {loginError && (
                                <p role="alert" className="mb-0 text-sm">
                                    {loginError === 'missing-account' ? (
                                        <>
                                            No demo account uses this email.{' '}
                                            <Link to="/register" state={state} className="font-semibold text-(--primary) underline underline-offset-4">
                                                Create an account
                                            </Link>
                                        </>
                                    ) : (
                                        loginError === 'wrong-password'
                                            ? 'That password is incorrect. Please try again.'
                                            : 'Your account could not be checked in this browser. Please try again.'
                                    )}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={checking}
                                className="w-full cursor-pointer rounded-xl border-0 bg-(--primary) py-3 font-semibold text-white shadow-none transition-colors hover:bg-(--primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:opacity-60 dark:text-(--bg)"
                            >
                                {checking ? 'Logging in…' : 'Log in'}
                            </button>
                        </form>

                        {/* Register */}
                        <p className="mt-6 mb-0 text-center text-sm text-(--muted)">
                            Don't have an account?{' '}
                            <Link
                                to="/register" state={state}
                                className="font-semibold text-(--primary) underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:decoration-current"
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
