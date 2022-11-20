import './index.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import HomeSection from './sections/Home/Home';
import SectionnedSection from './sections/Sectionned/Sectionned';
import Reservations from './pages/Reservations/Reservations';
import NoMatch from './pages/errors/NoMatch';

export default function App() {
  return (<main>
    <HomeSection />

    <Routes>
      <Route path="/" element={<SectionnedSection />}>
        <Route index element={<Reservations />} />
        <Route path="reservation" element={<Reservations />} />
        <Route path="experiences" element={<p>experiences</p>} />
        <Route path="services" element={<p>services</p>} />
        <Route path="a-propos" element={<p>a-propos</p>} />
        <Route path="contact" element={<p>contact</p>} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </main>);
}