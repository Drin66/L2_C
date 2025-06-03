import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FetchActorDetails, FetchActorMovies } from '../API/GetMovieDetails';

const ActorMovies = () => {
  const { actorId } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_API_KEY || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorData, moviesData] = await Promise.all([
          FetchActorDetails(actorId, API_KEY),
          FetchActorMovies(actorId, API_KEY)
        ]);
        setActor(actorData);
        setMovies(moviesData.cast);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [actorId, API_KEY]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          {actor.profile_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
              className="w-32 h-32 rounded-full object-cover mr-6"
            />
          )}
          <h1 className="text-3xl font-bold">{actor.name}</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <Link 
              to={`/movie/${movie.id}`} 
              key={movie.id}
              className="hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{movie.title}</h3>
                  <p className="text-gray-600 text-xs">
                    {movie.character && `as ${movie.character}`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActorMovies;     