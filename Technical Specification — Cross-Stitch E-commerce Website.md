# Technical Specification  
## E-commerce Website for Cross-Stitch Pictures

### 1. Project Overview

Develop a responsive e-commerce website for selling cross-stitch pictures and related products.

The website should allow customers to browse products, filter and search the catalog, view detailed product information, add products to a cart, complete an order, pay online, and receive order confirmation.

The website must also include an administration area where the store owner can manage products, categories, prices, stock, orders, promotions, and website content.

---

# 2. Main Website Sections +

The website should include the following public pages:

- Home page
- Product catalog
- Category pages
- Product details page
- Search results
- Shopping cart
- Checkout
- Order confirmation
- About Us
- Delivery and Payment
- Contact
- FAQ
- Privacy Policy
- Terms and Conditions
- Returns / Refund Policy
- 404 page

---

# 3. Home Page

The home page should contain:

### 3.1 Header

Header should include:

- Company logo +
- Main navigation menu +
- Catalog button/link +
- Search +
- Shopping cart icon +
- Number of products currently in the cart (later)

Header should work correctly on desktop, tablet, and mobile devices.

On mobile devices, navigation should be displayed through a mobile menu.+

---

### 3.2 Main Banner

Configurable promotional banner containing:

- Image +
- Heading +
- Description + 
- Button +
- Link

Administrator must be able to change banner content without editing the source code. -

---

### 3.3 Categories

Display main product categories.

Each category card should include:

- Category image
- Category name
- Link to category
 
Example categories: +

- Landscapes 
- Flowers 
- Animals 
- Religious 
- People 
- Architecture
- Children's designs
- Modern designs

Categories must be manageable from the administration panel.

---

### 3.4 Featured Products

Sections may include:

- New products
- Best sellers
- Discounted products
- Recommended products

Each product card should display:

- Product image
- Product name
- Price
- Discounted price, if applicable
- Discount percentage or promotional badge
- Availability
- Add to Cart button

Optional:

- Add to Favorites button
- Quick View

---

### 3.5 Promotional Sections

Administrator should be able to create promotional blocks such as:

- Seasonal sale
- New collection
- Special offer
- Free delivery campaign

Each block should support:

- Image
- Heading
- Text
- Link
- Button

---

# 4. Product Catalog

The catalog must display products in a grid.

Each product card should contain:

- Main photo
- Product name
- Product price
- Previous price if discounted
- Discount indicator
- Availability
- Add to Cart button

---

# 5. Categories

Products should be assigned to one or more categories.

Administrator must be able to:

- Create categories
- Edit categories
- Delete categories
- Upload category image
- Change category order
- Enable/disable categories

Category structure should support subcategories if required later.

Example:

Cross-Stitch Pictures  
→ Flowers  
→ Landscapes  
→ Animals

---

# 6. Product Filtering

Catalog must support filtering.

Recommended filters for cross-stitch products:

- Category
- Price
- Size
- Difficulty
- Theme
- Orientation
- Availability
- Manufacturer / Brand

Difficulty examples:

- Beginner
- Intermediate
- Advanced

Orientation:

- Portrait
- Landscape
- Square

Size filtering may be based on:

- Width
- Height

Example:

20 × 30 cm  
30 × 40 cm  
40 × 50 cm

Filters should work without requiring a complete page reload where technically appropriate.

User should be able to reset all filters.

---

# 7. Sorting

Products should be sortable by:

- Recommended
- Newest
- Price: Low to High
- Price: High to Low
- Popularity
- Discount

---

# 8. Search

Website should include product search.

Search should work using:

- Product name
- Product SKU/article number
- Product description
- Keywords/tags

Search suggestions should preferably appear while the user types.

If no results are found, display an appropriate message and recommended products/categories.

---

# 9. Product Page

Each product should have a dedicated page.

The product page should contain:

### Product information

- Product name
- SKU / article number
- Product price
- Previous price
- Discount percentage
- Availability
- Product description

### Product gallery

Support multiple product images.

Functionality:

- Main image
- Thumbnail gallery
- Zoom or enlarged image
- Mobile swipe support

### Cross-stitch specifications

The product database should support fields such as:

- Finished picture width
- Finished picture height
- Number of colors
- Difficulty
- Canvas type
- Canvas count
- Thread type
- Manufacturer
- Country of manufacture
- Estimated completion time
- Kit contents

Example kit contents:

- Canvas
- Threads
- Needle
- Pattern
- Instructions

