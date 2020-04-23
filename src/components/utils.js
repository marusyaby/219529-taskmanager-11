const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

const formatDate = (date) =>
  date.toLocaleString(`en-GB`, {
    day: `numeric`,
    month: `long`
  });

const formatTime = (date) =>
  date.toLocaleString(`en-US`, {
    hour12: true,
    hour: `numeric`,
    minute: `numeric`
  });

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const render = (container, element, place = `beforeend`) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {
  RenderPosition,
  formatDate,
  formatTime,
  createElement,
  render,
};
