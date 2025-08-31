const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const getCurrentWeather = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status == 404) {
        throw new Error(
          `city ${city} not found, please check spelling and try again`
        );
      } else if (response.status == 401) {
        throw new Error(
          `Invalid API Key, please check your OpenWeatherMap API configuration`
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please Try Again Later."
        );
      }
    }

    const data = await response.json();

    // ensure we have the current timpstamp if not provided
    if (!data.dt) {
      data.dt = Math.floor(Date.now() / 1000);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network Error, Please check your internet connection and try again`
      );
    }
    throw error;
  }
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status == 401) {
        throw new Error(
          `Invalid API Key, please check your OpenWeatherMap API configuration`
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please Try Again Later."
        );
      }
    }

    const data = await response.json();

    // ensure we have the current timpstamp if not provided
    if (!data.dt) {
      data.dt = Math.floor(Date.now() / 1000);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network Error, Please check your internet connection and try again`
      );
    }
    throw error;
  }
};

export const getWeatherForecast = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status == 404) {
        throw new Error(
          `city ${city} not found, please check spelling and try again`
        );
      } else if (response.status == 401) {
        throw new Error(
          `Invalid API Key, please check your OpenWeatherMap API configuration`
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please Try Again Later."
        );
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network Error, Please check your internet connection and try again`
      );
    }
    throw error;
  }
};

export const searchCities = async (query) => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status == 401) {
        throw new Error(
          `Invalid API Key, please check your OpenWeatherMap API configuration`
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please Try Again Later."
        );
      }
    }

    const data = await response.json();

    //transforming the geocoding api response to match expected
    return data.map((city) => ({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state || "",
    }));
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network Error, Please check your internet connection and try again`
      );
    }
    throw error;
  }
};
