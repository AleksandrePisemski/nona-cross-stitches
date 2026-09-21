import heroImage from '../../assets/hero-section-bg.png'






function HeroSection() {
    return (
        <section className="flex flex-col h-screen ">
            <img src={heroImage} alt="Hero Section Background" className="absolute inset-0 w-full h-full object-cover z-1 blur-[3px] md:bg-transparent " />
            <div className="flex flex-col pt-40 p-10 rounded-md relative h-screen fadeIn z-2 items-center md:items-start md:pl-30 md:gap-10">
                <div flex className="flex flex-col gap-5 z-3 ">
                    <div className="flex flex-col md:flex-row md:gap-5 md:items-end z-3 items-center ">

                        <h1 className="text-[80px] font-header text-PrimaryText z-3 m-0 h-29 md:text-[100px] ">Nona's </h1>
                        <span className="text-PrimaryText text-5xl md:text-[60px]">Cross-Stitches</span>

                    </div>
                    <p className="text-2xl text-text z-3 text-center w-full  md:text-left ">
                        Discover the world of <br className="md:hidden" /> cross-stitch designs
                    </p>

                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-6 z-3 w-full justify-center items-center md:w-1/3 ">
                    <button className="bg-button-hero text-black rounded-[25px] px-4 py-2 w-2/3 h-[55px]  z-3 font-bold text-[20px]">
                        See About Us
                    </button>
                    <button className=" bg-button-bg text-white rounded-[25px] px-4 py-2 w-2/3  h-[55px]  z-3 font-bold text-[20px]">
                        Explore Catalog
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;