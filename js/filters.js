// Données des restaurants
const restaurants = [
    {
        id: 1,
        name: "La Kabananou",
        cuisine: ["Fruits de mer", "Créole", "Poisson"],
        zone: "Sud",
        prix: "€€",
        rating: 4.7,
        specialites: ["Fruits de mer", "Poisson frais", "Langouste", "Cuisine créole"],
        horaires: {
            lundi: "11h30 - 15h30",
            mardi: "11h30 - 15h30",
            mercredi: "Fermé",
            jeudi: "Fermé",
            vendredi: "11h30 - 15h30",
            samedi: "11h30 - 15h30",
            dimanche: "11h30 - 15h30"
        }
    },
    // Autres restaurants...
];

// État des filtres
let activeFilters = {
    cuisine: [],
    zone: [],
    prix: [],
    ouvert: false,
    searchTerm: ""
};

// Initialisation des filtres
function initializeFilters() {
    // Écouter les changements dans la barre de recherche
    document.getElementById("searchInput").addEventListener("input", (e) => {
        activeFilters.searchTerm = e.target.value.toLowerCase();
        applyFilters();
    });

    // Écouter les changements de filtres
    document.querySelectorAll(".filter-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const filterType = e.target.dataset.filterType;
            const filterValue = e.target.value;

            if (e.target.checked) {
                activeFilters[filterType].push(filterValue);
            } else {
                activeFilters[filterType] = activeFilters[filterType].filter(v => v !== filterValue);
            }
            applyFilters();
        });
    });

    // Écouter le filtre "Ouvert maintenant"
    document.getElementById("ouvertMaintenant").addEventListener("change", (e) => {
        activeFilters.ouvert = e.target.checked;
        applyFilters();
    });
}

// Appliquer les filtres
function applyFilters() {
    const filteredRestaurants = restaurants.filter(restaurant => {
        // Filtre par terme de recherche
        if (activeFilters.searchTerm && !restaurant.name.toLowerCase().includes(activeFilters.searchTerm)) {
            return false;
        }

        // Filtre par cuisine
        if (activeFilters.cuisine.length > 0 && !activeFilters.cuisine.some(c => restaurant.cuisine.includes(c))) {
            return false;
        }

        // Filtre par zone
        if (activeFilters.zone.length > 0 && !activeFilters.zone.includes(restaurant.zone)) {
            return false;
        }

        // Filtre par prix
        if (activeFilters.prix.length > 0 && !activeFilters.prix.includes(restaurant.prix)) {
            return false;
        }

        // Filtre "Ouvert maintenant"
        if (activeFilters.ouvert && !isRestaurantOpen(restaurant)) {
            return false;
        }

        return true;
    });

    displayResults(filteredRestaurants);
}

// Vérifier si un restaurant est ouvert
function isRestaurantOpen(restaurant) {
    const now = new Date();
    const jour = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][now.getDay()];
    const horaire = restaurant.horaires[jour];
    
    if (horaire === "Fermé") return false;
    
    // Convertir l'heure actuelle et les horaires du restaurant en minutes
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [debut, fin] = horaire.split(" - ").map(time => {
        const [hours, minutes] = time.split("h").map(Number);
        return hours * 60 + (minutes || 0);
    });
    
    return currentTime >= debut && currentTime <= fin;
}

// Afficher les résultats
function displayResults(restaurants) {
    const container = document.getElementById("restaurantsContainer");
    container.innerHTML = "";
    
    if (restaurants.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>Aucun restaurant ne correspond à vos critères</p>
            </div>
        `;
        return;
    }
    
    restaurants.forEach(restaurant => {
        container.appendChild(createRestaurantCard(restaurant));
    });
}

// Créer une carte de restaurant
function createRestaurantCard(restaurant) {
    const card = document.createElement("div");
    card.className = "restaurant-card";
    // ... Création du HTML pour la carte ...
    return card;
}

// Initialiser les filtres au chargement
document.addEventListener("DOMContentLoaded", initializeFilters);