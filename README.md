# 🚀 AuctionHub — Real-Time Auction Platform

AuctionHub est une application full-stack d’enchères en temps réel permettant aux utilisateurs de vendre et d’acheter des produits avec mise à jour instantanée des prix.

---

## 🎯 Objectifs du projet

- Construire une application **full-stack sécurisée**
- Implémenter du **temps réel avec WebSockets**
- Gérer la **concurrence serveur**
- Mettre en place une **architecture prête pour la production**
- Valoriser des compétences concrètes pour un stage développeur

---

## 🧩 Fonctionnalités principales

- 🔐 Authentification sécurisée avec JWT (Spring Security)
- 🛒 Catalogue produits avec enchères limitées dans le temps
- ⚡ Mise à jour du prix en temps réel via WebSockets (STOMP)
- 👥 Gestion des rôles utilisateur (acheteur / vendeur)
- 💳 Paiement simulé avec Stripe
- 📊 Dashboard Angular pour visualiser les ventes

---

## 🏗️ Stack technique

### Backend
- Java 17+
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA / Hibernate
- WebSockets STOMP
- Maven

### Frontend
- Angular 17+
- RxJS / Signals
- SCSS

### Infrastructure
- PostgreSQL (Docker)
- Docker Compose
- GitHub Actions (CI ready)

---

# 📁 Structure du projet
AuctionHub/
│

├── auction-engine/ # Backend Spring Boot

├── auction-frontend/ # Frontend Angular

├── docker-compose.yml # Base PostgreSQL

└── README.md


---

# ⚙️ Installation

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
./mvnw spring-boot:run
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

# 📌 État du projet

## 🟢 En développement actif




