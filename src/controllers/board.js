import {remove, render} from '../utils/render.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import TasksComponent from '../components/tasks.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import TaskController from '../controllers/task.js';
import {SortType} from '../components/sort.js';

const TASKS_COUNT = {
  TOTAL: 20,
  ON_START: 8,
  BY_BUTTON: 8,
};

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);

    return taskController;
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

    this._tasks = [];
    this._renderedTasksControllers = [];
    this._renderedTasksCount = TASKS_COUNT.ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();
    const taskListElement = this._tasksComponent.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived || !this._tasks.length) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const renderedTasks = renderTasks(taskListElement, this._tasks.slice(0, this._renderedTasksCount), this._onDataChange, this._onViewChange);
    this._renderedTasksControllers = this._renderedTasksControllers.concat(renderedTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    const container = this._container.getElement();

    if (this._tasks.length > TASKS_COUNT.ON_START) {
      render(container, this._loadMoreButtonComponent);
    }

    const onLoadMoreButtonClick = () => {
      const prevTasksCount = this._renderedTasksCount;
      this._renderedTasksCount += TASKS_COUNT.BY_BUTTON;
      const taskListElement = this._tasksComponent.getElement();

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType());
      const renderedTasks = renderTasks(taskListElement, sortedTasks.slice(prevTasksCount, this._renderedTasksCount), this._onDataChange, this._onViewChange);
      this._renderedTasksControllers = this._renderedTasksControllers.concat(renderedTasks);

      if (this._renderedTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };

    this._loadMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    const newTasksData = this._tasks.slice();
    newTasksData[index] = newData;
    this._tasks = newTasksData;

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._renderedTasksControllers.forEach((controller) => {
      controller.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    this._renderedTasksCount = TASKS_COUNT.ON_START;
    const sortedTasks = getSortedTasks(this._tasks, sortType);
    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;

    const renderedTasks = renderTasks(taskListElement, sortedTasks.slice(0, this._renderedTasksCount), this._onDataChange, this._onViewChange);
    this._renderedTasksControllers = renderedTasks;


    remove(this._loadMoreButtonComponent);
    this._renderLoadMoreButton();
  }
}

export {TASKS_COUNT};
