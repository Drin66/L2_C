import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FetchMovieDetails from '../API/GetMovieDetails';
import SeatPlan from '../components/SeatPlan';
import FormatDate from '../utils/formatDate';
import FormatRuntime from '../utils/formatRuntime';