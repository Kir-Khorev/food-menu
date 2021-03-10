import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms (formSelector, modalTimerId) {
        // FORMS
        const forms = document.querySelectorAll(formSelector);

        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Мы получили ваше сообщение и свяжемся с вами в ближайшее время!',
            failure: 'Что-то пошло не так...'
        };
    
        forms.forEach(item => {
            bindPostData(item);
        });
        
        function bindPostData (form) { // Функция которая обрабатывает запрос и отправляет на сервер.
            form.addEventListener('submit', (e) => { // Навешиваем событие подписки
                e.preventDefault(); // Отменяем стандартное действие события подписки.
    
                let statusMessage = document.createElement('img'); // Создаём сообщение на странице
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);
    
                // request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // Когда используем связку XMLHttpReq и formData - Заголовок устанавливать не нужно.
                const formData = new FormData(form); // Создание новой формы (в параметре указана изначальная форма)
    
                const json =JSON.stringify(Object.fromEntries(formData.entries()));
    
                postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
    
            });
        }
    
        function showThanksModal (message) {
            const prevModalDialog = document.querySelector('.modal__dialog');
    
            prevModalDialog.classList.add('hide');
            openModal('.modal', modalTimerId);
    
            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class='modal__content'>
                    <div class='modal__close' data-close>×</div>
                    <div class='modal__title'>${message}</div>
                </div>
            `;
    
            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal('.modal');
            }, 4000);
        }
        
}

export default forms;