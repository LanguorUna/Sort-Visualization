window.onload = () => {
   const container = document.querySelector('.sort__container');
   const status = document.querySelector('.sort__status');

   const sortContainer = new Container(container, status, new SortAnimator());
   sortContainer.fillElements(5);

   const prepareBtn = document.querySelector('.sort__button__prepare');
   const runBtn = document.querySelector('.sort__button__run');

   prepareBtn.addEventListener('click', () => {
      sortContainer.clear();
      sortContainer.fillElements(5);
      runBtn.disabled = false;
   })

   runBtn.addEventListener('click', async () => {
      prepareBtn.disabled = true;
      runBtn.disabled = true;

      await sortContainer.showSort();

      prepareBtn.disabled = false;
   });
}