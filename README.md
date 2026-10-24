# Weather App

*A responsive weather dashboard for checking current conditions and exploring hourly and 7-day forecasts.*

## Live Demo
[View Live Site](https://weather-app-tawny-six-83.vercel.app/)

## About the Project

Weather App is a responsive web application that allows users to explore weather conditions for locations around the world. It presents weather information through a dashboard-style interface designed to make current conditions and upcoming forecasts easy to access and understand.

Users can search for locations using search suggestions, view current temperature, feels-like temperature, humidity, wind speed, and precipitation, and explore daily and hourly forecasts. The application provides a 7-day forecast, allows users to select a day to view its hourly weather predictions, and includes options for switching between metric and imperial measurement units.

The application integrates Open-Meteo's Geocoding and Forecast APIs through asynchronous `fetch()` requests, retrieving weather data based on searched locations and their coordinates. A centralized `appState` object manages the application's data, including current conditions, forecasts, selected days, and measurement preferences. API responses are transformed into structured data, with hourly forecasts grouped by date to support day-specific forecast selection. Dedicated rendering functions dynamically update the dashboard, while a weather-code mapping connects API conditions to local icon assets. Finally, reusable unit-conversion helpers handle temperature, wind speed, and precipitation measurements, complemented by loading indicators, error handling, retry functionality, and no-results feedback for a more resilient user experience.

## Visuals

https://github.com/user-attachments/assets/4791d716-17e0-4561-b532-3eee93a3e5b1
