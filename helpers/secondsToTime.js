const secondsToTime = secs => {
  const hours = Math.floor(secs / 3600);

  const divisorForMinutes = secs % 3600;
  const minutes = Math.floor(divisorForMinutes / 60);

  const divisorForSeconds = divisorForMinutes % 60;
  const seconds = Math.ceil(divisorForSeconds);

  const time = {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
  return time;
};

export default secondsToTime;
