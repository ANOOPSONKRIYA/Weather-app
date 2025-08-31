import { useState,useEffect } from "react";
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getWeatherForecast,
} from "../services/weatherAPI";

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnits] = useState("C");

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecast] = await Promise.all([
        getCurrentWeather(city),
        getWeatherForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecast);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await getCurrentWeatherByCoords(
            latitude,
            longitude
          );
          setCurrentWeather(weatherData);
          // its fetch forcast for the current loaction
          const forcastData = await getWeatherForecast(weatherData.name);
          setForecast(forcastData);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch weather data"
          );
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message ||"unable to retrive your location ");
        setLoading(false);
        
      }
    );
  };

  const toggleUnit = () => {
    setUnits(unit === "C" ? "F" : "C");
  };

  //loading default weather on mount
  useEffect(() => {
    fetchWeatherByCity("Jaipur");
  },[]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    toggleUnit,
  };
};
