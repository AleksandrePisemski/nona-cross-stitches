
let categories = [
    {
        id: 1,
        name: 'Landscapes',
        image: 'https://picsum.photos/200',
    },
    {
        id: 2,
        name: 'Flowers',
        image: 'https://picsum.photos/200',
    },
    {
        id: 3,
        name: 'Animals',
        image: 'https://picsum.photos/200',
    },
    {
        id: 4,
        name: 'Religious',
        image: 'https://picsum.photos/200',
    },
    {
        id: 5,
        name: 'People',
        image: 'https://picsum.photos/200',
    },
    {
        id: 6,
        name: 'Architecture',
        image: 'https://picsum.photos/200',
    },
    {
        id: 7,
        name: 'Children\'s designs',
        image: 'https://picsum.photos/200',
    },
    {
        id: 8,
        name: 'Modern designs',
        image: 'https://picsum.photos/200',
    },



];



import { useState } from 'react'

function CategoryCard({ category }) {
    const [activeCard, setActiveCard] = useState()
    return (
        <div className="w-[230px] md:w-[300px] shrink-0 snap-center overflow-hidden rounded-[30px] border-2 border-black aspect-[2/3] relative cursor-pointer transition-all hover:scale-110 "
        onHover={()=>setActiveCard(category.id)}
        >
            <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-all rounded-[30px] w-[230px] md:w-[300px] aspect-[2/3]"
            />
             <div className="absolute bottom-0 left-0 w-full p-10 z-100 ">
                <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            </div>
        </div>
    )
}


function CategoryCarouselItems({ setActiveIndex }) {
return (
    <div
        onScroll={(e) => {
            const step = 242 // width of each card
            const index = Math.round(
                e.currentTarget.scrollLeft / step
            )


            setActiveIndex(index)
        }}
        className="flex gap-3 overflow-x-auto overflow-y-visible snap-x snap-mandatory  scroll-smooth px-[65px] [scrollbar-width:none] md:[scrollbar-width:100%] ">
        {categories.map((category) => (
            <CategoryCard
                key={category.id}
                category={category}
            />
        ))}
    </div>
    )


}

function CategoryCarouselScrollTab({ activeIndex }) {
return(
    <div className="mt-5 flex justify-center gap-2">
        {categories.map((category, index) => (
            <span

                key={category.id}
                className={`h-2 rounded-full transition-all ${activeIndex === index
                    ? 'w-5 bg-black'
                    : 'w-2 bg-gray-300'
                    }`}
            />
        ))}
    </div>)
}

function CategoryCarousel() {
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className="w-full">
            <CategoryCarouselItems setActiveIndex={setActiveIndex} />
            <CategoryCarouselScrollTab activeIndex={activeIndex} />
        </div>
    )
}









function CategoryPages() {
    return (
        <section className="flex flex-col w-full h-250 gap-10  md:mt-40 items-center justify-center ">
            <CategoryCarousel />

        </section>
    )
}


export default CategoryPages