import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Subsection() {
    return (
        <div className='bg-primary flex justify-center px-4 py-4 md:px-20 md:py-10'>
            <div className='w-full max-w-xl'>
                <h2 className='text-2xl font-semibold text-white text-center'>Employment - Online Application Form</h2>
                <div className='mt-4 bg-white px-4 pt-4 md:pb-10 md:px-10 rounded-[20px] max-w-[535px] mx-auto'>
                    <div className='text-primary my-4'>
                        <p className='md:text-lg'>Unlock Your Potential. Join Our Team Today! :</p>
                        <p className='mt-5 md:text-lg max-w-[453px] mb-6'>Discover a fulfilling career opportunity that values collaboration and efficiency. Applying for your dream job has never been easier—experience the seamless process with us. Embrace a workspace that empowers you to thrive. Apply now and be part of our dynamic team!</p>
                    </div>
                </div>
                <div className='py-6 flex justify-center'>
                    <Link href={'#form'}>
                        <Button variant={'ghost'} className='text-white'>Click here to apply</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
