import React from 'react'
import SmallCard from '../smallcard/SmallCard'

export default function DayCard({ Data }) {
    // console.log(Data[0]);
    function formatDateToOrdinal(dateStr) {
        const parts = dateStr.split('-');
        if (parts.length !== 3) {
            throw new Error('Invalid date format. Expected "YYYY-MM-DD".');
        }

        const [year, month, day] = parts.map(Number);
        const date = new Date(year, month - 1, day); // Month is 0-indexed in JS
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date value');
        }

        // Get ordinal suffix (st/nd/rd/th)
        const dayNumber = date.getDate();
        const suffixes = {
            1: 'st',
            2: 'nd',
            3: 'rd',
            21: 'st',
            22: 'nd',
            23: 'rd',
            31: 'st'
        };
        const suffix = suffixes[dayNumber] || 'th';

        // Get full month name
        const monthName = date.toLocaleString('en-US', { month: 'long' });

        return `${dayNumber}${suffix} ${monthName}`;
    }
    return (
        <>
            <div className='text-center font-semibold'>
                <p>
                    {
                        formatDateToOrdinal(Data[0])
                    }
                </p>
            </div>
            <div className='flex overflow-x-auto scrollbar-hidden-hover '>

                {
                    Data.map((e, index) => {
                        if (index == 0) {

                        } else {

                            return (
                                <div className='m-2 bg-[rgba(107,107,107,0.22)] rounded-xl' key={index + 'a'}>
                                    <SmallCard Data={e} />
                                </div>
                            )
                        }
                    })
                }
            </div>
        </>
    )
}
