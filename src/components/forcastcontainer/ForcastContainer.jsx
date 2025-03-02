import React from 'react'
import { useSelector } from 'react-redux';
import DayCard from '../daycard/DayCard';

export default function ForcastContainer() {
    const listofweather = useSelector(state => state.weatherList.value)
    return (
        <div className='flex  
    justify-center
    w-[100%] 
    text-1xl 
    rounded-[30px] 
    bg-[rgba(107,107,107,0.22)] text-white
    '><div className='w-[100%] p-2  ' >
                {
                    listofweather.map((e, index) => {
                        return (
                            <div className='bg-[rgba(107,107,107,0.22)] m-2 p-2 rounded-2xl ' key={index + 'b'} >
                                <DayCard Data={e} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
