import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WeatherBackground from '../appbg/WeatherBackground'
import { addTodayWeather } from '../../features/today/TodaySlice'

function findCurrentWeather(weatherData, dateHourString) { //DeepSeek
    try {
        const [inputDay, inputHour] = dateHourString.split(' ').map(Number);
        const targetHour = Math.floor(inputHour / 3) * 3;

        const exactSegment = weatherData.find(segment => {
            const [datePart, timePart] = segment.dt_txt.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [segmentHour] = timePart.split(':').map(Number);
            return day === inputDay && segmentHour === targetHour;
        });

        if (exactSegment) return exactSegment;

        for (const segment of weatherData) {
            const [datePart, timePart] = segment.dt_txt.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [segmentHour] = timePart.split(':').map(Number);

            if ((day === inputDay && segmentHour > targetHour) || day > inputDay) {
                return segment;
            }
        }
        return undefined;
    } catch (e) {
    }
}

export default function MainCard({ CardSwitch }) {
    const RawAPIData = useSelector(state => state.WeatherAPIdata.value)

    const [RawWeatherData, setRawWeatherData] = useState('')
    const [CurrentTime, setCurrentTime] = useState('')

    async function getCurrentTimeAPI(lat, lon) {
        try {
            const timeResponse = await fetch(
                `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`
            );
            const timeData = await timeResponse.json();
            if (timeData.dateTime) {
                setCurrentTime(timeData.day + ' ' + timeData.hour)
            } else {
            }
        } catch (error) {
        }
    }

async function loadRawData() {
    try {
        const Data = await RawAPIData
        const lat = Data.city.coord.lat
        const lon = Data.city.coord.lon
        await getCurrentTimeAPI(lat, lon)
        setRawWeatherData(Data)
    } catch (error) {
    }
}

    loadRawData()
    useEffect(() => {
        loadRawData()
    }, [RawAPIData])

    const [AllWeather, setAllWeather] = useState('');
    const [currentWeatherData, setCurrentWeatherData] = useState('');

    useEffect(() => {
        try {
            setAllWeather(RawWeatherData.list);
        } catch (e) {
        }
    }, [RawWeatherData, AllWeather])

    useEffect(() => {
        setCurrentWeatherData(findCurrentWeather(AllWeather, CurrentTime));
    }, [AllWeather, CurrentTime])

    const [Location, setLocation] = useState('--');
    const [Temp, setTemp] = useState('--');
    const [Weatherdsc, setWeatherdsc] = useState('--');
    const [MaxTemp, setMaxTemp] = useState('--');
    const [MinTemp, setMinTemp] = useState('--');
    const [Icon, setIcon] = useState('--');
    const [Feels, setFeels] = useState('--');
    const [Humidity, setHumidity] = useState('--');
    const [Time, setTime] = useState('');
    const [mainDesc, setmainDesc] = useState('');

    const Dispatch = useDispatch();

    useEffect(() => {
        try {
            setLocation(RawWeatherData.city.name);
            setTemp(Math.round(currentWeatherData.main.temp))
            setWeatherdsc(currentWeatherData.weather[0].description)
            setMaxTemp(Math.round(currentWeatherData.main.temp_max))
            setMinTemp(Math.round(currentWeatherData.main.temp_min))
            setIcon(currentWeatherData.weather[0].icon)
            setFeels(Math.round(currentWeatherData.main.feels_like))
            setHumidity(currentWeatherData.main.humidity)
            setTime(currentWeatherData.dt_txt);
            setmainDesc(currentWeatherData.weather[0].main);
            Dispatch(addTodayWeather({ data: AllWeather, currentDayHour: CurrentTime }))

        } catch (e) {
            setCurrentWeatherData(findCurrentWeather(AllWeather, CurrentTime));
        }
    }, [currentWeatherData])

    useEffect(() => {
        if (Temp != '--') {
            CardSwitch(false)
        }
    }, [Temp])

    return (
        <div>
            <WeatherBackground
                time={Time}
                description={mainDesc}
                temp={Temp}
            />

            <div className='
        rounded-[30px] bg-[rgba(107,107,107,0.22)] p-4
        '>
                <div className=''>
                    <div className='flex justify-center items-center text-4xl font-medium font-sans text-gray-200'>
                        <h1>{Location}</h1>
                    </div>
                    <div className='flex justify-center '>
                        <div className='flex justify-center items-center py-6 w-[70%]'>
                            <p className='font-thin text-8xl'>{Temp}&deg;C</p>
                        </div>
                        <div className='w-[30%]  '>
                            <p className='font-bold m-1'>{Weatherdsc}</p>
                            <div className='w-[100%] flex justify-center items-center   h-[70%]'>
                                <div>
                                    <div className='flex m-1   items-center'>
                                        <p className='font-bold mx-2'>Max:</p><p className='font-medium '>{MaxTemp}&deg;C</p>
                                    </div>
                                    <div className='flex m-1   items-center'>
                                        <p className='font-bold mx-2'>Min:</p><p className='font-medium '>{MinTemp}&deg;C</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-center items-center'>
                            <img
                                className='h-50'
                                src={`https://openweathermap.org/img/wn/${Icon}@2x.png`} alt="icon" />
                        </div>
                    </div>
                    <div className=' flex justify-center items-center p-4'>
                        <div className='w-[50%]  flex justify-center items-center p-4'>
                            <div className='font-thin text-center'>
                                <p className='text-6xl font-light '>{Feels}&deg;C</p>
                                <p className='text-xl'>Feels Like</p>
                            </div>
                        </div>
                        <div className='w-[50%]  flex justify-center items-center p-4'>
                            <div className='font-thin text-center'>
                                <p className='text-6xl font-light '>{Humidity}%</p>
                                <p className='text-xl'>Humidity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
