
import Logo from "../../assets/logo.png";
import { NavLink } from "react-router";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Heart } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import ProductSearchBox from "../search/ProductSearchBox.jsx";

function formatLari(value) {
    const amount = Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "GEL" }).format(amount);
}

let bodyScrollLockCount = 0
let previousBodyScrollStyles = null

function acquireBodyScrollLock() {
    const body = document.body
    const root = document.documentElement

    if (bodyScrollLockCount === 0) {
        const scrollbarGap = window.innerWidth - root.clientWidth
        const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0
        previousBodyScrollStyles = {
            bodyOverflow: body.style.overflow,
            rootOverflow: root.style.overflow,
            paddingRight: body.style.paddingRight,
        }
        body.style.overflow = "hidden"
        root.style.overflow = "hidden"
        if (scrollbarGap > 0) {
            body.style.paddingRight = `${computedPaddingRight + scrollbarGap}px`
        }
    }

    bodyScrollLockCount += 1
    let released = false

    return () => {
        if (released) return
        released = true
        bodyScrollLockCount -= 1

        if (bodyScrollLockCount === 0 && previousBodyScrollStyles) {
            body.style.overflow = previousBodyScrollStyles.bodyOverflow
            root.style.overflow = previousBodyScrollStyles.rootOverflow
            body.style.paddingRight = previousBodyScrollStyles.paddingRight
            previousBodyScrollStyles = null
        }
    }
}
function BurgerMenu({ toggleBurgerMenu, burgerMenuIsOpen }) {
    const linkStyle = ({ isActive }) =>
        `navbar-link relative pb-1 transition-colors ${isActive ? "border-b-2 border-white" : "hover:text-gray-300"
        }`;

    return (
        <div
            className={`fixed top-0 left-0 w-screen h-[100dvh] bg-gray-800/80 backdrop-blur-xs z-50 flex flex-col text-white text-3xl p-6 justify-center items-center gap-10 transition-all duration-700 ease-in-out md:hidden ${burgerMenuIsOpen
                    ? "translate-y-0 opacity-100 pointer-events-auto"
                    : "-translate-y-full opacity-0 pointer-events-none"
                }`}
        >
            <XMarkIcon
                className="w-10 h-10 navbar-link absolute top-4 right-4 cursor-pointer"
                onClick={toggleBurgerMenu}
            />

            <NavLink
                to="/"
                className={linkStyle}
                onClick={toggleBurgerMenu}
            >
                Home
            </NavLink>

            <NavLink
                to="/catalog"
                className={linkStyle}
                onClick={toggleBurgerMenu}
            >
                Catalog
            </NavLink>

            <NavLink
                to="/about"
                className={linkStyle}
                onClick={toggleBurgerMenu}
            >
                About Us
            </NavLink>

            <NavLink
                to="/contact"
                className={linkStyle}
                onClick={toggleBurgerMenu}
            >
                Contact
            </NavLink>
        </div>
    );
}

// Мобильный поиск
function MobileSearchOverlay({ onClose }) {
    useEffect(() => {
        return acquireBodyScrollLock()
    }, [])

    return (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-white text-stone-900 md:hidden" role="dialog" aria-modal="true" aria-label="Search products">
            <div className="sticky top-0 z-10 border-b border-white/20 bg-stitching-wood px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] text-white shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-semibold">Search products</p>
                    <button type="button" onClick={onClose} aria-label="Close search" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
                        <XMarkIcon className="size-6" aria-hidden="true" />
                    </button>
                </div>
                <ProductSearchBox mobile isOpen onClose={onClose} />
            </div>
            <p className="px-4 py-5 text-sm text-stone-500">Search by product name, SKU, or description.</p>
        </div>
    )
}

