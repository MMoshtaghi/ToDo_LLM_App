#! /bin/bash
docker compose --env-file ./backend/.env --env-file ./frontend/.env -f docker-compose.yml -f docker-compose.prod.yml up -d --build