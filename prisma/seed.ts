/* eslint-disable no-console -- script CLI */
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.menuItem.deleteMany(),
    prisma.category.deleteMany(),
    prisma.restaurant.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.create({
    data: {
      email: "super@restofocus.com",
      passwordHash,
      nom: "Admin",
      prenom: "Super",
      role: "SUPER_ADMIN",
    },
  });

  const chef = await prisma.user.create({
    data: {
      email: "chef@bistro.com",
      passwordHash,
      nom: "Martin",
      prenom: "Chef",
      role: "RESTAURANT_ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "client@restofocus.com",
      passwordHash,
      nom: "Dupont",
      prenom: "Client",
      role: "CUSTOMER",
    },
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      nom: "Le Bistro Parisien",
      slug: "le-bistro-parisien",
      description: "Cuisine française de saison en plein cœur de Paris.",
      adresse: "12 Rue de Rivoli, 75001 Paris",
      proprietaireId: chef.id,
      telephone: "+33 1 42 00 00 00",
      emailPublic: "contact@bistroparisien.fr",
      servesCuisine: "Cuisine française",
      acceptsReservations: true,
      reservationUrl: "/reservation/le-bistro-parisien",
      openingHours: "Lun-Dim 12:00-14:30, 19:00-22:30",
      googleMapsUrl: "https://maps.google.com/?q=12+Rue+de+Rivoli,+75001+Paris",
    },
  });

  const categoryEntrees = await prisma.category.create({
    data: {
      nom: "Entrées",
      restaurantId: restaurant.id,
    },
  });

  const categoryPlats = await prisma.category.create({
    data: {
      nom: "Plats",
      restaurantId: restaurant.id,
    },
  });

  const categoryDesserts = await prisma.category.create({
    data: {
      nom: "Desserts",
      restaurantId: restaurant.id,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        nom: "Velouté de potiron",
        description: "Châtaignes, huile de noisette",
        prix: new Prisma.Decimal("8.50"),
        categoryId: categoryEntrees.id,
        restaurantId: restaurant.id,
      },
      {
        nom: "Bœuf bourguignon",
        description: "Mijoté au vin rouge, carottes et champignons",
        prix: new Prisma.Decimal("22.00"),
        categoryId: categoryPlats.id,
        restaurantId: restaurant.id,
      },
      {
        nom: "Tarte tatin",
        description: "Pommes caramélisées, crème fraîche",
        prix: new Prisma.Decimal("9.50"),
        categoryId: categoryDesserts.id,
        restaurantId: restaurant.id,
      },
    ],
  });

  console.log("Seed terminé.");
  console.log("Comptes disponibles :");
  console.log("- super@restofocus.com / password123");
  console.log("- chef@bistro.com / password123");
  console.log("- client@restofocus.com / password123");
  console.log(`Restaurant : ${restaurant.nom} (${restaurant.slug})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });