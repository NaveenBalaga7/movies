const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
  });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertMovieNameToPascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getAllMovieQuery = `SELECT movie_name FROM movie;`;
  const moviesArray = await database.all(getAllMovieQuery);
  response.send(
    moviesArray.app((movie_name) => ({ movieName: eachMovie.movie_name }))
  );
});


app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `INSERT INTO
    movie (director_id,movie_name,lead_actor)
    VALUES 
    (${directorId},'${movieName}','${leadActor}');`;
    const dbResponse = await db.run(addMovieQuery);
    response.send("Movie Successfully Added");
});

const convertDbObjectToResponseObject = (dbObject) => {
    return {
        movieId : dbObject.movie_id,
        directorId: dbObject.director_id,
        movieName : dbObject.movie_name,
        leadActor:dbObject.lead_actor,
    };
};

app.get("/movies/movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT * FROM movie
    WHERE
    movie_id = ${movieId};`;
  const movie = await database.get(getMovieQuery);
  response.send(convertDbObjectToResponseObject(movie));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMovieQuery = `
    UPDATE movie SET  director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE 
    movie_id = ${movieId};`;
  await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM movie WHERE movie_id = ${movieId};`;
  await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

const convertDirectorDetailsPascalCase = (dbObject) => {
    return {
        directorId: dbObject.director_id,
        directorName: dbObject.director_name,
    };
};

app.get("/directors/", async (request, response) => {
  const getAllDirectorQuery = `
    SELECT * FROM director;`;
  const moviesArray = await database.all(getAllDirectorQuery);
  response.send(
    moviesArray.map((director) =>
      convertDirectorDetailsPascalCase(director))
  );
});

const convertMovieNamePascalCase = (dbObject) => {
    return {
        movieName : dbObject.movie_name,
    };
};

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovieQuery = `
    SELECT movie_name
    FROM director INNER JOIN movie 
    ON director.director_id='${directorId}';`;
  const movies = await database.all(getDirectorMovieQuery);
  response.send(
    movies.map((Movie_name) => convertMovieNamePascalCase(Movie_name))
  );
});

module.exports = app;
