import AbstractComponent from './abstract.js';

const getFilters = (filterNames, tasksArray) => {
  const filter = {
    all(tasks) {
      return tasks;
    },

    overdue(tasks) {
      return tasks.filter((task) =>
        task.isDueDateSet &&
        !task.isArchive &&
        task.dueDate < Date.now());
    },

    today(tasks) {
      const today = new Date();
      return tasks.filter((task) =>
        task.isDueDateSet &&
        !task.isArchive &&
        task.dueDate.toDateString() === today.toDateString());
    },

    favorites(tasks) {
      return tasks.filter((task) =>
        task.isFavourite);
    },

    repeating(tasks) {
      return tasks.filter((task) =>
        task.isRepeated);
    },

    archive(tasks) {
      return tasks.filter((task) =>
        task.isArchive);
    },
  };

  return filterNames.map((filterName) => ({
    name: filterName,
    count: filter[filterName](tasksArray).length,
    tasks: filter[filterName](tasksArray),
  }));
};

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
        ${!count ? `disabled` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span></label
      >`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter, i) =>
    createFilterMarkup(filter, i === 0)).join(`\n`);

  return (
    `<section class="main__filter filter container">
        ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}

export {getFilters};
