import { useState, useEffect } from "react";
import GaugeChart from "../components/Gauge";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startCase } from 'lodash';

export default function Home() {
  const [cityInput, setCityInput] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [weatherData, setWeatherData] = useState();
  const [error, setError] = useState("");
  

  useEffect(() => {
    if (triggerFetch === false) {
      const getData = async () => {
        const res = await fetch("api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityInput }),
        });
        const data = await res.json();
        setWeatherData({ ...data });
        if(data?.message && data?.cod === "404") {
            setError(data?.message);
        }
        setCityInput("");
        setTriggerFetch(true);
      };
      getData();
    }
  }, [triggerFetch]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      setTriggerFetch(false);
      e.target.placeholder = "Enter location";
    }
  };

  useEffect(() => {
    if(error) {
        toast.error(`${startCase(error)}`)
    }
    setError('');
  }, [error]);

  return (
    <main className="box-border flex min-h-screen flex-col items-center gap-[20px] p-24">
      <ToastContainer />
      <div className="entryForm w-[300px] lg:w-[900px]">
        <h1 className="text-sm lg:text-2xl text-center ">
          Want to find out what the weather is at a place?
        </h1>

        <div className="locationDiv">
          <input
            type="text"
            className="flex h-10 w-full lg:w-[600px] rounded-md border border-input bg-[pink] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter location"
            value={cityInput}
            onFocus={(e) => {
              e.target.value = "";
              e.target.placeholder = "";
            }}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-[pink] text-[pink]-foreground hover:bg-[pink]/90
          h-10 py-2 px-4 sm:h-9 sm:px-3 sm:rounded-md lg:h-11 lg:px-8 lg:rounded-md
          "
            onClick={() => {
              setTriggerFetch(false);
            }}
          >
            Look Up Weather
          </button>
        </div>
      </div>

      {triggerFetch === false && (
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {weatherData && !weatherData.message && (
        <div className="mt-[60px] entryForm w-[400px] lg:w-[1200px]">
          <h1 className="text-2xl text-center ">{weatherData?.name}</h1>
          <h2 className="text-xl text-center ">{weatherData?.main?.temp}°C</h2>
          <h3 className="text-lg text-center ">
            {weatherData?.weather[0?.description]}
          </h3>

          <div className="flex gap-[20px]">
            <p>L: {` ${weatherData?.main?.temp_min}°C `}</p>
            <p>H: {` ${weatherData?.main?.temp_max}°C `}</p>
          </div>

          <div className="mt-[8px] grid gap-4 grid-cols-1 grid-rows-1 lg:grid-cols-3 lg:grid-rows-2">
            <div className="gridElement">
              <p className="mt-[12px] mb-[20px]">Wind</p>
              <GaugeChart
                value={weatherData?.wind?.speed / 10}
                textValue={`${weatherData?.wind?.speed}m/s`}
              />
            </div>

            <div className="gridElement">
              <p className="mt-[12px] mb-[60px]">Humidity</p>
              <div className="flex flex-col items-center">
                <p className="text-[20px]">{weatherData?.main?.humidity}%</p>
              </div>
            </div>

            <div className="gridElement">
              <p className="mt-[12px] mb-[20px]">Pressure</p>
              <GaugeChart
                value={weatherData?.main?.pressure / 1084}
                textValue={`${weatherData?.main?.pressure} hPa`}
              />
            </div>

            <div className="gridElement">
              <p className="mt-[12px] mb-[60px]">Visibility</p>

              <div className="flex flex-col items-center">
                <p className="text-[20px]">{weatherData?.visibility} m</p>
              </div>
            </div>

            <div className="hidden lg:block lg:gridElement lg:gridElementInvisible"></div>

            <div className="gridElement">
              <p className="mt-[12px] mb-[60px]">Feels Like</p>
              <div className="flex flex-col items-center">
                <p className="text-[20px]">{weatherData?.main?.feels_like}°C</p>
              </div>
            </div>
          </div>
        </div>
      )}

    
    </main>
  );
}
