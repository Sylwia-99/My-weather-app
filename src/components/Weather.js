import React, { useRef } from "react";
import './Weather.css';
import { useForm} from "react-hook-form";

const daysOfWeek =[
    {
        value: 0,
        day: 'Niedziela'
    },
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
    }
];

const Weather = ({data1, data2, data3, cityStateSetter}) => {
    let backgroundStyle = {
        backgroundImage: undefined,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      };
    const dataOne = data1;
    const dataTwo = data2;
    const dataThree = data3;
    let content = null;

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

    if(dataOne.cod !== 400 && dataTwo.length!=0 && dataThree.length!=0){
        const nowDateTwo = dataTwo.days[0].hours.find(el => el.datetime === `${now.getHours()}:00:00`);

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
    
        const tempTwo = (dataTwo.currentConditions.temp - 32)*(5/9);

        let temp = (dataOne.main.temp + tempTwo + dataThree[0].Temperature.Value )/3;
        temp = temp.toFixed(2);

        let humidity = (dataOne.main.humidity + dataTwo.currentConditions.humidity +dataThree[0].RelativeHumidity)/3;
        humidity = humidity.toFixed(2);

        let visibility = (dataOne.visibility/1000 + dataTwo.currentConditions.visibility + dataThree[0].Visibility.Value)/3;
        visibility = visibility.toFixed(2);

        let pressure = (dataOne.main.pressure + dataTwo.currentConditions.pressure)/2;
        pressure = pressure.toFixed(0);

        const windSpeedOne =  dataOne.wind.speed*3.6;

        let windSpeed = ( windSpeedOne + dataTwo.currentConditions.windspeed + dataThree[0].Wind.Speed.Value)/3;
        windSpeed = windSpeed.toFixed(2);

        let cloudcover =(dataOne.clouds.all + dataTwo.currentConditions.cloudcover + dataThree[0].CloudCover)/3;
        cloudcover = cloudcover.toFixed(0);

        let description = "";

        if(dataOne.weather[0].description.includes('clear') && cloudcover==0){
            backgroundStyle.backgroundImage = "url(/sunny_clear_sky.jpg)";
            description="Czyste niebo";
        }
        else if(dataOne.weather[0].description.includes('clear') && cloudcover>0){
            backgroundStyle.backgroundImage = "url(/sunny.jpg)";
            description="Pogodnie";
        }
        else if(dataOne.weather[0].description.includes('rain') && dataThree[0].Rain.Value>0){
            backgroundStyle.backgroundImage = "url(/rainy.jpg)";
            description="Deszczowo";
        }
        else if(dataOne.weather[0].description.includes('clouds') && dataThree[0].IsDaylight == false){
            backgroundStyle.backgroundImage = "url(/cloudy.jpg)";
            description="Pochmurno";
        }
        else if(dataOne.weather[0].description.includes('snow') && dataThree[0].Snow.Value>0){
            backgroundStyle.backgroundImage = "url(/snow.jpg)";
            description="Pada śnieg";
        }
        else if(dataOne.weather[0].description.includes('storm') && dataThree[0].ThunderstormProbability>50){
            backgroundStyle.backgroundImage = "url(/storm.jfif)";
            description="Burza";
        }
        else if(dataOne.weather[0].description.includes('mist') && cloudcover>50){
            backgroundStyle.backgroundImage = "url(/mist.jpg)";
            description="Mgła";
        }

        if(now.getHours()>=17 && description==="Czyste niebo"){
            backgroundStyle.backgroundImage = "url(/night2.jpg)";
        } else if(now.getHours()>=17 && description==="Pogodnie"){
            backgroundStyle.backgroundImage = "url(/night.jpg)"; 
        } else if(now.getHours()>=17 && description==="Deszczowo"){
            backgroundStyle.backgroundImage = "url(/night-rain.jpg)";
        } else if(now.getHours()>=17 && description==="Pochmurno"){
            backgroundStyle.backgroundImage = "url(/night-cloudy.jpg)";
        } else if(now.getHours()>=17 && description==="Pada śnieg"){
            backgroundStyle.backgroundImage = "url(/night-snow.jpg)";
        } else if(now.getHours()>=17 && description==="Burza"){
            backgroundStyle.backgroundImage = "url(/night-storm.jpg)";
        } else if(now.getHours()>=17 && description==="Mgła"){
            backgroundStyle.backgroundImage = "url(/night-fog.jpg)";
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
                        <p className="temp">Ciśnienie: {pressure} hPa</p>
                        <p className="humidity">Prędkość wiatru: {windSpeed} km/h</p>
                    </div>
                        <p className="temp">Opis: {description} </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className="city-input"
                        name="city"
                        placeholder="Wpisz miasto, które Cię interesuje"
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