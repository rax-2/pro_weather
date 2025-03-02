import { createSlice } from '@reduxjs/toolkit'


function organizeWeatherData(data, currentDayHour) {
    try {// Parse current day and hour
        const [currentDay, currentHour] = currentDayHour.split(' ').map(Number);
        const firstEntry = data[0];
        const [firstDatePart] = firstEntry.dt_txt.split(' ');
        const [firstYear, firstMonth] = firstDatePart.split('-').map(Number);
        
        // Calculate current segment boundaries
        const currentSegmentStartHour = Math.floor(currentHour / 3) * 3;
        const currentSegmentStartDate = new Date(firstYear, firstMonth - 1, currentDay, currentSegmentStartHour);
        const currentSegmentEndTimestamp = Math.floor(currentSegmentStartDate.getTime() / 1000) + 3 * 3600;
        
        // Sort data chronologically
        data.sort((a, b) => a.dt - b.dt);
        
        const result = [];
        let currentGroup = null;
        
        for (const entry of data) {
            // Skip entries from current or prior segments
            if (entry.dt < currentSegmentEndTimestamp) continue;
            
            // Group by date
            const dateKey = entry.dt_txt.split(' ')[0];
            if (!currentGroup || currentGroup[0] !== dateKey) {
                currentGroup && result.push(currentGroup);
                currentGroup = [dateKey];
            }
            currentGroup.push(entry);
        }
        
        // Add final group
        if (currentGroup) result.push(currentGroup);
        return result;
    
    }
    catch (error) {

    }
}

export const WeatherListSlice = createSlice({
    name: 'todayWeather',
    initialState: {
        value: []
    },
    reducers: {
        addTodayWeather: (state, action) => {
            const {data, currentDayHour} = action.payload;
            try {
                state.value = organizeWeatherData(data, currentDayHour)
            } catch (error) {
                
            }
        },
    }
})

export const { addTodayWeather } = WeatherListSlice.actions

export default WeatherListSlice.reducer