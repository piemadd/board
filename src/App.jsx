import { useState, useEffect } from "react";
import TrainTrips from "./components/trainTrips";
import CTATrips from "./components/ctaTrips";
import "./App.css";

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

/*
if (newTrain.inbound && isToday(new Date(newTrain.scheduled))) {
            newData.push(newTrain);
          }
*/

const sample = {
  operator: "Amtrak",
  runNumber: "330",
  runName: "Hiawatha",
  origin: "Milwaukee, WI (MKE)",
  destination: "Chicago, IL (CHI)",
  scheduled: 1671917077608,
  estimated: 1671918212539,
  inbound: true,
};

function App() {
  const [lastUpdated, setLastUpdated] = useState(new Date().valueOf());
  const [date, setDate] = useState(new Date().valueOf());
  const [amtrakArrivals, setAmtrakArrivals] = useState([]);
  const [ctaBuses, setCtaBuses] = useState([]);

  const updateAmtrakArrivals = () => {
    fetch("https://macro.piemadd.repl.co/v1/locations/union/transit/amtrak/trains")
      .then((response) => response.json())
      .then((data) => {
        console.log('updated amtrak arrivals')
        setAmtrakArrivals(Object.values(data).filter((train) => train.inbound && isToday(new Date(train.scheduled))));
        setTimeout(updateAmtrakArrivals, 30000)
      });
  };

  const updateCTABuses = () => {
    fetch("https://macro.piemadd.repl.co/v1/locations/union/transit/cta/buses")
      .then((response) => response.json())
      .then((data) => {
        console.log('updated cta buses')
        setCtaBuses(Object.values(data));
        setTimeout(updateCTABuses, 30000)
      });
  };

  const updateDate = () => {
    setDate(new Date().valueOf());
    setTimeout(updateDate, 1000);
  };

  useEffect(() => {
    updateDate();
    updateAmtrakArrivals();
    updateCTABuses();
  }, []);

  return (
    <>
      <div className="header">
        <h1>Chicago Union Station</h1>
        <h2>
          {new Date(date).toLocaleString([], {
            timeZone: "America/Chicago",
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </h2>
      </div>
      <main className="columnsHolder">
        <div className="column train">
          <div className="columnHeader">
            <img src="./logos/amtrak.svg" className="logoLeftPad" />
            <img src="./logos/metra.svg" />
            <h2>Train Arrivals</h2>
          </div>
          <TrainTrips trips={amtrakArrivals} />
        </div>
        <div className="column train">
          <div className="columnHeader">
            <img src="./logos/amtrak.svg" className="logoLeftPad" />
            <img src="./logos/metra.svg" />
            <h2>Train Departures</h2>
          </div>
        </div>
        <div className="column cta">
          <div className="columnHeader">
            <img src="./logos/cta.svg" />
            <h2>Local Transit</h2>
          </div>
          <CTATrips trips={ctaBuses} />
        </div>
        <div className="column weather">
          <div className="columnHeader">
            <img src="./logos/cloud.svg" className="logoLeftPad" />
            <h2>Weather</h2>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
