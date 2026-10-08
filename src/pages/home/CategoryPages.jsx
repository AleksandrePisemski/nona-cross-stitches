import CategoryCarouselItems from './Carousel.jsx'
import { useState } from 'react'

let categories = [
    {
        id: 1,
        name: 'Landscapes',
        image: 'https://picsum.photos/id/10/200',
    },
    {
        id: 2,
        name: 'Flowers',
        image: 'https://picsum.photos//id/20/200',
    },
    {
        id: 3,
        name: 'Animals',
        image: 'https://picsum.photos/id/30/200',
    },
    {
        id: 4,
        name: 'Religious',
        image: 'https://picsum.photos//id/40/200',
    },
    {
        id: 5,
        name: 'People',
        image: 'https://picsum.photos//id/50/200',
    },
    {
        id: 6,
        name: 'Architecture',
        image: 'https://picsum.photos/id/60/200',
    },
    {
        id: 7,
        name: 'Children\'s designs',
        image: 'https://picsum.photos//id/70/200',
    },
    {
        id: 8,
        name: 'Modern designs',
        image: 'https://picsum.photos//id/80/200',
    },



];









function CategoryCarousel() {

    return (
        <div className="w-full">
            <CategoryCarouselItems categories={categories} />
        </div>
    )
}




function CategoryPages() {
    return (
        <section className="flex flex-col w-full h-fit  gap-10 items-center justify-center bg-linear-to-b from-stitching-rose via-stitching-floss to-stitching-rose">
            <CategoryCarousel />

        </section>
    )
}


export default CategoryPages