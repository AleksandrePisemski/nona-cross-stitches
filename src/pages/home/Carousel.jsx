import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'

function CategoryCard({ category }) {
  return (
    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-[30px] cursor-pointer transition-transform md:hover:scale-105 drop-shadow-lg">
      <img
        src={category.image}
        alt={category.name}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />

      <h2 className="absolute bottom-0 left-0 p-6 md:p-10 text-xl md:text-2xl font-bold text-white">
        {category.name}
      </h2>
    </div>
  )
}

export default function CategoryCarouselItems({
  categories,
  setActiveIndex,
}) {
  const swiperRef = useRef()
  const timerRef = useRef()

  const pause = () => {
    clearTimeout(timerRef.current)

    const swiper = swiperRef.current
    if (!swiper) return

    const translate = swiper.getTranslate()

    swiper.autoplay.stop()
    swiper.setTransition(0)
    swiper.setTranslate(translate)
  }

  const resume = (delay = 300) => {
    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      swiperRef.current?.autoplay.start()
    }, delay)
  }

  if (!categories?.length) return null

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
    >
      <Swiper
        modules={[Autoplay, FreeMode]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}

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
          disableOnInteraction: true,
        }}

        breakpoints={{
          768: {
            spaceBetween: 40,
          },
          1024: {
            spaceBetween: 56,
          },
        }}

        onTouchStart={pause}
        onTouchEnd={() => resume(0)}

        className="category-carousel !py-12 md:!py-20 !px-4"
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
    </div>
  )
}