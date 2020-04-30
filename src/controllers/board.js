import {remove, render, replace} from '../utils/render.js';
import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import TasksComponent from '../components/tasks.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import {SortType} from '../components/sort';

const TASKS_COUNT = {
  TOTAL: 20,
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

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

const getSortedTasks = (tasks, sortType) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks;
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
    const taskListElement = this._tasksComponent.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    let renderedTasksCount = TASKS_COUNT.ON_START;
    let sortedTasks = getSortedTasks(tasks, SortType.DEFAULT);

    const renderLoadMoreButton = () => {
      const onLoadMoreButtonClick = () => {
        const prevTasksCount = renderedTasksCount;
        renderedTasksCount += TASKS_COUNT.BY_BUTTON;

        renderTasks(taskListElement, sortedTasks.slice(prevTasksCount, renderedTasksCount));

        if (renderedTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      };

      remove(this._loadMoreButtonComponent);

      if (tasks.length > TASKS_COUNT.ON_START) {
        render(container, this._loadMoreButtonComponent);
      }

      this._loadMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
    };

    if (isAllTasksArchived || tasks.length === 0) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    renderTasks(taskListElement, sortedTasks.slice(0, renderedTasksCount));
    renderLoadMoreButton();

    const onSortTypeChange = (sortType) => {
      renderedTasksCount = TASKS_COUNT.ON_START;
      sortedTasks = getSortedTasks(tasks, sortType);
      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks.slice(0, renderedTasksCount));
      renderLoadMoreButton();
    };

    this._sortComponent.setSortTypeChangeHandler(onSortTypeChange);
  }
}

export {TASKS_COUNT};
