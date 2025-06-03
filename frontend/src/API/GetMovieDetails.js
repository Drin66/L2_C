const FetchMovieDetails = async (id, API_KEY) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

const FetchMovieCredits = async (id, API_KEY) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return null;
  }
};


//---------------------------------------------new added here-------------------------------
export const FetchActorDetails = async (actorId, API_KEY) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching actor details:', error);
    return null;
  }
};

export const FetchActorMovies = async (actorId, API_KEY) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching actor movies:', error);
    return null;
  }
};

export { 
  FetchMovieDetails, 
  FetchMovieCredits,
};

export default FetchMovieDetails;