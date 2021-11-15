import './App.css';
import React, { useEffect, useState, useCallback } from "react";
import Weather from './components/Weather';

export default function App() {

  const REACT_APP_API_URL1 = 'https://api.openweathermap.org/data/2.5';
  const REACT_APP_API_KEY1 = '4499d829dd3c44933faa8e77541376de';

  const REACT_APP_API_URL2 = 'https://weather.visualcrossing.com/VisualCrossingWebServices';
  const REACT_APP_API_KEY2 = 'TC86C5G47QV3FN976APULXE6V';

  const REACT_APP_API_URL3 = 'http://dataservice.accuweather.com';
  const REACT_APP_API_KEY3 = 'viy1q3cmEW0s54AwffJ1NEPJoswG2xxG';
    
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [city, setCity] = useState('');

  const wrapperSetCity = useCallback(val => {
    setCity(val);
    const API1 = `${REACT_APP_API_URL1}/weather/?q=${val}&units=metric&APPID=${REACT_APP_API_KEY1}`;
    const API2 =`${REACT_APP_API_URL2}/rest/services/timeline/${val}/today/?unitGroup=us&key=${REACT_APP_API_KEY2}`
    const APIFORID =`${REACT_APP_API_URL3}/locations/v1/cities/autocomplete?apikey=${REACT_APP_API_KEY3}&q=${val}`;

    fetch(API1).then(response => response.json())
      .then(result => {
        setData1(result)
      });
    
    fetch(API2).then(response => response.json())
      .then(result => {
        setData2(result)
      });    

    fetch(APIFORID).then(response => response.json())
      .then(result => {
        const cityID=parseInt(result[0].Key);
        fetch(`${REACT_APP_API_URL3}/forecasts/v1/hourly/1hour/${cityID}?apikey=${REACT_APP_API_KEY3}&language=en&details=true&metric=true`).then(response => response.json())
          .then(result => {
            setData3(result);
          });
      });        
  }, [setCity]);

  useEffect(() => {
      const fetchData = async () => {
        navigator.geolocation.getCurrentPosition(function(position) {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        });

        const API1 = `${REACT_APP_API_URL1}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${REACT_APP_API_KEY1}`;
        const API2 =`${REACT_APP_API_URL2}/rest/services/timeline/${lat},${long}/today/?unitGroup=us&key=${REACT_APP_API_KEY2}`;
        const API3 =`${REACT_APP_API_URL3}/locations/v1/cities/geoposition/search?apikey=${REACT_APP_API_KEY3}&q=${lat},${long}&language=en&details=true`;

        try{
          await Promise.all([
            fetch(API1).then(response => response.json())
            .then(result => {
              setData1(result);
            }),
            fetch(API2).then(response => response.json())
            .then(result => {
              setData2(result);
            }),
            fetch(API3).then(response => response.json())
              .then(result => {
                const cityID=parseInt(result.Details.Key);
                fetch(`${REACT_APP_API_URL3}/forecasts/v1/hourly/1hour/${cityID}?apikey=${REACT_APP_API_KEY3}&language=en&details=true&metric=true`).then(response => response.json())
                  .then(result => {
                    setData3(result);
                  });
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
      {(typeof data1.main !== 'undefined' && typeof data2.days !== 'undefined' && data3!== 'undefined') ? (
        <Weather className="weather" data1={data1} data2={data2} data3={data3} city={city}
        cityStateSetter={wrapperSetCity}/>
      ): (
        <div></div>
      )}   
    </div>
  );
}
