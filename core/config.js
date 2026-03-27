// ========== КОНФИГУРАЦИЯ "ТУРБУК" ==========
// Версия конфигурации
const CONFIG = {
    version: "1.0.0",
    name: "ТурБук",
    description: "Конфигурация для бронирования экскурсионных туров",
    developer: "Студент ГБПОУ КС №54",
    date: "2026",
    
    // Настройки модулей
    modules: {
        auth: { enabled: true, name: "Авторизация" },
        tours: { enabled: true, name: "Туры" },
        bookings: { enabled: true, name: "Бронирования" }
    },
    
    // Настройки справочников
    catalogs: {
        tours: { name: "Туры", fields: ["id", "title", "price", "location", "availableSeats"] },
        users: { name: "Пользователи", fields: ["id", "username", "email", "password"] }
    },
    
    // Настройки документов
    documents: {
        bookings: { name: "Бронирования", fields: ["id", "userId", "tourId", "quantity", "total", "status"] }
    }
};

// Сохраняем конфигурацию
localStorage.setItem('appConfig', JSON.stringify(CONFIG));
console.log("Конфигурация 'ТурБук' загружена v" + CONFIG.version);