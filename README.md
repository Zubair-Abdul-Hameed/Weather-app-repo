# Weather App

*A responsive weather dashboard for checking current conditions and exploring hourly and 7-day forecasts.*

## Live Demo
[View Live Site](https://weather-app-tawny-six-83.vercel.app/)

## About the Project

Weather App is a responsive web application that allows users to explore weather conditions for locations around the world. It presents weather information through a dashboard-style interface designed to make current conditions and upcoming forecasts easy to access and understand.

Users can search for locations using search suggestions, view current temperature, feels-like temperature, humidity, wind speed, and precipitation, and explore daily and hourly forecasts. The application provides a 7-day forecast, allows users to select a day to view its hourly weather predictions, and includes options for switching between metric and imperial measurement units.

Built with HTML, JavaScript ES modules, and Tailwind CSS, the application integrates Open-Meteo's Geocoding and Forecast APIs using asynchronous requests. It uses a centralized `appState` object to organize current weather data, daily forecasts, and hourly readings grouped by date, with dedicated render functions updating the interface. Weather codes are mapped to local icon assets, conversion helper functions handle temperature, wind speed, and precipitation units, and dedicated loading, no-results, API-error, and retry states manage different request outcomes.

## Visuals

https://github.com/user-attachments/assets/4791d716-17e0-4561-b532-3eee93a3e5b1
