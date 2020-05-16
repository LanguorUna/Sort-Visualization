class SortAnimator {
   constructor() {
      this.isSort = false;
   }

   /**
    * Запуск и возврат анимации перемещения
    * @param {Object} params
    * @param {Element} target - перемещаемый элемент
    * @param {Number} duration - продолжительность движения в мс
    */
   motionAnimation({ target, left, duration = 600 }) {
      return anime({
         targets: target,
         left: left,
         easing: 'easeInOutQuad',
         duration: duration,
         loop: false,
      });
   }

   /**
    * Выполнение анимации выбора элемента
    * @param {Array} targets - элементы
    */
   async selectElements(targets = []) {
      await this.colorElements({
         targets: targets,
         color: '#00243a',
         textColor: '#f1f2cc',
      })
   }

   /**
    * Выполнение анимации отмены выбора элемента
    * @param {Array} targets 
    */
   async deselectElements(targets = []) {
      await this.colorElements({
         targets: targets,
         color: this.bgColorDefault || 'white',
         textColor: this.txtColorDefault || 'black',
      })
   }

   /**
    * Выполнение анимации завершения работы с элементом
    * @param {Array} targets 
    */
   async finishElements(targets = []) {
      await this.colorElements({
         targets: targets,
         color: '#ff2600',
         textColor: '#f1f2cc',
         endDelay: 1000,
      })
   }

   /**
    * Выполнение анимации смены цвета элемента
    * @param {Object} params
    * @param {Array} targets - массив элементов
    * @param {string} color - цвет фона
    * @param {string} textColor - цвет текста
    * @param {Number} duration - продолжительность в мс
    * @param {Number} endDelay - длительность паузы после анимации в мс
    */
   async colorElements({ targets = [], color, textColor, duration = 600, endDelay = 400 }) {
      if (targets.length > 0) {
         const animations = [];

         for (let i = 0; i < targets.length; i++) {
            animations.push(this.colorAnimation({
               target: targets[i],
               color: color,
               textColor: textColor,
               duration: duration,
               endDelay: endDelay,
            }));

         }
         const promises = animations.map((a) => a.finished);
         await Promise.all(promises);
      }
   }

   /**
    * Запуск и возврат анимации смены цвета элемента
    * @param {Object} params
    * @param {HTMLElement|string} target - элемент
    * @param {string} color - цвет фона
    * @param {string} textColor - цвет текста
    * @param {number} duration - продолжительность в мс
    * @param {number} endDelay - длительность паузы после анимации в мс
    */
   colorAnimation({ target, color, textColor, duration, endDelay }) {
      return anime({
         targets: target,
         color: textColor,
         backgroundColor: color,
         duration: duration,
         endDelay: endDelay,
         easing: 'easeInOutQuad'
      });
   }

   /**
    * Запуск и возврат анимации временной смены размера элемента
    * @param {HTMLElement|string} target - элемент
    * @param {number} scale - масштаб элемента
    * @param {number} duration - продолжительность в мс
    * @param {number} endDelay - длительность паузы после анимации в мс
    */
   scaleUpDownAnimation({target, scale, duration = 600}) {
      return anime({
         targets: target,
         scale: scale,
         easing: 'linear',
         direction: 'alternate',
         duration: duration / 2,
      });
   }

   /**
    * Выполнение анимации обмена местами по часовой стрелке
    * @param {Element} firstElem 
    * @param {Element} secondElem 
    */
   async swapAnimation(firstElem, secondElem) {
      const scale = 3;
      const duration = 700;

      const firstToSecond = this.motionAnimation({
         target: firstElem,
         left: secondElem.offsetLeft,
         duration: duration,
      });

      const firstScale = this.scaleUpDownAnimation({
         target: firstElem,
         scale: scale,
         duration: duration,
      })

      const secondToFirst = this.motionAnimation({
         target: secondElem,
         left: firstElem.offsetLeft,
         duration: duration,
      });

      const secondScale = this.scaleUpDownAnimation({
         target: secondElem,
         scale: scale,
         duration: duration,
      })

      await Promise.all([firstScale.finished, firstToSecond.finished, secondToFirst.finished, secondScale.finished]);
   }

   /**
    * Запуск визуализации сортировки
    * @param {Array} array 
    */
   async sort(array = []) {
      if (!this.isSort && array.length > 0) {
         this.isSort = true;
         this.bgColorDefault = window.getComputedStyle(array[0]).backgroundColor;
         this.txtColorDefault = window.getComputedStyle(array[0]).color;

         const lenght = array.length;
         for (let iteration = 0; iteration < lenght; iteration++) {
            for (let i = 0; i < lenght - iteration - 1; i++) {
               await this.selectElements([array[i], array[i + 1]]);
               if (Number(array[i].textContent) > Number(array[i + 1].textContent)) {
                  await this.swapAnimation(array[i], array[i + 1]);

                  const temp = array[i];
                  array[i] = array[i + 1];
                  array[i + 1] = temp;

                  await this.deselectElements([array[i], array[i + 1]]);
               }
               if (i + 1 == lenght - iteration - 1) {

                  await Promise.all([
                     this.deselectElements([array[i]]),
                     this.finishElements([array[i + 1]])
                  ]);
               } else {
                  await this.deselectElements([array[i], array[i + 1]]);
               }
            }
         }
         await this.finishElements([array[0]]);
         this.isSort = false;
      }
   }
}