Fields should preferably be optional because not every product may contain the same information.

---

# 10. Product Variants

The system should support product variants where required.

Possible variants:

- Size
- Frame option
- Canvas type
- Kit / pattern only
- Thread type

Each variant may have its own:

- Price
- SKU
- Stock quantity

Example:

Cross-stitch design A

30 × 40 cm — 50 GEL  
40 × 50 cm — 70 GEL  
50 × 70 cm — 95 GEL

Customer must select the required variation before adding the product to the cart.

---

# 11. Related Products

Product page should display related products.

Examples:

- Similar designs
- Products from the same category
- Products from the same collection

---

# 12. Shopping Cart

Users must be able to:

- Add products
- Remove products
- Change quantity
- See product variations
- See individual product prices
- See subtotal
- Apply promotional code
- See discount
- See delivery cost
- See final total

Cart contents should remain saved if the customer refreshes or closes the website.

---

# 13. Promotional Codes

Administrator should be able to create discount codes.

Promo code settings:

- Code
- Percentage discount
- Fixed-value discount
- Minimum order value
- Start date
- Expiration date
- Maximum number of uses
- Limit per customer
- Applicable products/categories

Example:

STITCH10  
10% discount  
Minimum order: 100 GEL

---

# 14. Checkout

Checkout should allow users to purchase without mandatory registration.

Required customer information:

- First name
- Last name
- Phone number
- Email
- Country
- City
- Address
- Postal code

Optional:

- Apartment
- Entrance
- Floor
- Delivery instructions
- Order comment

---

# 15. Delivery

System should support multiple delivery methods.

Examples:

- Courier delivery
- Pickup
- Georgian Post
- International shipping

Administrator should be able to configure:

- Delivery method
- Delivery price
- Free delivery threshold
- Applicable country/region

Example:

Tbilisi courier — 7 GEL  
Georgia courier — 10 GEL  
Free delivery for orders over 150 GEL.

Delivery price should automatically be included in the final order amount.

---

# 16. Payment

System architecture should support online payment integration.

Possible payment options:

- Credit/debit card
- Cash on delivery
- Bank transfer

Payment integration should be implemented through the payment provider selected by the client.

The website should correctly handle:

- Successful payment
- Failed payment
- Cancelled payment
- Repeated payment attempt
- Payment webhook/callback
- Duplicate-payment protection

Payment status must be stored separately from order status.

Example payment statuses:

- Pending
- Paid
- Failed
- Refunded
- Partially refunded

---

# 17. Order Creation

Each order should receive a unique order number.

Example:

ORD-2026-00125

Order should store:

- Order ID
- Order date
- Customer information
- Products
- Product variants
- Quantity
- Individual prices
- Discounts
- Delivery method
- Delivery price
- Total
- Payment method
- Payment status
- Order status
- Customer comments

Product price should be stored in the order at the moment of purchase so that later product price changes do not alter existing orders.

---

# 18. Order Statuses

Administrator should be able to change order status.

Recommended statuses:

- New
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled
- Returned

Order status changes should be visible in the admin area.

---

# 19. Customer Notifications

Customer should receive an email after successfully creating an order.

Email should contain:

- Order number
- Purchased products
- Quantity
- Prices
- Delivery method
- Delivery address
- Total amount
- Payment status

Optional notifications:

- Order confirmed
- Order shipped
- Order delivered
- Order cancelled

---

# 20. Customer Account

Customer registration should preferably be optional.

Registered customers should be able to:

- Log in
- Log out
- Reset password
- Edit personal information
- Save addresses
- View previous orders
- View order details

Optional:

- Favorites / wishlist

Guest checkout must still be supported.

---

# 21. Favorites

Optional functionality.

Users should be able to:

- Add products to favorites
- Remove products
- View favorites page
- Add favorite products to cart

For logged-in users, favorites should be saved to their account.

---

# 22. Administration Panel

The administration interface must be protected from unauthorized access.

Administrator should be able to manage:

### Products

- Add product
- Edit product
- Delete product
- Hide product
- Duplicate product
- Change price
- Set discount
- Change inventory
- Upload/reorder images
- Assign categories
- Configure variants
- Set product specifications
- Mark product as Featured / New / Best Seller

### Categories

- Add
- Edit
- Delete
- Reorder
- Add images

### Orders

Administrator should see:

- Order number
- Customer
- Date
- Products
- Total
- Payment status
- Order status
- Delivery information

