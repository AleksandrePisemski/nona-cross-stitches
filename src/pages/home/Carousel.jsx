import { useCallback, useEffect, useRef, useState } from "react"

const MODULO = (value, size) => ((value % size) + size) % size

function useMarquee(rootRef, trackRef, firstGroupRef, itemCount, { speed, resumeDelay }) {
  const [groupCount, setGroupCount] = useState(2)
  const dimensionsRef = useRef({ groupWidth: 0, containerWidth: 0 })
  const positionRef = useRef(0)

  const measure = useCallback(() => {
    const group = firstGroupRef.current
    const root = rootRef.current
    if (!group || !root) return

    const groupWidth = group.getBoundingClientRect().width
    const containerWidth = root.clientWidth
    if (!groupWidth || !containerWidth) return

    dimensionsRef.current = { groupWidth, containerWidth }
    setGroupCount(Math.max(2, Math.ceil(containerWidth / groupWidth) + 2))
    positionRef.current = MODULO(positionRef.current, groupWidth)
  }, [firstGroupRef, rootRef])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    track.style.animation = "none"

    const pointerRef = { current: null }
    let isHovered = false
    let isIntersecting = false
    let isInertiaActive = false
    let inertiaVelocity = 0
    let resumeAt = 0
    let speedFactor = 1
    let previousFrame = null
    let frameId = null
    let pressedCard = null
    const previousUserSelect = root.style.userSelect
    const previousWebkitUserSelect = root.style.webkitUserSelect

    const applyPosition = () => {
      const { groupWidth } = dimensionsRef.current
      if (!groupWidth) return
      positionRef.current = MODULO(positionRef.current, groupWidth)
      track.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`
    }

    const clearPressedCard = () => {
      pressedCard?.classList.remove("scale-105")
      pressedCard = null
    }

    const stopPointer = (event, canceled = false) => {
      const pointer = pointerRef.current
      const eventIsTouch = Boolean(event?.isTouch)
      if (
        !pointer ||
        (event && event.pointerId !== pointer.id) ||
        (event && eventIsTouch !== (pointer.kind === "touch"))
      ) return

      pointerRef.current = null
      root.style.userSelect = previousUserSelect
      root.style.webkitUserSelect = previousWebkitUserSelect
      clearPressedCard()

      if (pointer.dragging && !canceled) {
        inertiaVelocity = pointer.velocity
        isInertiaActive = Math.abs(inertiaVelocity) > 0.015
        resumeAt = isInertiaActive ? Infinity : performance.now() + resumeDelay
      } else {
        isInertiaActive = false
        inertiaVelocity = 0
        resumeAt = pointer.dragging ? performance.now() + resumeDelay : performance.now()
      }

      if (pointer.kind === "pointer" && root.hasPointerCapture?.(pointer.id)) {
        try {
          root.releasePointerCapture(pointer.id)
        } catch {
          // The browser may already have released capture.
        }
      }
    }

    const onPointerDown = (event) => {
      if (!event.isPrimary || event.pointerType === "touch" || (event.pointerType === "mouse" && event.button !== 0)) return

      const now = performance.now()
      const card = event.target.closest?.(".category-carousel__card")
      if (card) {
        clearPressedCard()
        pressedCard = card
        pressedCard.classList.add("scale-105")
      }

      pointerRef.current = {
        kind: "pointer",
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastTime: now,
        velocity: 0,
        dragging: false,
      }
      isInertiaActive = false
    }

    const onPointerMove = (event) => {
      const pointer = pointerRef.current
      if (!pointer || pointer.kind !== "pointer" || event.pointerId !== pointer.id) return

      const totalX = event.clientX - pointer.startX
      const totalY = event.clientY - pointer.startY
      if (!pointer.dragging) {
        if (Math.abs(totalY) > 5 && Math.abs(totalY) > Math.abs(totalX)) {
          clearPressedCard()
          pointerRef.current = null
          return
        }
        if (Math.abs(totalX) <= 5 || Math.abs(totalX) <= Math.abs(totalY)) return

        pointer.dragging = true
        root.style.userSelect = "none"
        root.style.webkitUserSelect = "none"
        try {
          root.setPointerCapture(event.pointerId)
        } catch {
          // Window-level pointer listeners still complete the drag if capture fails.
        }
      }

      event.preventDefault()
      const now = performance.now()
      const deltaX = event.clientX - pointer.lastX
      const deltaTime = Math.max(1, now - pointer.lastTime)
      const instantaneousVelocity = -deltaX / deltaTime
      pointer.velocity = pointer.velocity * 0.35 + instantaneousVelocity * 0.65
      pointer.lastX = event.clientX
      pointer.lastTime = now
      positionRef.current -= deltaX
      applyPosition()
    }

    const onTouchStart = (event) => {
      if (pointerRef.current || event.touches.length !== 1) return

      const touch = event.changedTouches[0]
      const card = event.target.closest?.(".category-carousel__card")
      if (card) {
        clearPressedCard()
        pressedCard = card
        pressedCard.classList.add("scale-105")
      }

      pointerRef.current = {
        kind: "touch",
        id: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastTime: performance.now(),
        velocity: 0,
        dragging: false,
      }
      isInertiaActive = false
    }

    const onTouchMove = (event) => {
      const pointer = pointerRef.current
      if (!pointer || pointer.kind !== "touch") return
      const touch = Array.from(event.changedTouches).find(({ identifier }) => identifier === pointer.id)
      if (!touch) return

      const totalX = touch.clientX - pointer.startX
      const totalY = touch.clientY - pointer.startY
      if (!pointer.dragging) {
        if (Math.abs(totalY) > 5 && Math.abs(totalY) > Math.abs(totalX)) {
          clearPressedCard()
          pointerRef.current = null
          return
        }
        if (Math.abs(totalX) <= 5 || Math.abs(totalX) <= Math.abs(totalY)) return

        pointer.dragging = true
        root.style.userSelect = "none"
        root.style.webkitUserSelect = "none"
      }

      event.preventDefault()
      const now = performance.now()
      const deltaX = touch.clientX - pointer.lastX
      const deltaTime = Math.max(1, now - pointer.lastTime)
      const instantaneousVelocity = -deltaX / deltaTime
      pointer.velocity = pointer.velocity * 0.35 + instantaneousVelocity * 0.65
      pointer.lastX = touch.clientX
      pointer.lastTime = now
      positionRef.current -= deltaX
      applyPosition()
    }

    const finishTouch = (event, canceled = false) => {
      const pointer = pointerRef.current
      if (!pointer || pointer.kind !== "touch") return
      const endedTouch = Array.from(event.changedTouches).find(({ identifier }) => identifier === pointer.id)
      if (endedTouch) stopPointer({ pointerId: pointer.id, isTouch: true }, canceled)
    }

    const onPointerOut = (event) => {
      const card = event.target.closest?.(".category-carousel__card")
      if (card && !card.contains(event.relatedTarget)) clearPressedCard()
    }

    const onPointerEnter = (event) => {
      if (event.pointerType !== "touch") isHovered = true
    }

    const onPointerLeave = () => {
      isHovered = false
      clearPressedCard()
    }

    const onWindowPointerOut = (event) => {
      if (event.relatedTarget == null) {
        isHovered = false
        if (pointerRef.current?.kind === "pointer" && pointerRef.current.dragging) {
          stopPointer(null, true)
        }
      }
    }

    const onWindowBlur = () => stopPointer(null, true)
    const onPointerCancel = (event) => stopPointer(event, true)
    const onTouchCancel = (event) => finishTouch(event, true)
    const onDragStart = (event) => event.preventDefault()

    const animate = (now) => {
      frameId = null
      if (!isIntersecting || document.hidden) return

      const elapsed = previousFrame === null ? 0 : Math.min(now - previousFrame, 100)
      previousFrame = now
      const { groupWidth } = dimensionsRef.current

      if (groupWidth && !pointerRef.current) {
        if (isInertiaActive) {
          const friction = 0.0025
          const decay = Math.exp(-friction * elapsed)
          positionRef.current += inertiaVelocity * (1 - decay) / friction
          inertiaVelocity *= decay
          if (Math.abs(inertiaVelocity) < 0.015) {
            inertiaVelocity = 0
            isInertiaActive = false
            resumeAt = now + resumeDelay
          }
          applyPosition()
        } else if (now >= resumeAt) {
          const targetFactor = isHovered ? 0 : 1
          const easing = 1 - Math.exp(-elapsed / 180)
          speedFactor += (targetFactor - speedFactor) * easing
          positionRef.current += speed * speedFactor * elapsed / 1000
          applyPosition()
        }
      }

      frameId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (frameId === null && isIntersecting && !document.hidden) {
        previousFrame = null
        frameId = requestAnimationFrame(animate)
      }
    }

    const stopAnimation = () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
      previousFrame = null
    }

    const onVisibilityChange = () => {
      if (document.hidden) stopAnimation()
      else startAnimation()
    }

    measure()
    applyPosition()
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(measure)
      : null
    resizeObserver?.observe(root)
    if (firstGroupRef.current) resizeObserver?.observe(firstGroupRef.current)

    const intersectionObserver = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          isIntersecting = entry.isIntersecting
          if (isIntersecting) startAnimation()
          else stopAnimation()
        })
      : null
    if (intersectionObserver) intersectionObserver.observe(root)
    else {
      isIntersecting = true
      startAnimation()
    }

    root.addEventListener("pointerdown", onPointerDown)
    root.addEventListener("pointermove", onPointerMove, { passive: false })
    root.addEventListener("touchstart", onTouchStart, { passive: true })
    root.addEventListener("touchmove", onTouchMove, { passive: false })
    root.addEventListener("pointerout", onPointerOut)
    root.addEventListener("pointerenter", onPointerEnter)
    root.addEventListener("pointerleave", onPointerLeave)
    root.addEventListener("dragstart", onDragStart)
    window.addEventListener("pointerup", stopPointer)
    window.addEventListener("pointercancel", onPointerCancel)
    window.addEventListener("touchend", finishTouch, { passive: true })
    window.addEventListener("touchcancel", onTouchCancel, { passive: true })
    window.addEventListener("pointerout", onWindowPointerOut)
    window.addEventListener("blur", onWindowBlur)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      stopAnimation()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      root.removeEventListener("pointerdown", onPointerDown)
      root.removeEventListener("pointermove", onPointerMove)
      root.removeEventListener("touchstart", onTouchStart)
      root.removeEventListener("touchmove", onTouchMove)
      root.removeEventListener("pointerout", onPointerOut)
      root.removeEventListener("pointerenter", onPointerEnter)
      root.removeEventListener("pointerleave", onPointerLeave)
      root.removeEventListener("dragstart", onDragStart)
      window.removeEventListener("pointerup", stopPointer)
      window.removeEventListener("pointercancel", onPointerCancel)
      window.removeEventListener("touchend", finishTouch)
      window.removeEventListener("touchcancel", onTouchCancel)
      window.removeEventListener("pointerout", onWindowPointerOut)
      window.removeEventListener("blur", onWindowBlur)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      clearPressedCard()
      root.style.userSelect = previousUserSelect
      root.style.webkitUserSelect = previousWebkitUserSelect
      track.style.animation = ""
      track.style.transform = ""
    }
  }, [firstGroupRef, itemCount, measure, resumeDelay, rootRef, speed, trackRef])

  return { groupCount, measure }
}

function CategoryCard({ category, onImageLoad }) {
  return (
    <div className="relative hover:scale-110 h-full w-full overflow-hidden rounded-[30px] drop-shadow-lg">
      <img
        src={category.image}
        alt={category.name}
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={onImageLoad}
        className="pointer-events-none h-full w-full select-none object-cover"
      />
      <h2 className="absolute bottom-0 left-0 p-6 text-xl font-bold text-white md:p-10 md:text-2xl">
        {category.name}
      </h2>
    </div>
  )
}

export default function CategoryCarouselItems({ categories }) {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const firstGroupRef = useRef(null)
  const safeCategories = categories ?? []
  const { groupCount, measure } = useMarquee(rootRef, trackRef, firstGroupRef, safeCategories.length, {
    // The CSS duration is 60s per responsive group, so use a fixed px/sec value here.
    speed: 40,
    resumeDelay: 2000,
  })
  if (!safeCategories.length) return null

  return (
    <div ref={rootRef} className="category-carousel w-full overflow-hidden py-12 md:py-20" role="region" aria-label="Product categories" style={{ touchAction: "pan-y" }}>
      <div
        ref={trackRef}
        className="category-carousel__track"
        style={{ animation: "none", transform: "translate3d(0, 0, 0)" }}
      >
        {Array.from({ length: groupCount }, (_, groupIndex) => (
          <div
            key={groupIndex === 0 ? "original" : `duplicate-${groupIndex}`}
            ref={groupIndex === 0 ? firstGroupRef : undefined}
            className="category-carousel__group"
            aria-hidden={groupIndex > 0 || undefined}
          >
            {safeCategories.map((category) => (
              <div
                key={`${groupIndex}-${category.id}`}
                className="category-carousel__card transition-transform duration-200"
              >
                <CategoryCard category={category} onImageLoad={measure} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
