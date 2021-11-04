import React, { useRef } from "react";
import './Weather.css';
import { useForm} from "react-hook-form";

const daysOfWeek =[
    {
        value: 1,
        day: 'Poniedziałek'
    },
    {
        value: 2,
        day: 'Wtorek'
    },
    {
        value: 3,
        day: 'Środa'
    },
    {
        value: 4,
        day: 'Czwartek'
    },
    {
        value: 5,
        day: 'Piątek'
    },
    {
        value: 6,
        day: 'Sobota'
    },
    {
        value: 7,
        day: 'Niedziela'
    },
];

const Weather = ({data1, data2, cityStateSetter}) => {
    let backgroundStyle = {
        backgroundImage: undefined,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      };
    const dataOne = data1;
    const dataTwo = data2;
    let content = null;
    console.log(dataOne);
    console.log(dataTwo);

    const now = new Date();
    const day = now.getDay(); 
    const date = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`;
    const dayName = daysOfWeek.find(el => el.value === day).day;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    const {register, handleSubmit} = useForm();

    const childCity = useRef();

    const onSubmit = formData =>{
        cityStateSetter(formData.city)     
   }

    if(dataOne.cod !== 400 && dataTwo.length!=0){
        const nowDateTwo = dataTwo.days[0].hours.find(el => el.datetime === `${now.getHours()}:00:00`);
        console.log(nowDateTwo);


        const sunriseOne = dataOne.sys.sunrise;
        const sunsetOne = dataOne.sys.sunset;

        const sunriseTwo = dataTwo.currentConditions.sunriseEpoch;
        const sunsetTwo = dataTwo.currentConditions.sunsetEpoch;

        let sunrise = (sunriseOne + sunriseTwo)/2;
        sunrise = sunrise.toFixed(0);

        let sunset = (sunsetOne + sunsetTwo)/2;
        sunset = sunset.toFixed(0);
        
        const sunriseTime = new Date(sunrise* 1000).toLocaleTimeString();
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();
    
        const tempTwo = (nowDateTwo.temp - 32)*(5/9);
        let temp = (dataOne.main.temp + tempTwo )/2;
        temp = temp.toFixed(2);

        let humidity = (dataOne.main.humidity + nowDateTwo.humidity)/2;
        humidity = humidity.toFixed(2);

        let visibility = (dataOne.visibility/1000 + nowDateTwo.visibility)/2;
        visibility = visibility.toFixed(2);

        let cloudcover =(dataOne.clouds.all + nowDateTwo.cloudcover)/2
        cloudcover = cloudcover.toFixed(0);

        if(dataOne.weather[0].description.includes('clear') && cloudcover==0){
            backgroundStyle.backgroundImage = "url(/sunny_clear_sky.jpg)";
        }
        if(dataOne.weather[0].description.includes('clear') && cloudcover>0){
            backgroundStyle.backgroundImage = "url(/sunny.jpg)";
        }
        else if(dataOne.weather[0].description.includes('rain')){
            backgroundStyle.backgroundImage = "url(/rainy.jpg)";
        }
        else if(dataOne.weather[0].description.includes('clouds')){
            backgroundStyle.backgroundImage = "url(/cloudy.jpg)";
        }
        else if(dataOne.weather[0].description.includes('snow')){
            backgroundStyle.backgroundImage = "url(/snow.jpg)";
        }
        else if(dataOne.weather[0].description.includes('storm')){
            backgroundStyle.backgroundImage = "url(/storm.jfif)";
        }

    
        if(now.getHours()>=20){
            backgroundStyle.backgroundImage = "url(/night2.jpg)";
        }

        
        content = (
            <div className="main">
                <h3 className="header" >Miasto <em>{dataOne.name}</em></h3>
                <div className="section"> 
                    <div className="flex">
                        <p className="day">Dzień: {dayName} </p>
                        <p className="date">{time}, {date}</p>
                    </div>
                    <div className="flex">
                        <p className="temp">Aktualna temperatura: {temp} &#176;C</p>
                        <p className="humidity">Wilgotność: {humidity} %</p>
                    </div>
                    <div className="flex">
                        <p className="temp">Zachmurzenie: {cloudcover} %</p>
                        <p className="humidity">Przejrzystość: {visibility} km</p>
                    </div>
                    <div className="flex">
                        <p className="sunrise">Wschód słońca: {sunriseTime}</p>
                        <p className="sunrise">Zachód słońca: {sunsetTime}</p>
                    </div>
                    <div className="flex">
                        <p className="description">Opis: {dataOne.weather[0].description}</p>
                    </div> 
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className="city-input"
                        name="city"
                        placeholder="Wpisz wybrane miasto"
                        ref={childCity}
                        {...register("city")}
                    ></input>
                </form>
            </div>
        )
    }
    
    return(
        <div className="weather" style={backgroundStyle}>
            {dataOne.cod == 400 || dataTwo.length == 0 ? `Nie udało sie pobrac pogody` : content}
        </div>
    );
}
export default Weather;