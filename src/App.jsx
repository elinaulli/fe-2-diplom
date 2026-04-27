import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import SeatsPage from './pages/SeatsPage.jsx';
import PassengersPage from './pages/PassengersPage.jsx';
// import PaymentPage from './pages/PaymentPage.jsx';
// import ReviewPage from './pages/ReviewPage.jsx';
// import SuccessPage from './pages/SuccessPage.jsx';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search-results" element={<SearchResultsPage />} />
          <Route path='seats' element={<SeatsPage/>} />
          <Route path="passengers" element={<PassengersPage />} />
        </Route>
      </Routes>
  );
}
