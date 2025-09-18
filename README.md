# pokeapi-25-26
Ver mis pokemons de la API

Este pequeño proyecto contiene un servidor Node + Express que consulta la PokéAPI y permite filtrar pokémons por nombre.

Archivos principales:

- `package.json` - dependencias y scripts
- `src/index.js` - servidor Express

Uso rápido:

1. Instala dependencias:

```powershell
npm install
```

2. Inicia el servidor:

```powershell
npm start
```

3. Ejemplos de peticiones:

- Obtener primer listado (por defecto limit=200):

	GET http://localhost:3000/pokemons

- Filtrar por nombre (subcadena, case-insensitive):

	GET http://localhost:3000/pokemons?name=pikachu

- Obtener detalles completos (advertencia: puede hacer muchas peticiones):

	GET http://localhost:3000/pokemons?name=char&details=true

Notas y mejoras posibles:

- Añadir cache para reducir llamadas a la PokéAPI.
- Añadir paginación y límites más estrictos para evitar sobrecarga.
