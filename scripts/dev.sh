#! /bin/bash
docker compose --env-file ./backend/.env --env-file ./frontend/.env up -d --build