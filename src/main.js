import {FILTERS} from './components/const.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskTemplate} from './components/task.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {getRandomTasks} from './mock/random-task.js';
import {getFilters, createFilterTemplate} from './components/filter.js';

const TASKS_COUNT = {
  TOTAL: 20,
  ON_START: 8,
  BY_BUTTON: 8,
};

const siteMainElement = document.querySelector(`.main`);
const tasks = getRandomTasks(TASKS_COUNT.TOTAL);

const render = (container, template, place = `beforeend`) =>
  container.insertAdjacentHTML(place, template);

const createFilters = () => {
  const filters = getFilters(FILTERS, tasks);
  render(siteMainElement, createFilterTemplate(filters));
};

const createTemplates = () => {
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
  render(siteHeaderElement, createSiteMenuTemplate());
  render(siteMainElement, createBoardTemplate());

  if (tasks.length > TASKS_COUNT.ON_START) {
    const boardElement = siteMainElement.querySelector(`.board`);
    render(boardElement, createLoadMoreButtonTemplate());
  }
};

const createTasks = () => {
  const renderTasks = (from, to) => {
    tasks.slice(from, to).forEach((task) =>
      render(taskListElement, createTaskTemplate(task)));
  };

  const taskListElement = siteMainElement.querySelector(`.board__tasks`);
  render(taskListElement, createTaskEditTemplate(tasks[0]));

  let renderedTasksCount = TASKS_COUNT.ON_START;
  renderTasks(1, renderedTasksCount);

  const onLoadMoreButtonClick = () => {
    const prevTasksCount = renderedTasksCount;
    renderedTasksCount += TASKS_COUNT.BY_BUTTON;

    renderTasks(prevTasksCount, renderedTasksCount);

    if (renderedTasksCount >= tasks.length) {
      loadMoreButton.remove();
    }
  };

  const loadMoreButton = document.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, onLoadMoreButtonClick);
};

createFilters();
createTemplates();
createTasks();
