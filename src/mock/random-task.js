import {
  COLORS,
  DAYS
} from '../components/const.js';

const TASK_DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const DUEDATE_DIFF = {
  MIN: 0,
  MAX: 7,
};

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);
  return array[randomIndex];
};

const getRandomBoolean = () =>
  Math.random() < 0.7;

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = getRandomBoolean() ? 1 : -1;
  const diffValue = sign * getRandomNumber(DUEDATE_DIFF.MIN, DUEDATE_DIFF.MAX);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const getBooleanValuesObj = (array, isRandom) => {
  const obj = {};

  for (const key of array) {
    obj[key] = !isRandom ? false : getRandomBoolean();
  }

  return obj;
};

const getRandomTask = () => {
  const isDueDateSet = getRandomBoolean();
  const isRepeated = isDueDateSet ? false : getRandomBoolean();

  return {
    // isDueDateSet,
    // isRepeated,
    description: getRandomArrayItem(TASK_DESCRIPTIONS),
    dueDate: isDueDateSet ? getRandomDate() : null,
    color: getRandomArrayItem(COLORS),
    repeatingDays: getBooleanValuesObj(DAYS, isRepeated),
    isArchive: getRandomBoolean(),
    isFavourite: getRandomBoolean(),
  };
};

const getRandomTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(getRandomTask);
};

export {
  getRandomTasks,
};
