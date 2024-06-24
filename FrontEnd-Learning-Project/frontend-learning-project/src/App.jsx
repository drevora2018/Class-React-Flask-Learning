import { useState } from "react";
import "./App.css";

function App() {
    const [Location, setLocation] = useState('');
    const [WeatherData, setWeatherData] = useState('');
    const [HourlyData, setHourlyData] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const daysPerPage = 3; // Number of days to show per page

    const HandleSubmit = async (e) => {
        e.preventDefault();
        const API = "b60cf266d5d748e3956132632242406";
        const URL = `http://api.weatherapi.com/v1/forecast.json?key=${API}&days=8&q=`;
        const response = await fetch(URL + Location);
        if (!response.ok) {
            throw new Error("Network not OK");
        }

        const data = await response.json();
        console.log(Location);
        console.log(data);
        setWeatherData(data);

        const hourlyDataByDay = data.forecast.forecastday.map(day => {
            return {
                date: day.date,
                hours: day.hour
            };
        });
        setHourlyData(hourlyDataByDay);

        console.log("HourlyData:", HourlyData);
    };

    const HandleInputChange = (e) => {
        setLocation(e.target.value);
    };

    const GenerateHourCards = () => {
        const start = pageIndex * daysPerPage;
        const end = start + daysPerPage;
        const visibleHourlyData = HourlyData.slice(start, end);

        const handleNextPage = () => {
            if ((pageIndex + 1) * daysPerPage < HourlyData.length) {
                setPageIndex(pageIndex + 1);
            }
        };

        const handlePrevPage = () => {
            if (pageIndex > 0) {
                setPageIndex(pageIndex - 1);
            }
        };

        return (

            <div className="DayCardsParent">
                <div className="PaginationButtons">
                    <button onClick={handlePrevPage} disabled={pageIndex === 0}>Previous</button>
                    <button onClick={handleNextPage} disabled={(pageIndex + 1) * daysPerPage >= HourlyData.length}>Next</button>
                </div>
            <div className="DayCards">
                {visibleHourlyData.map((day, index) => (
                    <div key={index} className="DailyForecast">
                        <h2 className="DayDatePerHour">{day.date}</h2>
                        {day.hours.map((hour, idx) => (
                            <div key={idx} className="HourlyParent">
                                <div className="HourlyInfo">
                                    <label>{hour.time}</label>
                                    <img src={hour.condition.icon} alt={hour.condition.text} />
                                    <label>{hour.condition.text}</label>
                                    <label>{hour.temp_c}&deg; C</label>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                
            </div>
            <div className="PaginationButtons">
                    <button onClick={handlePrevPage} disabled={pageIndex === 0}>Previous</button>
                    <button onClick={handleNextPage} disabled={(pageIndex + 1) * daysPerPage >= HourlyData.length}>Next</button>
                </div>
            </div>
        );
    };

    return (
        <div className="AppMain">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <h1 className="NavBar">Welcome to the WeatherApp</h1>
            <form onSubmit={HandleSubmit} className="FormSearch">
                <input
                    className="LocationInput"
                    onChange={HandleInputChange}
                    value={Location}
                    placeholder="Search for your location"
                />
                <button type="submit">Go!</button>
            </form>

            {WeatherData && (
                <div className="ForeCastParent">
                    <div className="WeatherConditionBox">
                        <label>{WeatherData.current.last_updated}</label>
                        <img src={WeatherData.current.condition.icon} alt="Weather Icon" />
                        <label>{WeatherData.current.condition.text}</label>
                        <br />
                        <label>Currently: {WeatherData.current.temp_c}&deg; C</label>
                        <label>Feels like: {WeatherData.current.feelslike_c}&deg; C</label>
                    </div>
                </div>
            )}

            <GenerateHourCards />
        </div>
    );
}

export default App;
