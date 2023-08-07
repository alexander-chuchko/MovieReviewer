import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/styles.css';
import { MovieManager } from './app/MovieManager';

const movieManager = new MovieManager();
movieManager.init();
