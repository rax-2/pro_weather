import { createSlice } from '@reduxjs/toolkit'

async function getDataFromWeatherAPI(params) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${params}&appid=${import.meta.env.VITE_API_OPENWEATHER}&units=metric
        `)
    try {
        if (response.status == 200) {
            localStorage.setItem('location', params)
            return await response.json()
        }else{
            console.log('prblm');
            return '798'
        }
    } catch (e) {
        console.log('Data paowa jaini');
    }
}

function loadInitLocation() {
    let Location 
    try {
        if (localStorage.getItem('location')) {
            Location = localStorage.getItem('location')
        } else {
            Location = 'kalna'
        }
    } catch(e) {
    }
    return Location
}


export const WeatherSlice = createSlice({
    name: 'WeatherAPIdata',
    initialState: {
        value: getDataFromWeatherAPI(loadInitLocation())
    },
    reducers: {
        search: (state, action) => {
            state.value = getDataFromWeatherAPI(action.payload)
        },
    }
})

export const {search } = WeatherSlice.actions

export default WeatherSlice.reducer