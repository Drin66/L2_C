import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyTickets from '../API/BuyTickets';
import getSeatPlan from '../API/GetSeatPlan';
import updateSeatsInHall from '../API/UpdateSeatsInHall';
import generateRandomOccupiedSeats from '../utils/GenerateRandomOccupiedSeats';
import SeatSelector from './SeatSelector';
import SeatShowcase from './SeatShowcase';

const movies = [
  {
    title: '',
    price: 10,
    occupied: generateRandomOccupiedSeats(1, 64, 64),
  },
];

// 1min
const SEAT_HOLD_DURATION = 1 * 60 * 1000;

function SeatPlan({ movie }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [recommendedSeat, setRecommendedSeat] = useState(null);
  const navigate = useNavigate();
  const [movieSession, setMovieSession] = useState(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [seatPlan, setSeatPlan] = useState(null);
  const [seatHoldTimers, setSeatHoldTimers] = useState({});

  useEffect(() => {
    const storedMovieSession = JSON.parse(localStorage.getItem('movieSession'));
    if (storedMovieSession) {
      setMovieSession(storedMovieSession);
    }
  }, []);

  // unique key for each movie + session 
  const HELD_SEATS_STORAGE_KEY = movie && movieSession
    ? `heldSeatsData_${movie.id}_${movieSession.time}`
    : null;

  useEffect(() => {
    const fetchSeatPlan = async () => {
      try {
        if (movieSession && movieSession.time) {
          const data = await getSeatPlan(movie.id, movieSession);
          setSeatPlan(data);
        }
      } catch (error) {
        console.error('Error fetching seat plan:', error);
      }
    };

    if (movieSession) {
      fetchSeatPlan();
    }
  }, [movie.id, movieSession]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserName(storedUser.userName);
      setUserId(storedUser.userId);
    }
  }, []);

  const occupiedSeats = seatPlan && seatPlan.length > 0 ? seatPlan : movies[0].occupied;

  const availableSeats = [27, 28, 29, 30, 35, 36, 37, 38, 43, 44, 45, 46];

  const getHeldSeatsFromStorage = useCallback(() => {
    if (!HELD_SEATS_STORAGE_KEY) return [];
    const storedData = localStorage.getItem(HELD_SEATS_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const currentTime = Date.now();
        const activeHolds = parsedData.filter(
          (hold) => hold.expirationTime > currentTime
        );
        localStorage.setItem(HELD_SEATS_STORAGE_KEY, JSON.stringify(activeHolds));
        return activeHolds.map(hold => hold.seatNumber);
      } catch (e) {
        console.error("Failed to parse held seats from localStorage", e);
        return [];
      }
    }
    return [];
  }, [HELD_SEATS_STORAGE_KEY]); 

  const updateHeldSeatsInStorage = useCallback((newHeldSeatsArray) => {
    if (!HELD_SEATS_STORAGE_KEY) return; 
    const currentTime = Date.now();
    const dataToStore = newHeldSeatsArray.map(seat => ({
      seatNumber: seat,
      expirationTime: currentTime + SEAT_HOLD_DURATION,
    }));
    localStorage.setItem(HELD_SEATS_STORAGE_KEY, JSON.stringify(dataToStore));
  }, [HELD_SEATS_STORAGE_KEY, SEAT_HOLD_DURATION]); 

  useEffect(() => {
    if (HELD_SEATS_STORAGE_KEY) { 
      setHeldSeats(getHeldSeatsFromStorage());
    }
  }, [getHeldSeatsFromStorage, HELD_SEATS_STORAGE_KEY]);


  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === HELD_SEATS_STORAGE_KEY) {
        setHeldSeats(getHeldSeatsFromStorage());
      }
    };
    if (HELD_SEATS_STORAGE_KEY) {
      window.addEventListener('storage', handleStorageChange);
    }
    return () => {
      if (HELD_SEATS_STORAGE_KEY) {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [getHeldSeatsFromStorage, HELD_SEATS_STORAGE_KEY]);

  const filteredAvailableSeats = availableSeats.filter(
    (seat) => !occupiedSeats.includes(seat) && !heldSeats.includes(seat)
  );

  useEffect(() => {
    let recommended = null;
    for (let i = 0; i < filteredAvailableSeats.length; i++) {
      const seat = filteredAvailableSeats[i];
      if (!occupiedSeats.includes(seat) && !heldSeats.includes(seat)) {
        recommended = seat;
        break;
      }
    }
    setRecommendedSeat(recommended);
  }, [filteredAvailableSeats, occupiedSeats, heldSeats]);

  const handleSeatSelection = (seat) => {
    if (occupiedSeats.includes(seat) || heldSeats.includes(seat)) {
        return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
      releaseSeatHold(seat);
    }
    else {
      setSelectedSeats([...selectedSeats, seat]);
      holdSeat(seat);
    }
  };

  const holdSeat = (seat) => {
    setHeldSeats(prevHeldSeats => {
        const newHeldSeats = [...prevHeldSeats, seat];
        updateHeldSeatsInStorage(newHeldSeats); 
        return newHeldSeats;
    });

    const timer = setTimeout(() => {
      releaseSeatHold(seat);
      setSelectedSeats(selectedSeats => selectedSeats.filter(s => s !== seat));
    }, SEAT_HOLD_DURATION);

    setSeatHoldTimers(prev => ({
      ...prev,
      [seat]: timer
    }));
  };

  const releaseSeatHold = (seat) => {
    setHeldSeats(prevHeldSeats => {
        const newHeldSeats = prevHeldSeats.filter(s => s !== seat);
        updateHeldSeatsInStorage(newHeldSeats); 
        return newHeldSeats;
    });

    if (seatHoldTimers[seat]) {
      clearTimeout(seatHoldTimers[seat]);
      setSeatHoldTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[seat];
        return newTimers;
      });
    }
  };

  useEffect(() => {
    return () => {
      Object.values(seatHoldTimers).forEach(timer => clearTimeout(timer));
    };
  }, [seatHoldTimers]);

  let selectedSeatText = '';
  if (selectedSeats.length > 0) {
    selectedSeatText = selectedSeats.map((seat) => seat + 1).join(', ');
  }

  let totalPrice = selectedSeats.length * movies[0].price;

  const isAnySeatSelected = selectedSeats.length > 0;

  const handleButtonClick = async (e) => {
    e.preventDefault();
    const isAnySeatSelected = selectedSeats.length > 0;

    if (isAnySeatSelected) {
      const orderSeats = selectedSeats;
      const updatedOccupiedSeats = [...orderSeats, ...occupiedSeats];

      const order = {
        customerId: userId || Math.floor(Math.random() * 1000000),
        userName: userName || '',
        orderDate: new Date().toISOString(),
        seats: [...orderSeats, ...occupiedSeats],
        seat: orderSeats,
        movie: {
          id: movie.id,
          title: movie.title,
          genres: movie.genres.map((genre) => genre.name).join(', '),
          runtime: movie.runtime,
          language: movie.original_language,
          price: movies[0].price,
        },
      };

      const myOrder = {
        customerId: order.customerId,
        orderDate: order.orderDate,
        movieId: order.movie.id,
        movieTitle: order.movie.title,
        movieGenres: order.movie.genres,
        movieRuntime: order.movie.runtime,
        movieLanguage: order.movie.language,
        moviePrice: order.movie.price,
        seat: order.seat,
        userName: order.userName,
      };

      const hallUpdate = {
        movieId: movie.id,
        movieSession: movieSession.time,
        orderTime: order.orderDate,
        updatedSeats: updatedOccupiedSeats,
      };

      const updateSuccess = await updateSeatsInHall(BASE_URL, hallUpdate);

      if (updateSuccess) {
        const buyTickets = await BuyTickets(BASE_URL, myOrder);
        if (buyTickets) {
          selectedSeats.forEach(seat => releaseSeatHold(seat));
          setSuccessPopupVisible(true);
          setTimeout(() => {
            setSuccessPopupVisible(false);
            navigate('/');
          }, 2000);
        }
      } else {
        console.error('Failed to update occupied seats in the database');
      }
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full md:w-1/2 lg:w-2/3 px-6'>
        <h2 className='mb-8 text-2xl font-semibold text-center'>
          Choose your seats by clicking on the available seats
        </h2>
        <p className='text-sm text-center mb-4'>
          Selected seats will be held for {SEAT_HOLD_DURATION / 60000} minutes
        </p>
      </div>

      <div className='CinemaPlan'>
        <SeatSelector
          movie={{ ...movies[0], occupied: occupiedSeats }}
          heldSeats={heldSeats} 
          selectedSeats={selectedSeats}
          recommendedSeat={recommendedSeat}
          onSeatClick={handleSeatSelection} 
          onSelectedSeatsChange={(selectedSeats) =>
            setSelectedSeats(selectedSeats)
          }
          onRecommendedSeatChange={(recommendedSeat) =>
            setRecommendedSeat(recommendedSeat)
          }
        />
        <SeatShowcase />

        <p className='info mb-2 text-sm md:text-sm lg:text-base'>
          You have selected{' '}
          <span className='count font-semibold'>{selectedSeats.length}</span>{' '}
          seat{selectedSeats.length !== 1 ? 's' : ''}
          {selectedSeats.length === 0 ? '' : ':'}{' '}
          {selectedSeatText ? (
            <span className='selected-seats font-semibold'>
              {' '}
              {selectedSeatText}
            </span>
          ) : (
            <span></span>
          )}{' '}
          {selectedSeats.length > 0 && (
            <>
              for the price of{' '}
              <span className='total font-semibold'>{totalPrice}€</span>
            </>
          )}
        </p>

        {isAnySeatSelected ? (
          <div>
            <button
              className='bg-green-500 hover:bg-green-700 text-white rounded px-3 py-2 text-sm font-semibold cursor-pointer'
              onClick={handleButtonClick}
            >
              Buy at <span className='total font-semibold'>{totalPrice}€</span>
            </button>
          </div>
        ) : (
          <div>
            <p className='info text-sm md:text-sm lg:text-base'>
              Please select a seat
            </p>
          </div>
        )}

        {successPopupVisible && (
          <div className='bg-green-500 text-white px-4 py-2 text-sm md:text-sm lg:text-base rounded absolute bottom-1/2 mb-8 mr-8 flex justify-center'>
            Order Successful
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatPlan;