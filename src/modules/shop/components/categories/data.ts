import { color } from "framer-motion"

const Dessert = "/images/categories/dessert.png"
const Meal = "/images/categories/dinner-plate.png"
const Drink = "/images/categories/drink.png"
const Snack = "/images/categories/snacks.png"
const Samosa = "/images/categories/samosa.png"
const Pizza = "/images/categories/pizza-box.png"
const Fries = "/images/categories/fries.png"

export const categories = [
  {
    id: 1,
    name: "Meal",
    icon: Meal,
    color: "#ffedd5",
    borderColor: "#fb923c"
  },
  {
    id: 2,
    name: "Snack",
    icon: Snack,
    color: "#fef9c3",
    borderColor: "#facc15"
  },
  {
    id: 3,
    name: "Dessert",
    icon: Dessert,
    color: "#dcfce7",
    borderColor: "#4ade80"
  },
  {
    id: 4,
    name: "Sides",
    icon: Fries,
    color: "#ecfccb",
    borderColor: "#a3e635"
  },
  {
    id: 5,
    name: "Small Chops",
    icon: Samosa,
    color: "#e0f2fe",
    borderColor: "#38bdf8"
  },
  {
    id: 6,
    name: "Variety",
    icon: Pizza,
    color: "#ede9fe",
    borderColor: "#a78bfa"
  },
  {
    id: 7,
    name: "Drink",
    icon: Drink,
    color: "#ffe4e6",
    borderColor: "#fb7185"
  },

]