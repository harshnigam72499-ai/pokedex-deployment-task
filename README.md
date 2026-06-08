# Pokédex React Deployment Task

This project is a React-based Pokédex UI deployed using Docker, a multi-stage Dockerfile, Nginx reverse proxy, and HTTPS with a self-signed TLS certificate.

## Features

- Fetches Pokémon list from PokeAPI
- Displays first 20 Pokémon
- On click, fetches selected Pokémon details
- Shows name, ID, sprite image, types, abilities, and base stats
- Handles loading and error states
- Custom CSS without any UI library
- Multi-stage Dockerfile
- Nginx reverse proxy
- HTTPS using self-signed SSL certificate
- HTTP to HTTPS redirect

## API Used

Base URL:

```text
https://pokeapi.co/api/v2/
