const timeTil = (estimated) => {
  //hours, minutes, seconds until estimated

  const now = new Date().valueOf();
  const timeTil = estimated - now;

  if (timeTil <= 0) {
    return <>Due</>;
  }

  const hoursTil = Math.floor(timeTil / 3600000);
  const minutesTil = Math.floor((timeTil % 3600000) / 60000);
  const secondsTil = Math.floor(((timeTil % 3600000) % 60000) / 1000);

  return (
    <>
      in {hoursTil > 0 ? hoursTil + "h " : ""} {minutesTil}m {secondsTil}s
    </>
  );
};

const CTATrips = ({ trips }) => {
  const example = {
    "49-1532": {
      operator: "CTA",
      id: "1532",
      runNumber: "49",
      runName: "Southbound",
      stopLocation: "Western & Leland (Brown Line)",
      origin: null,
      destination: "79th",
      scheduled: null,
      estimated: 1672522740000,
      inbound: false,
    },
  };

  //console.log(trips)
  const now = new Date().valueOf();

  let tripsByLineAndDirection = {};

  trips
    .filter((trip) => {
      return trip.estimated >= now - 60000;
    })
    .forEach((trip) => {
      if (!tripsByLineAndDirection[`${trip.runNumber}-${trip.runName}`]) {
        tripsByLineAndDirection[`${trip.runNumber}-${trip.runName}`] = [];
      }

      tripsByLineAndDirection[`${trip.runNumber}-${trip.runName}`].push(trip);
    });

  if (Object.keys(tripsByLineAndDirection).length === 0) {
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
      {Object.keys(tripsByLineAndDirection).sort((a, b) => {
        return Number(a.split('-')[0]) - Number(b.split('-')[0]);
      }).map((lineKey) => {
        const sortedLine = tripsByLineAndDirection[lineKey].sort((a, b) => {
          return a.estimated - b.estimated;
        });

        return (
          <div
            className='trip'
            key={`cta-${sortedLine[0].runNumber}-${sortedLine[0].runName}`}
          >
            <h1>
              <span>#{sortedLine[0].runNumber}</span> {sortedLine[0].runName}
            </h1>
            <h3>to {sortedLine[0].destination}</h3>
            <h3
              style={{
                paddingTop: "8px",
                paddingBottom: "4px",
                lineHeight: "1.05em",
              }}
            >
              from {sortedLine[0].stopLocation}
            </h3>
            {sortedLine.map((trip) => {
              return (
                <h2>
                  {new Date(trip.estimated).toLocaleTimeString("en-us", {
                    timeZone: "America/Chicago",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  - {timeTil(trip.estimated)}
                </h2>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default CTATrips;
