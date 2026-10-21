
import Logo from "../../assets/logo.png";
import { NavLink } from "react-router";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ShoppingBagIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";


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
function MobileSearchBar({ searchIsOpen }) {
    return (
        <div
            className={`flex md:hidden flex-1 mx-2 overflow-hidden transition-all duration-700 ease-in-out ${searchIsOpen
                    ? "max-w-full opacity-100 translate-x-0"
                    : "max-w-0 opacity-0 -translate-x-10 pointer-events-none"
                }`}
        >
            <input
                type="text"
                placeholder="Search..."
                className="w-full backdrop-blur-md border-white border text-white px-3 py-1.5 rounded-md outline-none text-base"
                autoFocus={searchIsOpen}
            />
        </div>
    );
}

function ShoppingBag({ shoppingBagIsOpen, toggleShoppingBag, items, removeFromCart }) {
    const totalPrice = items.reduce((total, item) => {
        const price = Number(String(item.price).replace(/[^\d.-]/g, "")) || 0;
        return total + price * (item.quantity ?? 1);
    }, 0);
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

            <h2>{items.length === 0 ? "BAG IS EMPTY" : "YOUR BAG"}</h2>
            {items.length > 0 && (
                <ul className="max-h-[calc(100dvh-12rem)] min-h-0 w-full max-w-md space-y-4 overflow-y-auto overscroll-contain text-base">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-4 border-b border-white/30 pb-3">
                            <span>{item.name}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>{item.price}</span>
                            <button
                                type="button"
                                aria-label={`Remove ${item.name} from cart`}
                                title="Remove from cart"
                                onClick={() => removeFromCart(item.id)}
                                className="shrink-0 rounded-full p-2 text-white transition-colors hover:text-stitching-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <Trash2 className="size-5" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                    <li className="flex justify-between border-t border-white/30 pt-3 font-semibold">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPrice)}</span>
                    </li>
                </ul>
            )}
        </div>
    );
}

function WishlistSheet({ isOpen, onClose, items, removeFromWishlist }) {
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
                                <p className="text-sm text-white/80">{item.price}</p>
                                {item.description && <p className="line-clamp-2 text-sm text-white/70">{item.description}</p>}
                            </div>
                            <button
                                type="button"
                                aria-label={`Remove ${item.name} from wishlist`}
                                title="Remove from wishlist"
                                onClick={() => removeFromWishlist(item.id)}
                                className="shrink-0 rounded-full p-2 text-white transition-colors hover:text-stitching-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <Trash2 className="size-5" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function NavBar() {
    const { items, removeFromCart, wishlist, removeFromWishlist } = useCart();
    const cartCount = items.reduce((total, item) => total + (item.quantity ?? 1), 0);
    const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [shoppingBagIsOpen, setShoppingBagIsOpen] = useState(false);
    const [wishlistIsOpen, setWishlistIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

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
            <MobileSearchBar searchIsOpen={searchIsOpen} />

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
                        <input
                            type="text"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-hidden={!searchIsOpen}
                            tabIndex={searchIsOpen ? 0 : -1}
                            className="w-full rounded-md border border-white px-4 py-2 text-sm text-white outline-none backdrop-blur-md"
                            autoFocus={searchIsOpen}
                        />
                    </div>
                    {searchIsOpen ? (
                        <XMarkIcon
                            className="w-8 h-8 navbar-link cursor-pointer z-10"
                            onClick={toggleSearch}
                    />
                    ) : (
                        <MagnifyingGlassIcon
                            className="w-8 h-8 navbar-link cursor-pointer z-10"
                            onClick={toggleSearch}
                    />
                    )}
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
                    removeFromCart={removeFromCart}
                />
                <WishlistSheet
                    isOpen={wishlistIsOpen}
                    onClose={() => setWishlistIsOpen(false)}
                    items={wishlist}
                    removeFromWishlist={removeFromWishlist}
                />
            </>,
            document.body,
        )}
        </>
    );
}

export default NavBar;
