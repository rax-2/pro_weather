import { configureStore } from '@reduxjs/toolkit'
import weatherslice from '../features/weather/WeatherSlice'
import WeatherListSlice  from '../features/today/TodaySlice'
export default configureStore({
  reducer: {
    weatherList :WeatherListSlice,
    WeatherAPIdata: weatherslice,

  }
})