function ShoppingBag({ shoppingBagIsOpen, toggleShoppingBag, items, addToCart, removeFromCart, decrementCart, clearCart }) {
    const { applyPromoCode, promoCode, subtotal, discount, total } = useCart();
    const [promoInput, setPromoInput] = useState("");
    const [promoMessage, setPromoMessage] = useState("");
    return (
        <div
            className={`md:w-[30vw] fixed top-0 right-0 w-screen h-[100dvh] bg-gray-800/80 backdrop-blur-xs z-51 flex flex-col text-white text-3xl p-6 justify-center items-center gap-10 transition-all duration-700 ease-in-out ${shoppingBagIsOpen
                    ? "translate-x-0 opacity-100 pointer-events-auto"
                    : "translate-x-full opacity-0 pointer-events-none"
                }`}
        >
            <XMarkIcon
                className="w-10 h-10 navbar-link absolute top-3 right-15 cursor-pointer"
                onClick={toggleShoppingBag}
            />

            <h2>{items.length === 0 ? "Your bag is empty" : "YOUR BAG"}</h2>
            {items.length === 0 && <p className="text-base text-white/75">Browse the catalog to find a design you love.</p>}
            {items.length > 0 && (
                <>
                <ul className="max-h-[calc(100dvh-12rem)] min-h-0 w-full max-w-md space-y-4 overflow-y-auto overscroll-contain text-base">
                    {items.map((item) => (
                        <li key={item.productId ?? item.id} className="flex items-center justify-between gap-4 border-b border-white/30 pb-3">
                            {item.image && <img src={item.image} alt={item.name ?? ""} className="size-14 shrink-0 rounded object-cover" />}
                            <div className="min-w-0 flex-1">
                                <p className="truncate">{item.name ?? "Product"}</p>
                                <p className="text-sm text-white/75">{formatLari(item.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={`Decrease ${item.name} quantity`}
                                    title="Decrease quantity"
                                    onClick={() => decrementCart(item.productId ?? item.id)}
                                    className="inline-flex size-8 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <MinusIcon className="size-4" aria-hidden="true" />
                                </button>
                                <button type="button" aria-label={`Increase ${item.name ?? "product"} quantity`} onClick={() => addToCart(item)} className="inline-flex size-8 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10">
                                    <PlusIcon className="size-4" aria-hidden="true" />
                                </button>
                                <span className="min-w-12 text-center">Qty: {item.quantity ?? 1}</span>
                                <button
                                    type="button"
                                    aria-label={`Remove ${item.name} from cart`}
                                    title="Remove item"
                                    onClick={() => removeFromCart(item.productId ?? item.id)}
                                    className="shrink-0 rounded-full p-2 text-white transition-colors hover:text-stitching-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <TrashIcon className="size-5" aria-hidden="true" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <form onSubmit={(event) => { event.preventDefault(); const result = applyPromoCode(promoInput); setPromoMessage(result.ok ? "Promo code applied." : result.message); }} className="flex gap-2 text-sm">
                    <input aria-label="Promo code" value={promoInput} onChange={(event) => setPromoInput(event.target.value)} placeholder="Promo code (STITCH10)" className="min-w-0 flex-1 rounded border border-white/40 bg-transparent px-3 py-2" />
                    <button type="submit" className="rounded border border-white/40 px-3">Apply</button>
                </form>
                {promoMessage && <p role="status" className="text-xs text-white/75">{promoMessage}</p>}
                <dl className="w-full space-y-2 border-t border-white/30 pt-3 text-base">
                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatLari(subtotal)}</dd></div>
                    {discount > 0 && <div className="flex justify-between"><dt>Discount ({promoCode})</dt><dd>−{formatLari(discount)}</dd></div>}
                    <div className="flex justify-between"><dt>Delivery</dt><dd>Calculated at checkout</dd></div>
                    <div className="flex justify-between border-t border-white/30 pt-2 font-semibold"><dt>Items total</dt><dd>{formatLari(total)}</dd></div>
                </dl>
                <NavLink
                    to="/checkout"
                    onClick={toggleShoppingBag}
                    className="w-full rounded-md bg-white px-4 py-3 text-center text-base font-semibold text-stitching-graphite transition-colors hover:bg-stitching-linen"
                >
                    Continue to checkout
                </NavLink>
                {/* TODO: Add product variations when a variants schema is defined. */}
                <button type="button" onClick={clearCart} className="rounded-md border border-white/50 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10">Clear All</button>
                </>
            )}
        </div>
    );
}

function WishlistSheet({ isOpen, onClose, items, removeFromWishlist, clearWishlist, onAddToCart }) {
    return (
        <div
            className={`md:w-[30vw] fixed top-0 right-0 w-screen h-[100dvh] bg-gray-800/80 backdrop-blur-xs z-51 flex flex-col text-white text-3xl p-6 justify-center items-center gap-10 transition-all duration-700 ease-in-out ${isOpen
                    ? "translate-x-0 opacity-100 pointer-events-auto"
                    : "translate-x-full opacity-0 pointer-events-none"
                }`}
        >
            <button
                type="button"
                aria-label="Close wishlist"
                className="absolute top-3 right-15"
                onClick={onClose}
            >
                <XMarkIcon className="w-10 h-10 navbar-link cursor-pointer" aria-hidden="true" />
            </button>

            <h2>{items.length === 0 ? "WISHLIST IS EMPTY" : "YOUR WISHLIST"}</h2>
            {items.length > 0 && (
                <>
                <ul className="max-h-[calc(100dvh-12rem)] min-h-0 w-full max-w-md space-y-4 overflow-y-auto overscroll-contain text-base">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-4 border-b border-white/30 pb-3">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="size-14 shrink-0 rounded object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate">{item.name}</p>
                                <p className="text-sm text-white/80">{formatLari(item.price)}</p>
                                {item.description && <p className="line-clamp-2 text-sm text-white/70">{item.description}</p>}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    aria-label={`Move ${item.name} to cart`}
                                    title="Move to cart"
                                    onClick={() => onAddToCart(item)}
                                    className="inline-flex size-9 items-center justify-center rounded-md bg-white text-gray-900 transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <ShoppingBagIcon className="size-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Remove ${item.name} from wishlist`}
                                    title="Remove from wishlist"
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="shrink-0 rounded-full p-2 text-white transition-colors hover:text-stitching-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    <TrashIcon className="size-5" aria-hidden="true" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button type="button" onClick={clearWishlist} className="rounded-md border border-white/50 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10">Clear All</button>
                </>
            )}
        </div>
    );
}

function NavBar() {
    const { items, addToCart, removeFromCart, decrementCart, clearCart, wishlist, removeFromWishlist, clearWishlist } = useCart();
    const cartCount = items.reduce((total, item) => total + (item.quantity ?? 1), 0);
    const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [shoppingBagIsOpen, setShoppingBagIsOpen] = useState(false);
    const [wishlistIsOpen, setWishlistIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia("(max-width: 767px)").matches);

    useEffect(() => {
        let previousScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsHidden(currentScrollY > previousScrollY && currentScrollY > 64);
            previousScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)")
        const updateViewport = (event) => setIsMobileViewport(event.matches)
        mediaQuery.addEventListener("change", updateViewport)
        return () => mediaQuery.removeEventListener("change", updateViewport)
    }, [])
    useEffect(() => {
        const hasOpenOverlay = burgerMenuIsOpen || shoppingBagIsOpen || wishlistIsOpen
        if (!hasOpenOverlay) return undefined

        let releaseScrollLock = null
        const syncMobileScrollLock = () => {
            const isMobile = window.matchMedia("(max-width: 767px)").matches
            if (isMobile && !releaseScrollLock) {
                releaseScrollLock = acquireBodyScrollLock()
            } else if (!isMobile && releaseScrollLock) {
                releaseScrollLock()
                releaseScrollLock = null
            }
        }

        syncMobileScrollLock()
        window.addEventListener("resize", syncMobileScrollLock)
        return () => {
            window.removeEventListener("resize", syncMobileScrollLock)
            releaseScrollLock?.()
        }
    }, [burgerMenuIsOpen, shoppingBagIsOpen, wishlistIsOpen])

    const toggleShoppingBag = () => {
        setShoppingBagIsOpen((open) => !open);
        setWishlistIsOpen(false);
    };

    const toggleWishlist = () => {
        setWishlistIsOpen((open) => !open);
        setShoppingBagIsOpen(false);
    };

    const toggleBurgerMenu = () => {
        setBurgerMenuIsOpen(!burgerMenuIsOpen);
    };

    const toggleSearch = () => {
        setSearchIsOpen(!searchIsOpen);
    };

    const desktopLinkStyle = ({ isActive }) =>
        `navbar-link pb-1 transition-colors ${isActive
            ? "border-b-2 border-white"
            : "hover:text-gray-300"
        }`;

    return (
        <>
        <nav className={`navbar flex items-center justify-between p-4 pl-0 text-white h-16 fixed inset-0 w-full z-6 border-white border-b bg-stitching-wood transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}>

            {/* Логотип */}
            <div
                id="logo"
                className="w-25 h-25 flex items-center justify-center shrink-0"
                
            ><NavLink to="/home">
                <img
                
                    src={Logo}
                    alt="Cross-Stitch Logo"
                    className="w-full h-full object-contain"
                />
            </NavLink>
            </div>

            <p className="text-white text-md hidden md:block">
                Nona's Cross-Stitches
            </p>

            {/* Мобильный поиск */}

            {/* Ссылки по центру для ПК */}
            <div className="hidden md:flex items-center gap-8 mx-auto text-base font-medium shrink-0 pr-30">
                <NavLink to="/" className={desktopLinkStyle}>
                    Home
                </NavLink>

                <NavLink to="/catalog" className={desktopLinkStyle}>
                    Catalog
                </NavLink>

                <NavLink to="/about" className={desktopLinkStyle}>
                    About Us
                </NavLink>

                <NavLink to="/contact" className={desktopLinkStyle}>
                    Contact
                </NavLink>
            </div>

            {/* Правый блок с иконками */}
            <div className="flex items-center gap-4 shrink-0 relative">

                {/* Десктопный поиск */}
                <div className="relative inline-flex">
                    <div
                        className={`hidden md:block absolute right-full top-1/2 z-20 mr-3 w-40 -translate-y-1/2 transition-opacity duration-300 lg:w-48 ${searchIsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    >
                        {searchIsOpen && <ProductSearchBox isOpen={searchIsOpen} onClose={() => setSearchIsOpen(false)} />}
                    </div>
                    <button type="button" aria-label={searchIsOpen ? "Close product search" : "Search products"} onClick={toggleSearch} className="navbar-link inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        {searchIsOpen ? <XMarkIcon className="size-7" aria-hidden="true" /> : <MagnifyingGlassIcon className="size-7" aria-hidden="true" />}
                    </button>
                </div>

                <span className="relative inline-flex">
                    <button
                        type="button"
                        aria-label="Open wishlist"
                        onClick={toggleWishlist}
                        className="navbar-link cursor-pointer"
                    >
                        <Heart className="w-8 h-8" aria-hidden="true" />
                    </button>
                    {wishlist.length > 0 && (
                        <span
                            role="status"
                            aria-label={`${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} in wishlist`}
                            aria-live="polite"
                            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stitching-rose px-1 text-xs leading-none text-white"
                        >
                            {wishlist.length}
                        </span>
                    )}
                </span>
                <span className="relative inline-flex">
                    <ShoppingBagIcon
                        className="w-8 h-8 navbar-link cursor-pointer"
                        onClick={toggleShoppingBag}
                        />
                    {cartCount > 0 && (
                        <span
                            role="status"
                            aria-label={`${cartCount} ${cartCount === 1 ? "item" : "items"} in cart`}
                            aria-live="polite"
                            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stitching-rose px-1 text-xs leading-none text-white"
                        >
                            {cartCount}
                        </span>
                    )}
                </span>

                {/* Бургер-иконка только для мобильных */}
                <div className="md:hidden">
                    {burgerMenuIsOpen ? (
                        <div className="w-8 h-8" />
                    ) : (
                        <Bars3Icon
                            className="w-8 h-8 navbar-link cursor-pointer"
                            onClick={toggleBurgerMenu}
                        />
                    )}
                </div>
            </div>

            </nav>
        {createPortal(
            <>
                <BurgerMenu
                    toggleBurgerMenu={toggleBurgerMenu}
                    burgerMenuIsOpen={burgerMenuIsOpen}
                />
                <ShoppingBag
                    shoppingBagIsOpen={shoppingBagIsOpen}
                    toggleShoppingBag={toggleShoppingBag}
                    items={items}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    decrementCart={decrementCart}
                    clearCart={clearCart}
                />
                <WishlistSheet
                    isOpen={wishlistIsOpen}
                    onClose={() => setWishlistIsOpen(false)}
                    items={wishlist}
                    removeFromWishlist={removeFromWishlist}
                    clearWishlist={clearWishlist}
                    onAddToCart={(product) => {
                        addToCart(product)
                        removeFromWishlist(product.id)
                    }}
                />
                {searchIsOpen && isMobileViewport && createPortal(
                    <MobileSearchOverlay onClose={() => setSearchIsOpen(false)} />,
                    document.body,
                )}
            </>,
            document.body,
        )}
        </>
    );
}

export default NavBar;

