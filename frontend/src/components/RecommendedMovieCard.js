import React, { useState } from 'react';
import MovieSessions from '../mockData/MovieSessions';
import FormatDate from '../utils/formatDate';
import RecommendedSessionInfo from './RecommendedSessionInfo';
import { isLoggedIn } from '../utils/Auth';
import CustomAlert from './CustomAlert';

const RecommendedMovieCard = ({ movie, hallNumber }) => {
  const movieSessions = MovieSessions(movie, hallNumber);
  const user = isLoggedIn();
  const [showAlert, setShowAlert] = useState(false);

  const handleMovieClick = () => {
    if (!user) {
      setShowAlert(true);
    }
  };

  return (
    <>
      <div 
        className='movie-card rounded-lg overflow-hidden flex'
        onClick={handleMovieClick}
        style={{ cursor: user ? 'default' : 'pointer' }}
      >
        <div className='relative w-1/2 h-72'>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className='w-full h-full object-cover' 
          />
        </div>
        <div className='p-2 flex-1 flex flex-col justify-between'>
          <div>
            <h3 className='text-[14px] font-semibold text-left text-white'>{movie.title}</h3> 
          </div>
          <div className='text-left text-xs'> 
            <div>
              {user ? (
                <div>
                  <RecommendedSessionInfo movieSessions={movieSessions} movieId={movie.id} />
                </div>
              ) : (
                <div className="text-yellow-400 mb-2">
                  Please login to view sessions and book tickets
                </div>
              )}
            </div>
            <div>
              <span className='text-white opacity-80'>
                Release Date: {FormatDate(movie.release_date)}
              </span>
            </div>
            <div>
              <span className='text-white opacity-80'>
                Rating: {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <CustomAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message="Please log in to view movie details and book tickets."
      />
    </>
  );
};

export default RecommendedMovieCard;