Administrator should be able to:

- Open full order
- Change order status
- Add internal notes
- Cancel order
- Process/update refund status when supported by the payment provider

### Promotions

Administrator should be able to manage:

- Discounts
- Promo codes
- Promotional banners

### Website content

Administrator should be able to edit basic content such as:

- Homepage banners
- About Us
- Delivery information
- Contact information
- FAQ

---

# 23. Inventory

Each product or product variant should support stock quantity.

Example:

Product A  
Stock: 12

After successful order placement, stock must decrease automatically according to the chosen inventory reservation/payment logic.

When stock reaches zero:

- Product should display "Out of stock"
- Add to Cart should be disabled

Administrator should be able to manually change stock.

The system must prevent customers from successfully ordering more units than available.

---

# 24. Product Images

Administrator must be able to upload multiple images.

System should:

- Optimize images
- Generate appropriate image sizes/thumbnails
- Use modern image formats where possible
- Lazy-load images
- Preserve image quality

Administrator should be able to:

- Select main image
- Reorder images
- Delete images

---

# 25. Responsive Design

Website must work correctly on:

- Desktop
- Laptop
- Tablet
- Mobile

Important pages should be specifically checked at common widths such as:

- 375 px
- 768 px
- 1024 px
- 1440 px

There should be no horizontal scrolling caused by layout errors.

---

# 26. Performance

Website should be optimized for reasonable loading speed.

Implementation should include where appropriate:

- Image optimization
- Lazy loading
- Code splitting
- Caching
- Optimized database queries
- CDN/static asset delivery

Core user flows should not unnecessarily download large assets.

---

# 27. SEO

Each product and category page should support:

- SEO title
- Meta description
- Human-readable URL
- Open Graph image/content

Example product URL:

`/products/cross-stitch-sunset-mountains`

instead of:

`/product?id=12345`

Website should include:

- Sitemap.xml
- Robots.txt
- Canonical URLs
- Structured product data where appropriate

Product structured data should include applicable information such as:

- Product name
- Image
- Price
- Currency
- Availability

---

# 28. Social Sharing

Product pages should generate correct previews when shared through platforms such as:

- Facebook
- Messenger
- WhatsApp
- Telegram

Preview should contain the appropriate product:

- Image
- Name
- Description

---

# 29. Analytics

Website should support analytics integration.

At minimum, the implementation should make it possible to track:

- Product viewed
- Product added to cart
- Product removed from cart
- Checkout started
- Order completed
- Search performed

Google Analytics / Google Tag Manager or equivalent may be connected.

---

# 30. Security

Implementation should include standard security measures.

Requirements include:

- HTTPS
- Server-side validation
- Protection against unauthorized admin access
- Secure password storage through authentication provider
- Validation of uploaded files
- Protection against manipulation of prices from the frontend
- Secure payment callbacks/webhooks
- Protection against duplicate order/payment processing

Product prices and final order totals must be validated/calculated on the server and not trusted solely from frontend data.

---

# 31. Database

Database structure should support at least the following entities:

### Product

- id
- name
- slug
- SKU
- description
- price
- previousPrice
- categoryIds
- images
- specifications
- variants
- stock
- active
- featured
- createdAt
- updatedAt

### Category

- id
- name
- slug
- image
- parentCategoryId
- sortOrder
- active

### Order

- id
- orderNumber
- customer
- items
- subtotal
- discount
- deliveryCost
- total
- paymentMethod
- paymentStatus
- orderStatus
- deliveryMethod
- deliveryAddress
- customerComment
- createdAt
- updatedAt

### PromoCode

- id
- code
- discountType
- discountValue
- minimumOrder
- validFrom
- validUntil
- usageLimit
- active

### User

If customer accounts are implemented:

- id
- firstName
- lastName
- email
- phone
- addresses
- createdAt

---

# 32. Technical Architecture

Developer should structure the project so that the following components are separated logically:

- Frontend
- Backend/business logic
- Database
- Authentication
- Payment integration
- File/image storage
- Email service

The system should be maintainable and allow future additions without requiring significant rewriting.

Possible future functionality should be considered when designing the architecture.

---

# 33. Error Handling

User-friendly error messages should be displayed for cases such as:

- Payment failure
- Product unavailable
- Insufficient stock
- Invalid promo code
- Server error
- Form validation error
- Failed image/content loading

Technical error information should not be exposed directly to customers.

---

