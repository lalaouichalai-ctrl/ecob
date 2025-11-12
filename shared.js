// =======================================================
// shared.js (CORRIGÉ ET COMPLET)
// =======================================================

const STORAGE_KEY = 'bankAppUsers';

// --- Données initiales ---
const initialUsers = [
    {
        name: "Admin Général",
        clientCode: "0000000000",
        pin: "000000",
        solde: 999999.00,
        isAdmin: true,
        isLocked: false,
        lockReason: "",
        rib: "FR76 0000 0000 0000 0000 0000 000",
        bic: "ADMINXXX",
        phone: "0100000000",
        email: "admin@banque.com",
        address: "Siège Social, 75000 Paris",
        advisor: "Le Système",
        cardNumber: "9999000000009999",
        cardHolderName: "ADMIN GENERAL",
        expiryDate: "12/99",
        cardType: "MASTERCARD",
        history: [],
        beneficiaries: [],
        futureTransactions: [],
        lastConnection: "03/05/2020 à 13h51"
    },
    // --- 15 admins supplémentaires avec codes fixes ---
    {
        name: "Admin 1",
        clientCode: "5294620168",
        pin: "483920",
        solde: 500000.00,
        isAdmin: true,
        email: "admin1@banque.com"
    },
    {
        name: "Admin 2",
        clientCode: "8371945023",
        pin: "192837",
        solde: 500000.00,
        isAdmin: true,
        email: "admin2@banque.com"
    },
    {
        name: "Admin 3",
        clientCode: "6049182735",
        pin: "748291",
        solde: 500000.00,
        isAdmin: true,
        email: "admin3@banque.com"
    },
    {
        name: "Admin 4",
        clientCode: "9513720486",
        pin: "564839",
        solde: 500000.00,
        isAdmin: true,
        email: "admin4@banque.com"
    },
    {
        name: "Admin 5",
        clientCode: "2837465910",
        pin: "930182",
        solde: 500000.00,
        isAdmin: true,
        email: "admin5@banque.com"
    },
    {
        name: "Admin 6",
        clientCode: "7482910563",
        pin: "384920",
        solde: 500000.00,
        isAdmin: true,
        email: "admin6@banque.com"
    },
    {
        name: "Admin 7",
        clientCode: "1928374650",
        pin: "582930",
        solde: 500000.00,
        isAdmin: true,
        email: "admin7@banque.com"
    },
    {
        name: "Admin 8",
        clientCode: "3748291056",
        pin: "109283",
        solde: 500000.00,
        isAdmin: true,
        email: "admin8@banque.com"
    },
    {
        name: "Admin 9",
        clientCode: "9182736450",
        pin: "847392",
        solde: 500000.00,
        isAdmin: true,
        email: "admin9@banque.com"
    },
    {
        name: "Admin 10",
        clientCode: "5648392017",
        pin: "293847",
        solde: 500000.00,
        isAdmin: true,
        email: "admin10@banque.com"
    },
    {
        name: "Admin 11",
        clientCode: "8374659201",
        pin: "675849",
        solde: 500000.00,
        isAdmin: true,
        email: "admin11@banque.com"
    },
    {
        name: "Admin 12",
        clientCode: "1092837465",
        pin: "384756",
        solde: 500000.00,
        isAdmin: true,
        email: "admin12@banque.com"
    },
    {
        name: "Admin 13",
        clientCode: "2938475610",
        pin: "918273",
        solde: 500000.00,
        isAdmin: true,
        email: "admin13@banque.com"
    },
    {
        name: "Admin 14",
        clientCode: "6758493021",
        pin: "564738",
        solde: 500000.00,
        isAdmin: true,
        email: "admin14@banque.com"
    },
    {
        name: "Admin 15",
        clientCode: "3847561920",
        pin: "203948",
        solde: 500000.00,
        isAdmin: true,
        email: "admin15@banque.com"
    }
];

// --- Fonctions de base ---
function getUsers() {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!users || users.length === 0) {
        users = initialUsers;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    return users;
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function updateUser(updatedUser) {
    let users = getUsers();
    const index = users.findIndex(u => u.clientCode === updatedUser.clientCode);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
        return true;
    }
    return false;
}

function createUser(newUser) {
    let users = getUsers();
    if (users.some(u => u.clientCode === newUser.clientCode)) {
        return false;
    }
    const defaultCardName = newUser.name ? newUser.name.toUpperCase() : "NOUVEAU CLIENT";
    const finalUser = {
        ...newUser,
        history: [],
        beneficiaries: [],
        futureTransactions: [],
        lastConnection: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
        cardHolderName: newUser.cardHolderName || defaultCardName,
        lockReason: newUser.isLocked ? newUser.lockReason || 'Nouveau compte à vérifier.' : ''
    };
    users.push(finalUser);
    saveUsers(users);
    return true;
}

function addPastHistory(clientCode, transaction) {
    let users = getUsers();
    const user = users.find(u => u.clientCode === clientCode);
    if (user) {
        user.history = user.history || [];
        user.history.push({ ...transaction });
        user.solde = user.solde + transaction.amount;
        user.history.sort((a, b) => new Date(b.date) - new Date(a.date));
        saveUsers(users);
        return true;
    }
    return false;
}

// --- Fonctions utilitaires ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function checkAuth(adminOnly = false) {
    const sessionClientCode = localStorage.getItem('currentClientCode');
    const users = getUsers();
    const currentUser = users.find(u => u.clientCode === sessionClientCode);

    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }

    if (adminOnly && !currentUser.isAdmin) {
        window.location.href = 'dashboard.html';
        return null;
    }

    const userInfoElement = document.querySelector('.user-info span:first-child');
    if (userInfoElement) {
        userInfoElement.textContent = `Bienvenue ${currentUser.name}`;
    }

    const lastConnElement = document.querySelector('.last-conn');
    if (lastConnElement) {
        lastConnElement.textContent = `Dernière connexion le ${currentUser.lastConnection}`;
    }

    const logoutLink = document.querySelector('.status');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentClientCode');
            window.location.href = 'index.html';
        });
    }

    return currentUser;
}
