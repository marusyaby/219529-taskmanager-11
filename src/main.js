import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board';
import {createTaskTemplate} from './components/task';
import {createTaskEditTemplate} from './components/task-edit';
import {createLoadMoreButtonTemplate} from './components/load-more-button';

const TASKS_COUNT = 3;

const render = (container, template, place = `beforeend`) =>
  container.insertAdjacentHTML(place, template);

const repeat = (count, action) =>
  Array(count).fill(``).forEach(action);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(taskListElement, createTaskEditTemplate());
repeat(TASKS_COUNT, () =>
  render(taskListElement, createTaskTemplate()));

render(boardElement, createLoadMoreButtonTemplate());
