import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import NoTasksComponent from './components/no-tasks';
import LoadMoreButtonComponent from './components/load-more-button.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import TaskComponent from './components/task.js';
import TaskEditComponent from './components/task-edit.js';
import TasksComponent from './components/tasks.js';

import {FILTERS} from './components/const.js';
import {getRandomTasks} from './mock/random-task.js';
import {render} from './components/utils.js';
import {getFilters} from './components/filter.js';

const TASKS_COUNT = {
  TOTAL: 22,
  ON_START: 8,
  BY_BUTTON: 8,
};

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onEditButtonClick = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown)
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(taskListElement, taskComponent.getElement());
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived || tasks.length === 0) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement());
    return;
  }

  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), new TasksComponent().getElement());

  const taskListElement = boardComponent.getElement().
    querySelector(`.board__tasks`);
  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  let renderedTasksCount = TASKS_COUNT.ON_START;

  const renderTasks = (from, to) => {
    tasks.slice(from, to).forEach((task) =>
      renderTask(taskListElement, task));
  };

  const onLoadMoreButtonClick = () => {
    const prevTasksCount = renderedTasksCount;
    renderedTasksCount += TASKS_COUNT.BY_BUTTON;

    renderTasks(prevTasksCount, renderedTasksCount);

    if (renderedTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  };

  renderTasks(0, renderedTasksCount);

  if (tasks.length > TASKS_COUNT.ON_START) {
    render(boardComponent.getElement(), loadMoreButtonComponent.getElement());
  }

  loadMoreButtonComponent.getElement().
    addEventListener(`click`, onLoadMoreButtonClick);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = getRandomTasks(TASKS_COUNT.TOTAL);
const filters = getFilters(FILTERS, tasks);

render(siteHeaderElement, new SiteMenuComponent().getElement());
render(siteMainElement, new FilterComponent(filters).getElement());

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement());
renderBoard(boardComponent, tasks);
