const apiKey = 'live_0DPySQieCUuukjkTTBtBNtt9Vn0wADLYwyPrENMtYDD0rNMTrHZJwSkizGHJMpIY'; // ключь для api


// Функция для очистки информации о собаке на странице
function clearDogInfo() {
    // Очистка изображения собаки
    document.getElementById('dog-image').src = "";
    // Очистка названия породы
    document.getElementById('dog-breed').innerText = "";
    // Очистка описания породы
    document.getElementById('dog-description').innerText = "";
    // Очистка контейнера с изображениями собак
    document.getElementById('dogs-container').innerHTML = "";
    // Скрытие блока информации о собаке
    document.getElementById('dog-info').style.display = "none";
}

// Функция для отображения информации о выбранной собаке
function displayDogInfo(dog) {
    // Получение URL изображения собаки
    const dogImage = dog.image ? dog.image.url : 'https://via.placeholder.com/150';
    // Получение информации о породе собаки
    const breed = dog.breeds ? dog.breeds[0] : dog;

    // Отображение изображения собаки
    document.getElementById('dog-image').src = dogImage;
    // Отображение названия породы
    document.getElementById('dog-breed').innerText = breed.name;
    // Отображение описания породы
    document.getElementById('dog-description').innerText = breed.temperament;
    // Отображение блока информации о собаке
    document.getElementById('dog-info').style.display = "flex";
    // Скрытие контейнера с изображениями собак
    document.getElementById('dogs-container').style.display = "none";
}

// Функция для отображения изображений собак
function displayDogImages(dogs) {
    // Получаем контейнер для собак по его ID
    const dogsContainer = document.getElementById('dogs-container');
    // Очищаем содержимое контейнера
    dogsContainer.innerHTML = '';
    // Устанавливаем стиль отображения контейнера как flex, чтобы элементы распределялись в строку
    dogsContainer.style.display = "flex";

    // Перебираем каждую собаку в массиве dogs
    dogs.forEach(dog => {
        // Создаем новый элемент div для каждой собаки
        const dogElement = document.createElement('div');
        // Добавляем класс 'dog' к элементу div для стилизации
        dogElement.classList.add('dog');
        // Определяем URL изображения собаки, если у собаки нет изображения, используем заглушку
        const dogImage = dog.image ? dog.image.url : 'https://via.placeholder.com/150';

        // Устанавливаем HTML содержимое для элемента собаки
        dogElement.innerHTML = `
            <img src="${dogImage}" alt="${dog.name}" data-dog='${JSON.stringify(dog)}'>
        `;

        // Добавляем обработчик события click для изображения собаки
        dogElement.querySelector('img').addEventListener('click', (event) => {
            // При клике на изображение извлекаем информацию о собаке и отображаем ее
            const selectedDog = JSON.parse(event.target.getAttribute('data-dog'));
            displayDogInfo(selectedDog);
        });

        // Добавляем элемент собаки в контейнер для отображения на странице
        dogsContainer.appendChild(dogElement);
    });
}


// Добавляем обработчик события click для кнопки "Рандом"
document.getElementById('random-button').addEventListener('click', () => {
    // Очищаем информацию о собаке
    clearDogInfo();

    // Отправляем запрос на API для получения случайного изображения собаки
    fetch("https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", {
        headers: {
            'x-api-key': apiKey // Передаем API ключ в заголовке запроса
        }
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        const dog = data[0]; // Получаем первый элемент из массива, содержащего информацию о собаке
        if (dog.breeds && dog.breeds.length > 0) {
            const breed = dog.breeds[0]; // Получаем информацию о породе собаки
            dog.breeds = [breed]; // Добавляем информацию о породе в объект собаки
            dog.image = { url: dog.url }; // Добавляем URL изображения в объект собаки
            displayDogInfo(dog); // Отображаем информацию о собаке на странице
        } else {
            alert("Информация о породе не найдена"); // Выводим сообщение об ошибке, если информация о породе отсутствует
        }
    })
    .catch(error => console.error("Error fetching data:", error)); // Обрабатываем возможную ошибку при запросе к API
});

