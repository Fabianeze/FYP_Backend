export const getDate = () => {
  const date = new Date();
  const timesTamp = date.getTime();
  const correct = new Date(timesTamp);
  const month = correct.getDay();
  const year = correct.getFullYear();
  const day = correct.getDate();
  const time =
    correct.getHours().toString() + ":" + correct.getMinutes().toString();
  const realDate =
    year.toString() +
    "-" +
    month.toString() +
    "-" +
    day.toString() +
    " " +
    time;
    return realDate
};
