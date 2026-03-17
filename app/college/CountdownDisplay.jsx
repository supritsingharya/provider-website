const CountdownDisplay = (props) => {
  return (
    <div className="countdown">
      <h5>
        <span className="days">{props.days}</span>
        <span className="ref">d</span>
        <span className="seperator"> :</span>
      </h5>
      <h5>
        <span className="hours">{props.hours}</span>
        <span className="ref">h</span>
        <span className="seperator"> :</span>
      </h5>
      <h5>
        <span className="minutes">{props.minutes}</span>
        <span className="ref">m</span>
        <span className="seperator"></span>
      </h5>
    </div>
  );
};

export default CountdownDisplay;
