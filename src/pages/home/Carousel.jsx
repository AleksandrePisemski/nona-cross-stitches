import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'

function CategoryCard({ category }) {
  return (
    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-[30px] drop-shadow-lg transition-transform duration-300 md:hover:scale-105">
      <img
        src={category.image}
        alt={category.name}
        draggable={false}
        className="pointer-events-none h-full w-full select-none object-cover"
      />
      <h2 className="absolute bottom-0 left-0 p-6 text-xl font-bold text-white md:p-10 md:text-2xl">
        {category.name}
      </h2>
    </div>
  )
}

export default function CategoryCarouselItems({ categories }) {
  if (!categories?.length) return null

  return (
    <Swiper
      modules={[Autoplay, FreeMode]}
      slidesPerView="auto"
      spaceBetween={20}
      loop
      speed={5000}
      grabCursor
      freeMode={{
        enabled: true,
        momentum: true,
      }}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        768: { spaceBetween: 40 },
        1024: { spaceBetween: 56 },
      }}
      className="category-carousel !px-4 !py-12 md:!py-20"
    >
      {categories.map((category) => (
        <SwiperSlide
          key={category.id}
          className="!w-[200px] sm:!w-[230px] md:!w-[260px] lg:!w-[280px]"
        >
          <CategoryCard category={category} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
