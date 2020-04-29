import {remove, render, replace} from '../utils/render.js';
import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import TasksComponent from '../components/tasks.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';

const TASKS_COUNT = {
  TOTAL: 26,
  ON_START: 8,
  BY_BUTTON: 8,
};

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
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

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(onEditButtonClick);

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler(onFormSubmit);

  render(taskListElement, taskComponent);
};

export default class Board {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();

    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived || tasks.length === 0) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = container
      .querySelector(`.board__tasks`);
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
        remove(this._loadMoreButtonComponent);
      }
    };

    renderTasks(0, renderedTasksCount);

    if (tasks.length > TASKS_COUNT.ON_START) {
      render(container, this._loadMoreButtonComponent);
    }

    this._loadMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
  }
}

export {TASKS_COUNT};
