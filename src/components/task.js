import {
  formatDate,
  formatTime,
} from './utils.js';

const createTaskTemplate = (task) => {
  const {description, dueDate, color, repeatingDays, isArchive, isFavourite} = task;

  const isDueDateSet = !!dueDate;
  const date = isDueDateSet ? formatDate(dueDate) : ``;
  const time = isDueDateSet ? formatTime(dueDate) : ``;

  const isRepeatedTask = Object.values(repeatingDays).some(Boolean);
  const repeatClass = isRepeatedTask ? `card--repeat` : ``;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const disableButton = (isDisabled) =>
    isDisabled ? `card__btn--disabled` : ``;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${disableButton(isArchive)}">
              archive
            </button>
            <button
            type="button"
            class="card__btn card__btn--favorites ${disableButton(isFavourite)}">
              favorites
          </button>
        </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export {
  createTaskTemplate,
};
