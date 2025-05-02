const RemoveUnwantedGenres = (genres) => {

  if (!Array.isArray(genres)) {
    console.warn('RemoveUnwantedGenres: Expected array but received', genres);
    return [];
  }

  return genres.filter(
    (genre) =>
      genre.name !== 'Documentary' &&
      genre.name !== 'TV Movie' &&
      genre.name !== 'Western',
  );
};

export default RemoveUnwantedGenres;
