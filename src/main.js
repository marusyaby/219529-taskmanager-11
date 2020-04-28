import BoardController, {TASKS_COUNT} from './controllers/board';

import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import SiteMenuComponent from './components/site-menu.js';

import {FILTERS} from './components/const.js';
import {getRandomTasks} from './mock/random-task.js';
import {getFilters} from './components/filter.js';
import {render} from './utils/render.js';

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = getRandomTasks(TASKS_COUNT.TOTAL);
const filters = getFilters(FILTERS, tasks);

render(siteHeaderElement, new SiteMenuComponent());
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent);
boardController.render(tasks);
