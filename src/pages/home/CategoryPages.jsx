
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



function CategoryCard({ category }) {
    return (
        <div className="flex aspect-2/3 w-50 border-2 rounded-4xl">
            <div className=" w-full">
                <img src={category.image} className="object-cover w-full h-full rounded-4xl" />
            </div>


        </div>

    )
}










function CategoryPages() {
    return (
        <section className="flex flex-col w-full h-250 gap-10  md:mt-40 items-center justify-center ">
            <CategoryCard category={categories[0]} />
        </section>
    )
}


export default CategoryPages