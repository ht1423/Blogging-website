import AppBar from '../components/AppBar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="w-full min-h-screen flex flex-col">  
            <AppBar />
            <HeroSection />
            <Footer /> 
        </div>
    );
}
