import Header from './components/header/Header';
import Randomiser from './components/randomiser/Randomiser';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-3/4 w-full relative">
        <Header />
        <Randomiser />
        <Footer />
      </div>
    </div>
  );
}

export default App;
