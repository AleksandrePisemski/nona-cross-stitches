import NavBar from '../../components/layout/NavBar' 
import HeroSection from './HeroSection'
import PageWrapper from '../../components/layout/PageWrapper'
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





