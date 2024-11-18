import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DropDownAnswers = () => {

    const navigate = useNavigate()

    const CompaniesPicker = (e) => (
        navigate('/picker')
    )

    return (
        <div className='flex flex-col mx-auto DropdownAnswers'>
            <ul className='flex flex-col gap-4 text-gray-600'>
                <li className='cursor-pointer link' onClick={() => CompaniesPicker()} >1</li>
                <li className='cursor-pointer link' onClick={() => CompaniesPicker()} >2</li>
                <li className='cursor-pointer link' onClick={() => CompaniesPicker()} >3</li>
                <li className='cursor-pointer link' onClick={() => CompaniesPicker()} >4</li>
                <li className='cursor-pointer link' onClick={() => CompaniesPicker()} >5</li>
            </ul>
        </div>
    )
}

export default DropDownAnswers