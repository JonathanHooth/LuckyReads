# LuckyReads
A book and buddy recommendation website

# Basic Github Best Practice
* The main branch has branch protection. The only way to push to the main branch is to submit a pull request (PR)
* One other person has to review the pull request before it is merged into the main branch
* At some point, we may implement some CI/CD to ensure that everything still works after merging
* For constructing new features, create a new branch.
* Each branch should ONLY focus on a single feature at once.
* If you want to work on something that requires multiple features, create a branch off of that branch

## Getting Started

### Prerequisites

- Docker, Docker Compose: <https://docs.docker.com/desktop/>
- Python: <https://www.python.org/downloads/>
- VSCode: <https://code.visualstudio.com/download>

Optional:

- Taskfile for managing commands and local tasks: <https://taskfile.dev/installation/>
- Anaconda for managing Python virtual environments: <https://www.anaconda.com/download>

### Quick Start


# Copy env variables
cp sample.env .env


# Start docker compose
docker-compose --profile dev up --build
```

### Running the Server

#### With TaskFile

If you have Taskfile installed, you can just run:

```sh
task dev
```

This will build the docker containers and spin up the dev servers.

If you make changes to the database, make sure to create a migration file and apply that migration file to the database:

```sh
task makemigrations
task migrate
```

Finally, to stop all docker container and clear the database:

```sh
task clean
```


#### Without Taskfile

You can manually start up the docker containers with the following commands:

```sh
# Setup env variables and build docker images
cp sample.env .env
docker-compose --profile dev build
```

After building the docker image, you can run this to start the servers:

```sh
docker-compose --profile dev up
```

To make migration files and apply them to the database:

```sh
docker-compose run --rm app sh -c "python manage.py makemigrations"
docker-compose run --rm app sh -c "python manage.py migrate"
```

To run unit tests:

```sh
docker-compose run --rm app sh -c "python manage.py test"
```

And finally, to clean up all the docker containers and clear the database:

```sh
docker-compose --profile dev down --remove-orphans -v
```

### Frontend (Vite + React)

The SPA lives in `frontend/`. Run it on the host alongside Docker (separate terminal):

```sh
cd frontend
npm ci          # or: npm install
npm run dev
```

Vite prints a local URL (by default [http://localhost:5173](http://localhost:5173)). Use `npm run build` for a production bundle and `npm run lint` for ESLint.

Optional: install [Node.js](https://nodejs.org/) (LTS is fine) if you do not already have `npm`.

## Admin Dashboard

You can log into the admin dashboard by going to the route `/admin` and using the following credentials:

- Username: `admin@example.com`
- Password: `changeme`

These defaults are set via environment variables:

```txt
DJANGO_SUPERUSER_EMAIL="admin@example.com"
DJANGO_SUPERUSER_PASS="changeme"
```

If you want to change these values, copy the sample.env file to a new `.env` file and change the values. If you already created an admin with the other credentials, then another one won't be created automatically. To get another one to be created automatically, remove the database and restart the app with this command:

```sh
docker-compose down --remove-orphans -v
docker-compose up
```

If you want to create a new admin without removing the old database, run this command:

```sh
docker-compose run --rm app sh -c "python manage.py createsuperuser --no-input"
```

## Server "Modes"

You can run the project in multiple different environments, which are referred to as "modes".

| Mode       | Purpose                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| Dev        | Main development mode, uses mock data in leu of making requests to microservices |
| Network    | Does not use mock data, connects to any needed microservices                     |
| Production | When the project is run in a cloud environment and receiving traffic             |

## Taskfile Commands

If you have Taskfile installed, you can use the following:

| Command                            | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `task setup`                       | Setup local python environment                                   |
| `task dev`                         | Start the server in "dev" mode                                   |
| `task network`                     | Starts the server in "network" mode                              |
| `task makemigrations`              | Create database migration files                                  |
| `task migrate`                     | Apply migration files to the database                            |
| `task shell`                       | Start a new Django interactive shell                             |
| `task shell:redis`                 | Starts a new interactive redis shell using redis-cli             |
| `task shell:db`                    | Starts a new interactive postgres shell using Django's dbshell   |
| `task show_urls`                   | Show all available urls for the server, and their reverse labels | |
| `task down`                        | Stop all docker containers created by `task dev`                 |
| `task clean`                       | Stop containers and remove volumes created by `task dev`         |

## Local Dev Links

Running the server in `dev` mode will start up the following services:

| Service            | Description                                              | Link                                           |
| ------------------ | -------------------------------------------------------- | ---------------------------------------------- |
| Vite dev server    | React frontend (`npm run dev` in `frontend/`)            | <http://localhost:5173/>                       |
| Django Server      | Main development server                                  | <http://localhost:8080/>                       |
| API Docs           | REST API documentation created by Swagger/OpenAPI        | <http://localhost:8080/api/docs/>              |
| OAuth API Docs     | OAuth REST API documentation created by django-allauth   | <http://localhost:8080/api/oauth/openapi.html> |
| Admin Dashboard    | Django's model admin dashboard                           | <http://localhost:8080/admin/>                 |
| PGAdmin            | Directly view and manage postgres database for debugging | <http://localhost:8888/>                       |
| MailHog            | Local test email server to view emails sent by django    | <http://localhost:8025/>                       |
