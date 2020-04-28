import Abstract from './abstract.js';

const createTasksTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Tasks extends Abstract {
  getTemplate() {
    return createTasksTemplate();
  }
}
