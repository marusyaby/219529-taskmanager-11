import {render, replace} from '../utils/render.js';
import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class Task {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    const onEditButtonClick = () => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    const onFavouriteButtonClick = () => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavourite: !task.isFavourite,
      }));
    };

    const onArchiveButtonClick = () => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    };

    const onFormSubmit = (evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    };

    this._taskComponent.setEditButtonClickHandler(onEditButtonClick);
    this._taskComponent.setFavouriteButtonClickHandler(onFavouriteButtonClick);
    this._taskComponent.setArchiveButtonClickHandler(onArchiveButtonClick);
    this._taskEditComponent.setSubmitHandler(onFormSubmit);

    // render(this._container, this._taskComponent);
    if (oldTaskComponent && oldTaskEditComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    replace(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