// Обработчик события click для кнопки "Поиск"
document.getElementById('search-button').addEventListener('click', () => {
    // Очищаем информацию о собаке
    clearDogInfo();

    // Получаем значение из поля ввода для поиска
    const breedQuery = document.getElementById('search-input').value;

    // Отправляем запрос к API для поиска информации о породе собаки
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${breedQuery}`, {
        headers: {
            'x-api-key': apiKey // Передаем API ключ в заголовке запроса
        }
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        if (data.length > 0) {
            const breed = data[0]; // Получаем информацию о найденной породе
            // Отправляем запрос к API для получения изображения собаки данной породы
            fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breed.id}`, {
                headers: {
                    'x-api-key': apiKey // Передаем API ключ в заголовке запроса
                }
            })
            .then(response => response.json())
            .then(imageData => {
                if (imageData.length > 0) {
                    const dog = imageData[0]; // Получаем информацию о найденной собаке
                    dog.breeds = [breed]; // Добавляем информацию о породе в объект собаки
                    dog.image = { url: dog.url }; // Добавляем URL изображения в объект собаки
                    displayDogInfo(dog); // Отображаем информацию о собаке на странице
                } else {
                    alert("Изображение не найдено"); // Выводим сообщение, если изображение не найдено
                }
            })
            .catch(error => console.error("Error fetching image data:", error));
        } else {
            alert("Порода не найдена"); // Выводим сообщение, если порода не найдена
        }
    })
    .catch(error => console.error("Error fetching breed data:", error)); // Обрабатываем возможную ошибку при запросе к API
});

// Обработчик события click для кнопки "Маленькие"
document.getElementById('small-dogs-button').addEventListener('click', () => {
    // Очищаем информацию о собаке
    clearDogInfo();

    // Отправляем запрос к API для получения списка всех пород собак
    fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
            'x-api-key': apiKey // Передаем API ключ в заголовке запроса
        }
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        // Фильтруем список пород, чтобы оставить только те, у которых вес до 10 кг
        const smallDogs = data.filter(dog => {
            const weightRange = dog.weight.metric.split(" - ");
            return parseInt(weightRange[1]) <= 10;
        });
        // Отображаем изображения собак из списка (не более 4)
        displayDogImages(smallDogs.slice(0, 4));
    })
    .catch(error => console.error("Error fetching data:", error)); // Обрабатываем возможную ошибку при запросе к API
});


// Обработчик события click для кнопки "Средние"
document.getElementById('medium-dogs-button').addEventListener('click', () => {
    // Очищаем информацию о собаке
    clearDogInfo();

    // Отправляем запрос к API для получения списка всех пород собак
    fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
            'x-api-key': apiKey // Передаем API ключ в заголовке запроса
        }
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        // Фильтруем список пород, чтобы оставить только те, у которых вес от 10 до 25 кг
        const mediumDogs = data.filter(dog => {
            const weightRange = dog.weight.metric.split(" - ");
            return parseInt(weightRange[0]) > 10 && parseInt(weightRange[1]) <= 25;
        });
        // Отображаем изображения собак из списка (не более 4)
        displayDogImages(mediumDogs.slice(0, 4));
    })
    .catch(error => console.error("Error fetching data:", error)); // Обрабатываем возможную ошибку при запросе к API
});

// Обработчик события click для кнопки "Большие"
document.getElementById('large-dogs-button').addEventListener('click', () => {
    // Очищаем информацию о собаке
    clearDogInfo();

    // Отправляем запрос к API для получения списка всех пород собак
    fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
            'x-api-key': apiKey // Передаем API ключ в заголовке запроса
        }
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        // Фильтруем список пород, чтобы оставить только те, у которых вес больше 25 кг
        const largeDogs = data.filter(dog => {
            const weightRange = dog.weight.metric.split(" - ");
            return parseInt(weightRange[0]) > 25;
        });
        // Отображаем изображения собак из списка (не более 4)
        displayDogImages(largeDogs.slice(0, 4));
    })
    .catch(error => console.error("Error fetching data:", error)); // Обрабатываем возможную ошибку при запросе к API
});

