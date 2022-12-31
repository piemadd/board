const timeOff = (scheduled, actual) => {
  //calculate hours and minutes late
  let hoursLate = Math.floor((actual - scheduled) / 3600000);
  let minutesLate = Math.floor(((actual - scheduled) % 3600000) / 60000);

  if (hoursLate === 0) {
    if (minutesLate === 0) return "On Time";

    if (minutesLate > 0) {
      return `${minutesLate}m late`;
    }

    return `${minutesLate * -1}m early`;
  }

  if (hoursLate > 0) {
    return `${hoursLate}h ${minutesLate}m late`;
  }

  if (hoursLate < 0) {
    return `${hoursLate * -1}h ${minutesLate * -1}m early`;
  }

  return (
    <>
      {hoursLate}h {minutesLate}m
    </>
  );
};

const TrainTrips = ({ trips }) => {
  const now = new Date().valueOf();

  const sortedAndFilteredTrips = trips
    .sort((a, b) => {
      return a.estimated - b.estimated;
    })
    .filter((trip) => {
      return true;
      return trip.estimated >= now - 300000;
    });

  if (sortedAndFilteredTrips.length === 0) {
    return (
      <div
        className='trip'
        style={{
          textAlign: "center",
          paddingTop: "4px",
        }}
      >
        <p>No trips found ☹️</p>
      </div>
    );
  }

  return (
    <>
      {sortedAndFilteredTrips.map((trip) => {
        return (
          <div className='trip' key={`amtrak-${trip.id}`}>
            <h1>
              <span>#{trip.runNumber}</span> {trip.runName}
            </h1>
            <h3>
              {trip.inbound ? "from" : "to"}{" "}
              {trip.inbound ? trip.origin : trip.destination}
            </h3>
            <h2>
              {new Date(trip.estimated).toLocaleTimeString("en-us", {
                timeZone: "America/Chicago",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              - {timeOff(trip.scheduled, trip.estimated)}
            </h2>
          </div>
        );
      })}
    </>
  );
};

export default TrainTrips;
