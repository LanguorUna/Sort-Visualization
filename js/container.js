class Container {
   /**
    * 
    * @param {HTMLElement} container 
    * @param {HTMLElement} status 
    * @param {SortAnimator} animator 
    */
   constructor(container, status, animator) {
      this.container = container;
      this.status = status;
      this.animator = animator;
      this.state = '';
      this.sourceArray = [];
   }

   /**
    * Очистка контейнера
    */
   clear() {
      this.container.innerHTML = '';
      this.setState();
   }

   /**
    * Создание элемента
    */
   createRandomElement() {
      const elem = document.createElement('div');
      elem.classList.add('sort__element');

      const random = Math.trunc(Math.random() * 100);
      elem.textContent = random;

      return elem;
   }

   /**
    * Заполнение контейнера элементами
    * @param {number} number - количество элементов
    */
   fillElements(number) {
      let element;
      for (let i = 0; i < number; i++) {
         element = this.createRandomElement();
         this.container.insertAdjacentElement('beforeend', element);
         element.style.left = `${i * (element.offsetWidth * 1.5)}px`;
      }

      if (number > 0) {
         this.setState('filled');
      }
   }

   /**
    * Установить статус и вывести его интерпретацию в контейнер статуса
    * @param {string} state 
    */
   setState(state = '') {
      this.state = state;
      this.showStatus();
   }

   /**
    * Вывод интерпретации статуса в контейнер статуса
    */
   showStatus() {
      switch (this.state) {
         case 'filled':
            this.status.innerHTML =
               `
                  <p class="sort__status-paragraph">Есть ${this.container.childElementCount} случайных чисел</p>
                  <p class="sort__status-paragraph">Чтобы изменить числа, нажмите на кнопку "Заполнить"</p>
                  <p class="sort__status-paragraph">Для запуска сортировки нажмите на кнопку "Отсортировать"</p>
               `;
            break;

         case 'sorting':
            this.status.innerHTML = '<p class="sort__status-paragraph">Смотрите...</p>';
            break;

         case 'done':
            this.status.innerHTML =
               `
                  <p class="sort__status-paragraph">Сортировка завершена</p>
                  <p class="sort__status-paragraph">Исходный массив: [${this.sourceArray}]</p>
                  <p class="sort__status-paragraph">Чтобы начать заново, нажмите на кнопку "Заполнить"</p>
               `;
            break;

         case '':
         default:
            this.status.innerHTML = '';
            break;
      }
   }

   /**
    * Запуск визуализации алгоритма сортировки
    */
   async showSort() {
      this.setState('sorting');

      const sortArray = Array.from(this.container.children);
      this.sourceArray = sortArray.map((elem) => Number(elem.textContent));
      await this.animator.sort(sortArray);

      this.setState('done');
   }
}