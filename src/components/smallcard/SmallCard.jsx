import React from 'react'

export default function SmallCard({ Data }) {
  function getTimeAMPM(dateTimeStr) {
    // Split the input into date and time parts
    const [datePart, timePart] = dateTimeStr.split(' ');
    if (!datePart || !timePart) {
      throw new Error('Invalid date-time format');
    }

    // Parse date components
    const [year, month, day] = datePart.split('-').map(Number);
    // Parse time components
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    // Create a Date object in local time
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date-time value');
    }

    const h = date.getHours();
    const ampm = h >= 12 ? 'pm' : 'am';
    let twelveHour = h % 12;
    twelveHour = twelveHour === 0 ? 12 : twelveHour; // Convert 0 to 12

    return `${twelveHour}${ampm}`;
  }

  return (
    <div className=' m-2 w-40 p-1'>
      <div className=' ml-2'>
        <p>
          {getTimeAMPM(Data.dt_txt)}
        </p>
      </div>
      <div className='flex justify-center items-center'>
        <img className=''
          src={`https://openweathermap.org/img/wn/${Data.weather[0].icon}@2x.png`} alt="icon" />
      </div>

      <div className=' text-center text-lg font-bold'>
        <p>
          {Math.round(Data.main.temp)}&deg;C
        </p>
        <p>
          {Data.weather[0].description}
        </p>
      </div>
    </div>
  )
}
