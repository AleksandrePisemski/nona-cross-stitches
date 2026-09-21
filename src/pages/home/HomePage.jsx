import NavBar from '../../components/home/NavBar'
import HeroSection from './HeroSection'
import PageWrapper from '../../components/pageWrapper'
import CategoryPages from './CategoryPages'

function HomePage() {
  return (
    <PageWrapper>
        <NavBar/>
        <HeroSection/>
        <CategoryPages/>
    </PageWrapper>
  );
}

export default HomePage;





