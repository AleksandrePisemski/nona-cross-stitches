
import Logo from "../../assets/logo.png";
import { NavLink } from "react-router";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ShoppingBagIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

function BurgerMenu({ toggleBurgerMenu, burgerMenuIsOpen }) {
    const linkStyle = ({ isActive }) =>
        `navbar-link relative pb-1 transition-colors ${isActive ? "border-b-2 border-white" : "hover:text-gray-300"
        }`;

    return (
        <div
            className={`fixed top-0 left-0 w-screen h-screen bg-gray-800/80 backdrop-blur-xs z-50 flex flex-col text-3xl p-6 justify-center items-center gap-10 transition-all duration-700 ease-in-out md:hidden ${burgerMenuIsOpen
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

function ShoppingBag({ shoppingBagIsOpen, toggleShoppingBag }) {
    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-gray-800/80 backdrop-blur-xs z-51 flex flex-col text-3xl p-6 justify-center items-center gap-10 transition-all duration-700 ease-in-out ${shoppingBagIsOpen
                    ? "translate-x-0 opacity-100 pointer-events-auto"
                    : "translate-x-full opacity-0 pointer-events-none"
                }`}
        >
            <XMarkIcon
                className="w-10 h-10 navbar-link absolute top-3 right-15 cursor-pointer"
                onClick={toggleShoppingBag}
            />

            <h2>BAG IS EMPTY</h2>
        </div>
    );
}

function NavBar() {
    const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [shoppingBagIsOpen, setShoppingBagIsOpen] = useState(false);

    const toggleShoppingBag = () => {
        setShoppingBagIsOpen(!shoppingBagIsOpen);
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
        <nav className="navbar flex items-center justify-between p-4 pl-0 text-white h-16 fixed inset-0 w-full z-50 border-white border-b">

            {/* Логотип */}
            <div
                id="logo"
                className="w-25 h-25 flex items-center justify-center shrink-0"
            >
                <img
                    src={Logo}
                    alt="Cross-Stitch Logo"
                    className="w-full h-full object-contain"
                />
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
                <div
                    className={`hidden md:block absolute right-12 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${searchIsOpen
                            ? "w-48 opacity-100 pointer-events-auto"
                            : "w-0 opacity-0 pointer-events-none overflow-hidden"
                        }`}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full backdrop-blur-md border-white border text-white px-4 py-2 rounded-md outline-none text-sm"
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

                <ShoppingBagIcon
                    className="w-8 h-8 navbar-link cursor-pointer"
                    onClick={toggleShoppingBag}
                />

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

            {/* Мобильные модалки */}
            <BurgerMenu
                toggleBurgerMenu={toggleBurgerMenu}
                burgerMenuIsOpen={burgerMenuIsOpen}
            />

            <ShoppingBag
                shoppingBagIsOpen={shoppingBagIsOpen}
                toggleShoppingBag={toggleShoppingBag}
            />
        </nav>
    );
}

export default NavBar;

