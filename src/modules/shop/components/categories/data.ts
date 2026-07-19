const Dessert = "/images/categories/dessert.png";
const Meal = "/images/categories/dinner-plate.png";
const Drink = "/images/categories/drink.png";
const Snack = "/images/categories/snacks.png";
const Samosa = "/images/categories/samosa.png";
const Pizza = "/images/categories/pizza-box.png";
const Fries = "/images/categories/fries.png";

export const categories = [
  { id: 1, name: "Meal", icon: Meal },
  { id: 2, name: "Snack", icon: Snack },
  { id: 3, name: "Dessert", icon: Dessert },
  { id: 4, name: "Sides", icon: Fries },
  { id: 5, name: "Small Chops", icon: Samosa },
  { id: 6, name: "Variety", icon: Pizza },
  { id: 7, name: "Drink", icon: Drink },
] as const;
