import heroImage from '../../assets/hero-section-bg.png'






function HeroSection() {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col items-center justify-center text-center bg-stitching-floss p-10 rounded-md relative h-screen ">
            <img src={heroImage} alt="Hero Section Background" className="absolute inset-0 w-full h-full object-cover z-1 blur-[3px] "/>
                <h1 className="text-5xl font-header   text-PrimaryText z-3">Nona's <br/> Cross-Stitches</h1>
                <p className="text-2xl text-text z-3">
                    Discover the world of cross-stitch art
                </p>
                <button className="bg-white text-black rounded-md px-4 py-2 mt-10 z-3">
                    Explore
                </button>
            </div>
        </div>
    );
}

export default HeroSection;