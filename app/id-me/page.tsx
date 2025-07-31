import IDMEForm from '@/components/id-me/form';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react'

export const metadata: Metadata = {
  title: "Sign in to ID.me - ID.me",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#dfdfdf] flex flex-col items-center">
      <div className="flex w-full bg-white justify-center pt-10 pb-16">
        <Image
          src={'/id-me-logo.svg'}
          width={80}
          height={28}
          alt='ID.me logo'
          className="h-7"
        />
      </div>
      <div className="w-full max-w-[475px] sm:px-6 lg:px-8 shadow">

        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 -mt-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign in to ID.me
          </h1>

          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">
              New to ID.me?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Create an ID.me account
              </a>
            </p>
          </div>

          <IDMEForm />
        </div>
      </div>
    </div>
  );
}