document.getElementById("findDuplicates").addEventListener("click", async () => {
  // Получаем активную вкладку
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Проверяем, что URL вкладки начинается с "http" или "https"
  if (tab.url.startsWith("http")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: findDuplicateNumbers
    });
  } else {
    // Если вкладка недоступна, выводим сообщение об ошибке
    alert("Это расширение не может работать на системных страницах.");
  }
});

// Функция для поиска дублей номеров
function findDuplicateNumbers() {
  const numbers = [];
  const duplicates = [];

  // Получаем весь текст страницы
  const pageText = document.body.innerText;

  // Ищем все числа, которые предшествуют символу "№" и включают как минимум 5 цифр, но не более 10
  const regex = /№\s*\d{5,}/g;
  let match;

  while ((match = regex.exec(pageText)) !== null) {
    const number = match[0].trim(); // Обрезаем лишние пробелы

    // Проверяем длину числа: должно быть не более 10 знаков
    if (number.length <= 12) { // 2 символа для "№ " и до 10 цифр
      if (numbers.includes(number)) {
        duplicates.push(number);
      } else {
        numbers.push(number);
      }
    }
  }

  // Отображаем результат
  if (duplicates.length > 0) {
    alert(`Найдены дублирующиеся номера: ${duplicates.join(", ")}`);
  } else {
    alert("Дублирующиеся номера не найдены.");
  }
}
