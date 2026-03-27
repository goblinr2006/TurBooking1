// ========== АВТОРИЗАЦИЯ ==========
function renderAuthSection() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;
    
    if (currentUser) {
        authSection.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.username}</span>
                <button onclick="logout()" class="btn-logout">Выйти</button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <div class="auth-buttons">
                <a href="login.html" class="btn btn-outline">Войти</a>
                <a href="register.html" class="btn btn-primary">Регистрация</a>
            </div>
        `;
    }
}

function checkAuth() {
    renderAuthSection();
}

function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    
    if (password !== password2) {
        alert('Пароли не совпадают!');
        return false;
    }
    
    if (users.find(u => u.username === username || u.email === email)) {
        alert('Пользователь с таким именем или email уже существует!');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    currentUser = newUser;
    saveAllData();
    
    alert('Регистрация успешна!');
    window.location.href = 'index.html';
    return false;
}

function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('Неверное имя пользователя или пароль!');
        return false;
    }
    
    currentUser = user;
    saveAllData();
    
    alert('Вход выполнен!');
    window.location.href = 'index.html';
    return false;
}

function logout() {
    currentUser = null;
    saveAllData();
    window.location.href = 'index.html';
}

// ========== ФУНКЦИИ ТУРОВ ==========
function loadPopularTours() {
    const container = document.getElementById('popularTours');
    if (!container) return;
    
    const popularTours = tours.slice(0, 3);
    container.innerHTML = popularTours.map(tour => createTourCard(tour)).join('');
}

function loadAllTours() {
    const container = document.getElementById('allTours');
    if (!container) return;
    
    container.innerHTML = tours.map(tour => createTourCard(tour)).join('');
}

function filterTours() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const location = document.getElementById('locationFilter')?.value || '';
    const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
    
    const filtered = tours.filter(tour => {
        const matchSearch = tour.title.toLowerCase().includes(search) || 
                           (tour.shortDescription && tour.shortDescription.toLowerCase().includes(search)) ||
                           (tour.description && tour.description.toLowerCase().includes(search));
        const matchLocation = !location || tour.location === location;
        const matchPrice = tour.price >= minPrice && tour.price <= maxPrice;
        return matchSearch && matchLocation && matchPrice;
    });
    
    const container = document.getElementById('allTours');
    if (container) {
        container.innerHTML = filtered.map(tour => createTourCard(tour)).join('');
    }
}

function createTourCard(tour) {
    const date = new Date(tour.date);
    const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    
    const shortDesc = tour.shortDescription || tour.description.substring(0, 100);
    
    return `
        <div class="tour-card" onclick="goToTourDetail(${tour.id})">
            <div class="tour-image">
                <img src="${tour.imageUrl}" alt="${tour.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="tour-content">
                <h3 class="tour-title">${tour.title}</h3>
                <p class="tour-description">${shortDesc.length > 100 ? shortDesc.substring(0, 100) + '...' : shortDesc}</p>
                <div class="tour-info">
                    <span><i class="fas fa-map-pin"></i> ${tour.location}</span>
                    <span><i class="fas fa-clock"></i> ${tour.duration}</span>
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-users"></i> ${tour.availableSeats} мест</span>
                </div>
                <div class="tour-price">${tour.price.toLocaleString()} ₽</div>
                <button class="btn btn-primary" onclick="event.stopPropagation(); bookTour(${tour.id})">Забронировать</button>
            </div>
        </div>
    `;
}

// ========== ФУНКЦИЯ ПЕРЕХОДА НА СТРАНИЦУ ПОДРОБНОСТЕЙ ==========
function goToTourDetail(tourId) {
    window.location.href = `tour-detail.html?id=${tourId}`;
}

// ========== ФУНКЦИЯ ЗАГРУЗКИ ПОДРОБНОЙ ИНФОРМАЦИИ О ТУРЕ ==========
function loadTourDetail() {
    const container = document.getElementById('tourDetail');
    if (!container) return;
    
    // Получаем ID тура из URL
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = parseInt(urlParams.get('id'));
    
    const tour = tours.find(t => t.id === tourId);
    
    if (!tour) {
        container.innerHTML = `
            <div class="tour-detail-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Тур не найден</p>
                <a href="tours.html" class="btn btn-primary">Вернуться к турам</a>
            </div>
        `;
        return;
    }
    
    const date = new Date(tour.date);
    const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    container.innerHTML = `
        <div class="tour-detail-content">
            <div class="tour-detail-image">
                <img src="${tour.imageUrl}" alt="${tour.title}">
            </div>
            <div class="tour-detail-info">
                <h1>${tour.title}</h1>
                <div class="tour-detail-meta">
                    <span><i class="fas fa-map-pin"></i> ${tour.location}</span>
                    <span><i class="fas fa-clock"></i> ${tour.duration}</span>
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-users"></i> Осталось мест: ${tour.availableSeats} из ${tour.maxPeople}</span>
                </div>
                
                <div class="tour-detail-section">
                    <h3><i class="fas fa-info-circle"></i> О туре</h3>
                    <p>${tour.description || tour.shortDescription || 'Увлекательная экскурсия с профессиональным гидом.'}</p>
                </div>
                
                <div class="tour-detail-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Место встречи</h3>
                    <p>${tour.meetingPoint || 'Уточняется при бронировании (гид свяжется с вами)'}</p>
                </div>
                
                <div class="tour-detail-grid">
                    <div class="tour-detail-section">
                        <h3><i class="fas fa-check-circle"></i> Включено</h3>
                        <p>${tour.includes || '✓ Услуги профессионального гида\n✓ Экскурсионное обслуживание\n✓ Аудиосистема (при необходимости)'}</p>
                    </div>
                    <div class="tour-detail-section">
                        <h3><i class="fas fa-times-circle"></i> Не включено</h3>
                        <p>${tour.notIncludes || '✗ Трансфер до места встречи\n✗ Питание и напитки\n✗ Личные расходы'}</p>
                    </div>
                </div>
                
                <div class="tour-detail-price">
                    <div class="price">${tour.price.toLocaleString()} ₽</div>
                    <div class="price-note">за человека</div>
                </div>
                
                <div class="tour-detail-buttons">
                    <button class="btn btn-primary btn-large" onclick="bookTour(${tour.id})">
                        <i class="fas fa-ticket-alt"></i> Забронировать сейчас
                    </button>
                    <a href="tours.html" class="btn btn-outline btn-large">← Назад к турам</a>
                </div>
            </div>
        </div>
    `;
}

// ========== ФУНКЦИИ БРОНИРОВАНИЯ ==========
function bookTour(tourId) {
    if (!currentUser) {
        if (confirm('Для бронирования необходимо войти в систему. Перейти на страницу входа?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return;
    
    const quantity = prompt('Введите количество человек:', '1');
    if (!quantity) return;
    
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
        alert('Пожалуйста, введите корректное количество человек (от 1 до 10)');
        return;
    }
    
    if (numQuantity > tour.availableSeats) {
        alert(`Извините, доступно только ${tour.availableSeats} мест. Пожалуйста, уменьшите количество.`);
        return;
    }
    
    const phone = prompt('Введите ваш контактный телефон (для связи):', '+7');
    if (!phone || phone.length < 5) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    const comment = prompt('Есть ли у вас особые пожелания? (необязательно)', '');
    
    const newBooking = {
        id: Date.now(),
        userId: currentUser.id,
        tourId: tour.id,
        title: tour.title,
        location: tour.location,
        price: tour.price,
        quantity: numQuantity,
        total: tour.price * numQuantity,
        date: new Date().toISOString(),
        status: 'pending',
        phone: phone,
        comment: comment || ''
    };
    
    bookings.push(newBooking);
    
    // Обновляем доступные места
    tour.availableSeats -= numQuantity;
    
    saveAllData();
    
    alert(`✅ Бронирование успешно создано!\n\n📌 Тур: ${tour.title}\n👥 Количество: ${numQuantity} чел.\n💰 Сумма: ${newBooking.total.toLocaleString()} ₽\n📞 Телефон: ${phone}\n\nПерейдите в "Мои бронирования" для оплаты.`);
    
    window.location.href = 'bookings.html';
}

function payBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.userId === currentUser?.id) {
        if (confirm(`Оплатить "${booking.title}" на сумму ${booking.total.toLocaleString()} ₽?`)) {
            booking.status = 'paid';
            saveAllData();
            alert(`✅ Оплата прошла успешно!\n\nТур: ${booking.title}\nСумма: ${booking.total.toLocaleString()} ₽\nСпасибо за покупку!`);
            loadBookings();
        }
    }
}

function cancelBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.userId === currentUser?.id) {
        if (confirm(`Отменить бронирование "${booking.title}"?\n\nСумма возврата: ${booking.total.toLocaleString()} ₽`)) {
            // Возвращаем места
            const tour = tours.find(t => t.id === booking.tourId);
            if (tour) {
                tour.availableSeats += booking.quantity;
            }
            booking.status = 'cancelled';
            saveAllData();
            alert('❌ Бронирование отменено. Средства будут возвращены в течение 3-5 рабочих дней.');
            loadBookings();
        }
    }
}

function loadBookings() {
    const container = document.getElementById('bookingsList');
    if (!container) return;
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lock"></i>
                <p>Войдите в систему, чтобы просмотреть бронирования</p>
                <a href="login.html" class="btn btn-primary">Войти</a>
            </div>
        `;
        return;
    }
    
    const userBookings = bookings.filter(b => b.userId === currentUser.id);
    
    if (userBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <p>У вас пока нет бронирований</p>
                <a href="tours.html" class="btn btn-primary">Выбрать тур</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userBookings.map(booking => {
        const bookingDate = new Date(booking.date);
        const formattedDate = bookingDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let statusText = '';
        let statusClass = '';
        let statusIcon = '';
        
        switch(booking.status) {
            case 'pending':
                statusText = 'Ожидает оплаты';
                statusClass = 'status-pending';
                statusIcon = '⏳';
                break;
            case 'paid':
                statusText = 'Оплачен';
                statusClass = 'status-paid';
                statusIcon = '✅';
                break;
            case 'cancelled':
                statusText = 'Отменен';
                statusClass = 'status-cancelled';
                statusIcon = '❌';
                break;
        }
        
        return `
            <div class="booking-card">
                <div class="booking-info">
                    <h3>${booking.title}</h3>
                    <div class="booking-details">
                        <span><i class="fas fa-map-pin"></i> ${booking.location}</span>
                        <span><i class="fas fa-user-friends"></i> ${booking.quantity} чел.</span>
                        <span><i class="fas fa-ruble-sign"></i> ${booking.total.toLocaleString()} ₽</span>
                        <span><i class="fas fa-phone"></i> ${booking.phone || 'Не указан'}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                    </div>
                    ${booking.comment ? `<p class="booking-comment"><i class="fas fa-comment"></i> ${booking.comment}</p>` : ''}
                </div>
                <div class="booking-status-area">
                    <span class="booking-status ${statusClass}">${statusIcon} ${statusText}</span>
                    ${booking.status === 'pending' ? `
                        <div class="booking-actions">
                            <button onclick="payBooking(${booking.id})" class="btn btn-primary btn-small">
                                <i class="fas fa-credit-card"></i> Оплатить
                            </button>
                            <button onclick="cancelBooking(${booking.id})" class="btn btn-danger btn-small">
                                <i class="fas fa-times"></i> Отменить
                            </button>
                        </div>
                    ` : ''}
                    ${booking.status === 'paid' ? `
                        <div class="booking-paid-note">
                            <i class="fas fa-check-circle"></i> Оплачено
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ СТРАНИЦ ==========
// Функция для отладки (можно вызвать в консоли)
function showAllData() {
    console.log('=== ВСЕ ПОЛЬЗОВАТЕЛИ ===');
    console.table(users);
    console.log('=== ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ ===');
    console.log(currentUser);
    console.log('=== ВСЕ ТУРЫ ===');
    console.table(tours);
    console.log('=== ВСЕ БРОНИРОВАНИЯ ===');
    console.table(bookings);
}

// Функция для очистки всех данных (для тестирования)
function clearAllData() {
    if (confirm('ВНИМАНИЕ! Это удалит всех пользователей, все бронирования и выйдет из аккаунта. Продолжить?')) {
        users = [];
        bookings = [];
        currentUser = null;
        saveAllData();
        alert('Все данные очищены!');
        window.location.href = 'index.html';
    }
}

// Добавляем глобальные функции для доступа из HTML
window.register = register;
window.login = login;
window.logout = logout;
window.bookTour = bookTour;
window.payBooking = payBooking;
window.cancelBooking = cancelBooking;
window.filterTours = filterTours;
window.goToTourDetail = goToTourDetail;
window.loadTourDetail = loadTourDetail;
window.showAllData = showAllData;
window.clearAllData = clearAllData;
