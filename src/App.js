import './App.css';
import React, { useEffect, useState, useCallback } from "react";
import Weather from './components/Weather';

export default function App() {

  const REACT_APP_API_URL1 = 'https://api.openweathermap.org/data/2.5';
  const REACT_APP_API_KEY1 = '4499d829dd3c44933faa8e77541376de';

  const REACT_APP_API_URL2 = 'https://weather.visualcrossing.com/VisualCrossingWebServices';
  const REACT_APP_API_KEY2 = 'TC86C5G47QV3FN976APULXE6V';

  //const REACT_APP_API_URL2 = 'http://api.worldweatheronline.com/premium/v1';
  //const REACT_APP_API_KEY2 = '44664dbe89b0459fa53104024212910';


  //const REACT_APP_ICON_URL = 'https://openweathermap.org/img/w'
  
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [city, setCity] = useState('');

  const updateCity = (e) =>{
    console.log('city',e);
  }

  const wrapperSetCity = useCallback(val => {
    setCity(val);
    console.log(val)
  }, [setCity]);

  useEffect(() => {
      const fetchData = async () => {
        navigator.geolocation.getCurrentPosition(function(position) {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        });
    
        console.log("Latitude is:", lat);
        console.log("Longitude is:", long);

        const API1 = `${REACT_APP_API_URL1}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${REACT_APP_API_KEY1}`;
        const API2 =`${REACT_APP_API_URL2}/rest/services/timeline/${lat},${long}/today/?unitGroup=us&key=${REACT_APP_API_KEY2}`
        //const API2 =`${REACT_APP_API_URL2}/weather.ashx?key=${REACT_APP_API_KEY2}&q=${lat},${long}&num_of_days=1&t&format=json`
        console.log(API1);

        console.log(API2);
        try{
          await Promise.all([
            fetch(API1).then(response => response.json())
            .then(result => {
              setData1(result)
            }),
            fetch(API2).then(response => response.json())
            .then(result => {
              setData2(result)
            }),
          ]);
        } catch(err){
          console.log(err);
        }
      }
      fetchData();
  }, [lat,long]);
  
  return (
    <div className="App">
      {(typeof data1.main !== 'undefined' && typeof data2.days !== 'undefined') ? (
        <Weather className="weather" data1={data1} data2={data2} city={city}
        cityStateSetter={wrapperSetCity}/>
      ): (
        <div></div>
      )}   
    </div>
  );
}
