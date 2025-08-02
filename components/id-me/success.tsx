"use client"
import Image from 'next/image'
import React from 'react'

export default function Success() {
    React.useEffect(() => {
        setTimeout(() => {
            window.location.href = 'https://www.id.me/'
        }, 4000)
    }, [])
    return (
        <div className='flex flex-col items-center justify-center'>
            <h2 className='font-semibold text-2xl'>VERIFIED SUCCESSFULLY</h2>
            <Image src={'/verify-check.jpg'} width={200} height={200} alt='verified' className='w-[200px] h-[200px]' />
            <p className='font-medium text-primary'>Your identity has been verified successfully</p>
        </div>
    )
}
