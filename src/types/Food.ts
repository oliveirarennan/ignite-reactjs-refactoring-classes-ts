export type FoodType = {
  id: number,
  name: string,
  description: string
  price: number,
  available: boolean,
  image: string
}

export type AddFoodType = {
  name: string,
  description: string
  price: number,
  available: boolean,
  image: string
}