# 34. Loading States

Interactive actions should display appropriate loading states.

Examples:

- Add to cart
- Apply promo code
- Submit checkout
- Process payment
- Load products
- Search

Buttons should be protected against accidental multiple submissions.

---

# 35. Empty States

Appropriate screens/messages should exist for:

- Empty cart
- Empty wishlist
- No search results
- No products in category
- No previous orders

---

# 36. Browser Compatibility

Website should support current versions of major browsers, including:

- Google Chrome
- Safari
- Firefox
- Microsoft Edge

Mobile Safari and Chrome for Android must also be tested.

---

# 37. Languages

The website architecture should allow multilingual support.

Recommended initial language setup:

- Georgian
- English

If only one language is required for launch, the implementation should still avoid unnecessarily hard-coding content in a way that makes future localization difficult.

---

# 38. Currency

Default currency:

GEL / ₾

Architecture should make adding additional currencies possible in the future if international sales are planned.

All calculations must use a safe monetary representation and avoid floating-point rounding errors.

---

# 39. Contact Page

Contact page should contain:

- Phone
- Email
- Address if applicable
- Social media links
- Contact form

Contact form fields:

- Name
- Email / phone
- Message

The form should include spam protection.

---

# 40. Footer

Footer should contain:

- Logo
- Navigation
- Contact details
- Social media links
- Privacy Policy
- Terms and Conditions
- Delivery information
- Returns policy
- Copyright

---

# 41. Administration Permissions

If multiple administrators may use the website, architecture should support roles.

Example:

**Administrator**
- Full access

**Order Manager**
- Orders
- Customers
- Stock

**Content Manager**
- Products
- Categories
- Banners
- Website content

A basic single-administrator implementation is acceptable for the initial version if multiple roles are outside the agreed scope.

---

# 42. Backup and Data Protection

Production data should not depend solely on a developer's local environment.

There should be a documented backup strategy for:

- Database
- Product information
- Orders
- Customer information

Production environment variables and credentials must not be committed to the public source-code repository.

---

# 43. Deployment

Developer is responsible for preparing the project for production deployment.

Production setup should include:

- Domain configuration
- SSL/HTTPS
- Production environment variables
- Production database
- Image/file storage
- Payment provider production credentials
- Email configuration

A staging/test environment is recommended before production release.

---

# 44. Testing

Before project delivery, the following flows must be tested:

1. Browse catalog.
2. Filter products.
3. Search for a product.
4. Open product.
5. Select product variant.
6. Add to cart.
7. Change quantity.
8. Apply promotional code.
9. Enter checkout information.
10. Select delivery.
11. Complete payment.
12. Confirm order creation.
13. Verify confirmation email.
14. Verify order appears in admin panel.
15. Change order status.
16. Verify inventory decreases correctly.
17. Verify out-of-stock products cannot be purchased.

Testing should cover desktop and mobile devices.

---

# 45. Delivery Requirements

At project completion, the client must receive:

- Complete source code
- Access to source-code repository
- Database access
- Hosting/deployment access
- Domain configuration access where applicable
- Payment provider configuration under the client's ownership
- Admin account
- Instructions for managing products
- Instructions for managing orders
- Instructions for creating promotions
- Environment/configuration documentation

All primary production accounts should belong to the client rather than being permanently owned by the developer.

---

# 46. Acceptance Criteria

The project will be considered functionally complete when:

- Customer can browse the complete product catalog.
- Search and filtering operate correctly.
- Product pages display correct information.
- Products and variants can be added to the cart.
- Correct prices and discounts are calculated.
- Customer can complete checkout.
- Online payments operate correctly if included in scope.
- Orders are stored in the database.
- Order confirmation is provided.
- Administrator can view and manage orders.
- Administrator can create and modify products.
- Administrator can manage inventory.
- Website operates correctly on desktop and mobile.
- Critical functionality contains no known blocking errors.

---

# 47. Recommended Phase 2 Features

The following features are not required for the initial launch unless specifically agreed, but the architecture should not unnecessarily prevent their future implementation:

- Product reviews
- Ratings
- Loyalty points
- Gift cards
- Abandoned-cart emails
- Recently viewed products
- Personalized recommendations
- Back-in-stock notifications
- Advanced inventory reporting
- Sales reports
- Multiple warehouses
- Instagram integration
- Facebook/Google login
- Multicurrency
- International shipping calculator
- Customer product-photo uploads
- "Notify me when available"