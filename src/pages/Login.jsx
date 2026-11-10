
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/Container.jsx';

import { findAccount, matchesPassword } from '../data/mockAccounts.js';
import { useDashboardDemo } from '../context/DashboardDemoContext.jsx';
import volunteerPhoto from '../assets/photos/community-gardening.webp';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/brand/aidconnect-logo.webp';

const rememberedEmailKey = 'aidconnect-remembered-email';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;
    const { selectAccount } = useDashboardDemo();

    const [email, setEmail] = useState(
        () => localStorage.getItem(rememberedEmailKey) || ''
    );
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(
        () => localStorage.getItem(rememberedEmailKey) !== null
    );
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

            if (rememberMe) {
                localStorage.setItem(rememberedEmailKey, account.email);
            } else {
                localStorage.removeItem(rememberedEmailKey);
            }

            selectAccount(account, rememberMe);

            const destination =
                account.role === 'volunteer' &&
                from === '/volunteer/dashboard?section=find-shifts'
                    ? from
                    : `/${account.role}/dashboard`;

            navigate(destination, { replace: true });
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
                    {/* Left side */}
                    <div className="flex flex-col gap-5 bg-(--nav-panel) p-6 sm:p-8 md:p-10">
                        <div className="flex items-center gap-2 font-bold">
                            <img
                                src={logo}
                                alt="AidConnect logo"
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
                                    aria-invalid={loginError === 'missing-account'}
                                    aria-describedby={
                                        loginError === 'missing-account'
                                            ? 'email-error'
                                            : undefined
                                    }
                                    className={`w-full rounded-xl border bg-(--bg) px-4 py-3 text-(--text) placeholder:text-(--muted) focus:outline-2 focus:outline-(--primary) ${
                                        loginError === 'missing-account'
                                            ? 'border-rose-800/60 dark:border-rose-300/60'
                                            : 'border-(--line)'
                                    }`}
                                />

                                {loginError === 'missing-account' && (
                                    <p
                                        id="email-error"
                                        role="alert"
                                        className="mt-1 mb-0 text-sm text-rose-800 dark:text-rose-300"
                                    >
                                        No account uses this email. Please check your email or{' '}
                                        <Link
                                            to="/register"
                                            className="font-semibold text-(--primary) underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:decoration-current"
                                        >
                                            register
                                        </Link>
                                    </p>
                                )}
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
                                        aria-invalid={loginError === 'wrong-password'}
                                        aria-describedby={
                                            loginError === 'wrong-password'
                                                ? 'password-error'
                                                : undefined
                                        }
                                        className={`w-full rounded-xl border bg-(--bg) px-4 py-3 pr-14 text-(--text) placeholder:text-(--muted) focus:outline-2 focus:outline-(--primary) ${
                                            loginError === 'wrong-password'
                                                ? 'border-rose-800/60 dark:border-rose-300/60'
                                                : 'border-(--line)'
                                        }`}
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

                                {loginError === 'wrong-password' && (
                                    <p
                                        id="password-error"
                                        role="alert"
                                        className="mt-1 mb-0 text-sm text-rose-800 dark:text-rose-300"
                                    >
                                        That password is incorrect. Please try again.
                                    </p>
                                )}
                            </div>

                            {/* Remember me and Forgot password */}
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
                                <details className="text-sm text-(--muted)">
                                    <summary className="cursor-pointer text-(--primary) underline">Forgot password?</summary>
                                    <p>This browser-only demo has no password reset. You can create another demo account.</p>
                                </details>
                            </div>

                            {loginError === 'unavailable' && (
                                <p
                                    role="alert"
                                    className="m-0 text-sm text-rose-800 dark:text-rose-300"
                                >
                                    Your account could not be checked in this browser. Please try again.
                                </p>
                            )}

                            {/* Login button */}
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
                                to="/register"
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
