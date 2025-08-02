import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import React from 'react'

export const metadata: Metadata = {
    title: "Sign in to ID.me - ID.me",
};

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ['400', '500', '600', '700', '800']
});

export default function IdMeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`min-h-screen bg-[#dfdfdf] flex flex-col items-center pb-20 ${poppins.variable}`} style={{ fontFamily: 'var(--font-poppins)' }}>
            <div className="flex items-center gap-4 w-full bg-white justify-center pt-10 pb-16">
                <Image
                    src={'/id-me-logo.svg'}
                    width={80}
                    height={28}
                    alt='ID.me logo'
                    className="h-7"
                />
                <Plus />
                <Image
                    src={'/IRS-Logo.svg'}
                    width={80}
                    height={28}
                    alt='IRS logo'
                    className="h-7"
                />
            </div>
            <div className="w-full max-w-[475px] py-8 lg:px-8 bg-white shadow-2xl rounded-lg sm:px-10 -mt-5">
                <div className="">
                    {children}
                </div>
            </div>
            <div className='flex justify-center text-sm text-[#1f5db6] mt-3'>
                <div className='border-r-2 underline font-medium border-[#2e3f51] px-3'>
                    What is ID.me?
                </div>
                <div className='border-r-2 underline font-medium border-[#2e3f51] px-3'>
                    Terms of Service
                </div>
                <div className='border-r-2 underline font-medium border-[#2e3f51] px-3'>
                    Privacy Policy
                </div>
            </div>
        </div>
    );
}