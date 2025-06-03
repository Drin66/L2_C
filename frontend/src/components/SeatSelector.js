import React, { useEffect, useState } from 'react';
import gjirafaLogo from './Gjirafa50.png';
import neptunLogo from './Neptun.png';
import redBullLogo from './RedBull.png';
import RedBullVideo from './RedBullVideo.mp4';
import Gjirafa50Video from './Gjirafa50Video.mp4';
import NeptunVideo2 from './NeptunVideo2.mp4';

const seats = Array.from({ length: 8 * 8 }, (_, i) => i);

function SeatSelector({
  movie,
  heldSeats = [],
  selectedSeats,
  recommendedSeat,
  onSeatClick,
  onRecommendedSeatChange,
}) {
  const [sessionTime, setSessionTime] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const mediaList = [
    { type: 'video', src: Gjirafa50Video, alt: 'Gjirafa 50 Video' },
    { type: 'image', src: gjirafaLogo, alt: 'Gjirafa 50 Logo' },
    { type: 'video', src: RedBullVideo, alt: 'Red Bull Video' },
    { type: 'image', src: redBullLogo, alt: 'Red Bull Logo' },
    { type: 'video', src: NeptunVideo2, alt: 'Neptun Video 2' },
    { type: 'image', src: neptunLogo, alt: 'Neptun Logo' },


  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('movieSession'));
    if (stored?.time) setSessionTime(stored.time);
  }, []);

  useEffect(() => {
    const current = mediaList[currentMediaIndex];
    if (current.type === 'image') {
      const timer = setTimeout(() => {
        setCurrentMediaIndex((idx) => (idx + 1) % mediaList.length);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentMediaIndex]);

  function handleSeatClick(seat) {
    const isSelected = selectedSeats.includes(seat);
    // Check if the seat is currently held by someone else (not in your current selection)
    const isHeldByOthers = heldSeats.includes(seat) && !isSelected;

    if (!movie.occupied.includes(seat) && !isHeldByOthers) {
      onSeatClick(seat);
    }
    onRecommendedSeatChange(null);
  }

  const current = mediaList[currentMediaIndex];

  const advanceMedia = () => setCurrentMediaIndex((idx) => (idx + 1) % mediaList.length);

  return (
    <div className='Cinema'>
      {sessionTime && (
        <p className='info mb-2 text-sm md:text-sm lg:text-base'>
          Session Time: {sessionTime}
        </p>
      )}

      <div className='screen flex justify-center items-center' style={{ color: 'red', width: '250px', height: '80px' }}>
        {current.type === 'image' ? (
          <img
            src={current.src}
            alt={current.alt}
            style={{ width: '250px', height: '79px' }}
          />
        ) : (
          <video
            src={current.src}
            style={{ width: '280px', height: '79.2px' }}
            autoPlay
            muted
            onEnded={advanceMedia}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className='seats'>
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = movie.occupied.includes(seat);
          // A seat is "held" for others if it's in the heldSeats array AND NOT in the current selectedSeats array
          const isHeld = heldSeats.includes(seat) && !isSelected;
          const showRecommended = selectedSeats.length === 0 && recommendedSeat === seat;
          return (
            <span
              key={seat}
              tabIndex='0'
              className={
                `seat ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}` +
                ` ${isHeld ? 'held' : ''} ${showRecommended ? 'recommended' : ''}`
              }
              // Only allow click if not occupied and not held by others
              onClick={!isOccupied && !isHeld ? () => handleSeatClick(seat) : null}
              onKeyPress={
                !isOccupied && !isHeld
                  ? (e) => e.key === 'Enter' && handleSeatClick(seat)
                  : null
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default SeatSelector;