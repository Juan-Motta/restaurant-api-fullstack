export function getRandomItem(): string {
  const fruits = [
    'manzana',
    'banana',
    'naranja',
    'uva',
    'fresa',
    'kiwi',
    'mango',
    'sandia',
    'pera',
    'piña',
    'mora',
    'papaya',
  ]

  const colors = [
    'rojo',
    'azul',
    'verde',
    'amarillo',
    'purpura',
    'naranja',
    'rosa',
    'cafe',
    'negro',
    'blanco',
    'gris',
    'violeta',
    'indigo',
    'plata',
    'oro',
  ]

  const animals = [
    'leon',
    'tigre',
    'oso',
    'elefante',
    'girafa',
    'zebra',
    'kanguro',
    'conejo',
    'zorro',
    'ardilla',
    'ciervo',
    'lobo',
    'aguila',
    'delfin',
    'tiburon',
    'ballena',
    'halcon',
    'pinguino',
    'pulso',
    'serpiente',
  ]

  const cars = [
    'Toyota',
    'Honda',
    'Ford',
    'Chevrolet',
    'Nissan',
    'BMW',
    'Mercedes',
    'Volkswagen',
    'Hyundai',
    'Kia',
    'Lexus',
    'Audi',
    'Subaru',
    'Mazda',
    'Porsche',
    'Tesla',
    'Jaguar',
    'Land Rover',
    'Fiat',
    'Volvo',
  ]

  const items = [...fruits, ...colors, ...animals, ...cars]

  const randomIndex = Math.floor(Math.random() * items.length)

  return items[randomIndex]
}
