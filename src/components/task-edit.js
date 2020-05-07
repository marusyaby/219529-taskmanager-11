import {DAYS, COLORS} from './const.js';
import {formatDate, formatTime} from '../utils/format.js';
import AbstractSmartComponent from './abstract-smart.js';

const hasRepeatingDays = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const createColorsMarkup = (colors, currentColor) => {
  return colors.map((color, index) => {
    return (
      `<input
          type="radio"
          id="color-${color}-${index}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}--${index}"
          class="card__color card__color--${color}"
          data-color="${color}"
          >${color}</label
        >`
    );
  }).join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day, index) => {
    const isChecked = repeatingDays[day];
    return (
      `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-${index}"
      name="repeat"
      value="${day}"
      ${isChecked ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${day}-${index}"
      >${day}</label
    >`
    );
  }).join(`\n`);
};

const createTaskEditTemplate = (task, options = {}) => {
  const {description, dueDate} = task;
  const {isRepeated, isDueDateSet, color, repeatingDays} = options;

  const date = isDueDateSet && dueDate ? formatDate(dueDate) : ``;
  const time = isDueDateSet && dueDate ? formatTime(dueDate) : ``;

  const repeatClass = isRepeated ? `card--repeat` : ``;

  const isExpired = isDueDateSet && dueDate instanceof Date && dueDate < Date.now();
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);

  const isSaveButtonDisabled = (isDueDateSet && isRepeated) ||
    (isRepeated && !hasRepeatingDays(repeatingDays)) ||
    (isDueDateSet && !dueDate);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDueDateSet ? `yes` : `no`}</span>
                </button>

                ${isDueDateSet ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeated ? `yes` : `no`}</span>
                </button>

                ${isRepeated ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSaveButtonDisabled ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._submitHandler = null;
    this._isRepeated = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._isDueDateSet = !!task.dueDate;
    this._activeColor = task.color;
    this._subscribeOnRepeatToggle();
    this._subscribeOnRepeatingDaysChange();
    this._subscribeOnDueDateToggle();
    this._subscribeOnColorChange();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isRepeated: this._isRepeated,
      repeatingDays: this._activeRepeatingDays,
      isDueDateSet: this._isDueDateSet,
      color: this._activeColor,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnRepeatToggle();
    this._subscribeOnRepeatingDaysChange();
    this._subscribeOnDueDateToggle();
    this._subscribeOnColorChange();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const task = this._task;
    this._isDueDateSet = !!task.dueDate;
    this._isRepeated = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._activeColor = task.color;

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
    .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _subscribeOnRepeatToggle() {
    const element = this.getElement();

    const onRepeatToggleClick = () => {
      this._isRepeated = !this._isRepeated;
      this.rerender();
    };

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, onRepeatToggleClick);
  }

  _subscribeOnRepeatingDaysChange() {
    const element = this.getElement();
    const repeatingDays = element.querySelector(`.card__repeat-days`);

    const onRepeatingDaysChange = (evt) => {
      this._activeRepeatingDays[evt.target.value] = evt.target.checked;
      this.rerender();
    };

    if (repeatingDays) {
      repeatingDays.addEventListener(`change`, onRepeatingDaysChange);
    }
  }

  _subscribeOnDueDateToggle() {
    const element = this.getElement();

    const onDueDateClick = () => {
      this._isDueDateSet = !this._isDueDateSet;
      this.rerender();
    };

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, onDueDateClick);
  }

  _subscribeOnColorChange() {
    const element = this.getElement();

    const onColorClick = (evt) => {
      const newColor = evt.target.dataset.color;

      if (newColor && this._activeColor !== newColor) {
        this._activeColor = newColor;
        this.rerender();
      }
    };

    element.querySelector(`.card__colors-wrap`)
      .addEventListener(`click`, onColorClick);
  }
}
