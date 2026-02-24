# 🚀 AuctionHub — Real-Time Auction Platform

AuctionHub est une application full-stack d’enchères en temps réel permettant aux utilisateurs de vendre et d’acheter des produits avec mise à jour instantanée des prix.

---

## 🎯 Objectifs du projet

- Construire une application **full-stack sécurisée**
- Implémenter du **temps réel avec WebSockets**
- Gérer la **concurrence serveur**
- Mettre en place une **architecture prête pour la production**

---

## 🧩 Fonctionnalités principales

### Backend
- **Authentification JWT** : Inscription, connexion et gestion des rôles (BUYER/SELLER)
- **Gestion des produits** : Création et consultation avec timer d'enchères
- **Système d'enchères** : Validation (montant minimum, non-vendeur) avec mise à jour prix
- **WebSockets** : Diffusion en temps réel des nouvelles enchères à tous les clients
- **Historique** : Consultation de toutes les enchères par produit
- **Tests** : Configuration H2 pour l'intégration continue

### Frontend
- **Interface moderne** : Design responsive avec SCSS
- **Temps réel** : Mise à jour instantanée des prix via WebSockets
- **Pages complètes** : Accueil, Connexion, Inscription, Liste produits, Détail produit
- **Navigation fluide** : Routing avec lazy loading
- **Timers** : Affichage du temps restant avec mise à jour automatique
- **Gestion rôles** : Interface adaptée selon le statut (acheteur/vendeur)

### Infrastructure
- **Docker** : Conteneurisation de la base PostgreSQL
- **CI/CD** : Pipeline GitHub Actions avec tests automatisés
- **Base de données** : PostgreSQL (dev) / H2 (CI)

---

## 🏗️ Stack technique

### Backend
- Java 17+
- Spring Boot 3.4.2
- Spring Security + JWT
- Spring Data JPA / Hibernate
- WebSockets STOMP
- PostgreSQL / H2
- Maven avec wrapper

### Frontend
- Angular 21+ (standalone components)
- RxJS / Signals
- @stom/stompjs +  sokkjs-client
- SCSS

### DevOps
- Docker 
- GitHub Actions (CI/CD)

---

# 📁 Structure du projet
AuctionHub/
│
├── auction-engine/ # Backend Spring Boot
|    |...
|
├── auction-frontend/ # Frontend Angular
|    |...
|
├── docker-compose.yml # Base PostgreSQL
├── README.md
└── ...


---

# ⚙️ Installation
## Prérequis
- Java 17+
- Node.js 20+
- Docker Desktop
- Git

## 1️⃣ Cloner le projet

```bash
git clone <repo-url>
cd AuctionHub
```

## 2️⃣ Lancer PostgreSQL avec Docker
```
docker-compose up -d
```
## 3️⃣ Lancer le Backend

```
cd auction-engine
./mvnw spring-boot:run   # Mac/Linux
# ou
./mvnw spring-boot:run   # Windows
```

Backend disponible sur :
```
http://localhost:8080
```

## 4️⃣ Lancer le Frontend
```
cd auction-frontend
npm install
ng serve
```
Frontend disponible sur :
```
http://localhost:4200
```

# 🐳 Déploiement avec Docker
## Backend
```
cd auction-engine
# Build de l'image
docker build -t auction-backend .
# Lancement du conteneur
docker run -p 8080:8080 --network host auction-backend
```

## Frontend
```
cd auction-frontend
# Build de l'image
docker build -t auction-frontend .
# Lancement du conteneur
docker run -p 80:80 auction-frontend
```

# 📬 Contact
#### 🔗 LinkedIn : in/alpha-diallo-mb
#### 🐙 GitHub : @alphambd




