// ========== ЗАГРУЗКА СПРАВОЧНИКОВ КОНФИГУРАЦИИ ==========

// Справочник "Туры"
let tours = [];

// Справочник "Пользователи"
let users = [];

// Документ "Бронирования"
let bookings = [];

// Текущий пользователь (сессия)
let currentUser = null;

// ========== ЗАГРУЗКА ДАННЫХ ИЗ JSON ==========
async function loadConfiguration() {
    try {
        // Загружаем справочник "Туры"
        const toursResponse = await fetch('data/tours.json');
        const toursData = await toursResponse.json();
        tours = toursData.data;
        console.log(`✅ Справочник "Туры" загружен: ${tours.length} записей`);
        
        // Загружаем пользователей из localStorage
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            users = JSON.parse(savedUsers);
        }
        
        // Загружаем бронирования из localStorage
        const savedBookings = localStorage.getItem('bookings');
        if (savedBookings) {
            bookings = JSON.parse(savedBookings);
        }
        
        // Загружаем текущего пользователя
        const savedCurrentUser = localStorage.getItem('currentUser');
        if (savedCurrentUser) {
            currentUser = JSON.parse(savedCurrentUser);
        }
        
        console.log(`📦 Конфигурация "ТурБук" загружена`);
        console.log(`   - Справочник "Туры": ${tours.length} записей`);
        console.log(`   - Справочник "Пользователи": ${users.length} записей`);
        console.log(`   - Документ "Бронирования": ${bookings.length} записей`);
        
    } catch (error) {
        console.error('❌ Ошибка загрузки конфигурации:', error);
        // Используем резервные данные
        useBackupData();
    }
}

// Резервные данные (на случай ошибки загрузки JSON)
function useBackupData() {
    tours = [
        { id: 1, code: "TR-001", name: "Обзорная экскурсия по Москве", price: 1500, duration: "3 часа", location: "Москва", maxPeople: 20, availableSeats: 15, date: "2026-04-15T10:00:00", active: true, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop" },
        { id: 2, code: "TR-002", name: "Эрмитаж", price: 2000, duration: "2 часа", location: "Санкт-Петербург", maxPeople: 10, availableSeats: 8, date: "2026-04-16T11:00:00", active: true, imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=500&fit=crop" }
    ];
    users = JSON.parse(localStorage.getItem('users')) || [];
    bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    console.log('⚠️ Используются резервные данные');
}

// Функция сохранения всех данных
function saveAllData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Функция для экспорта данных (как в 1С)
function exportData() {
    const exportData = {
        config: CONFIG,
        tours: tours,
        users: users,
        bookings: bookings,
        exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turbuk_export_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Данные экспортированы');
}

// Функция для импорта данных (как в 1С)
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.tours) tours = data.tours;
            if (data.users) users = data.users;
            if (data.bookings) bookings = data.bookings;
            saveAllData();
            alert('✅ Данные импортированы');
            location.reload();
        } catch (error) {
            alert('❌ Ошибка импорта');
        }
    };
    reader.readAsText(file);
}

// Загружаем конфигурацию при старте
loadConfiguration();

// Добавляем глобальные функции
window.exportData = exportData;
window.importData = importData;