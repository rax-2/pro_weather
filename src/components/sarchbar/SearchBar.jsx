import React, { useRef, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { search } from '../../features/weather/WeatherSlice';

export default function SearchBar({ CardSwitch }) {
    const Dispatch = useDispatch()
    const [usrinpt, setuserinpt] = useState('')
    const buttonRef = useRef(null);
    const inputRef = useRef(null);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            buttonRef.current.click(); // Trigger button click
        }
    };
    return (
        <div className=''>
            <div className='flex justify-center'>
                <div
                    className='flex  
                justify-center
                w-[100%] 
                text-1xl 
                rounded-[50px] 
                bg-[rgba(107,107,107,0.22)] text-white
                '
                >
                    <input required type="text" name="" id="SearchBar1" className=' w-[90%] border-none outline-none h-12 px-4  
                    rounded-l-[50px]  '
                        value={usrinpt}
                        ref={inputRef}
                        placeholder='Search Location '
                        onChange={e => {
                            setuserinpt(e.target.value)
                        }}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        ref={buttonRef}
                        className='w-[10%] flex justify-center items-center text-xl rounded-r-[50px] bg-[#ffffff14] cursor-pointer '
                        onClick={e => {
                            CardSwitch(true)
                            try {
                                Dispatch(search(usrinpt))
                                setuserinpt('')
                                inputRef.current.blur(); 
                            } catch { }
                        }}>
                        <FaSearch />
                    </button>
                </div>
            </div>
        </div>
    )
}
