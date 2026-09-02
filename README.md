# Harvest Connect

Build a modern, professional web application called “Agri Connect” — an intelligent farm-to-market platform.

PROBLEM:

Multiple intermediaries reduce farmer earnings and increase consumer prices.

GOAL:

Connect farmers/FPOs directly with buyers and nearby transporters while using AI to intelligently match supply, demand and transportation.

The application must be a functional MVP, not just a landing page.

USER ROLES:

1. FARMER / FPO

- Add multiple types of available produce

- Specify crop, quantity, quality/grade, price and location

- Receive AI-generated buyer requests matching their produce

- Accept or reject requests

- View active orders and expected earnings

2. BUYER

- Create a purchase request containing MULTIPLE vegetables/products in one order

- Example:

  • 1,000 kg Onion – Grade A

  • 100 kg Green Chillies – Grade A

  • 500 kg Tomatoes – Grade A

  • 300 kg Carrots – Grade A

- Specify delivery location and required date

- View matched farmers/FPOs

- View total estimated price and logistics cost

- Track the complete order

3. TRANSPORTER / TRUCK DRIVER

- Register vehicle details

- Specify vehicle capacity, vehicle type and current location

- Receive AI-generated transport requests from nearby buyers/orders

- View pickup locations, quantities and delivery destination

- Accept or reject transportation requests

- View optimized pickup and delivery route

- Update transportation status:

  Available → Accepted → Pickup → In Transit → Delivered

CORE WORKFLOW:

BUYER CREATES A MULTI-ITEM ORDER

        ↓

AI ANALYZES EACH REQUIREMENT

        ↓

AI MATCHES SUITABLE FARMERS / FPOs

        ↓

AI AGGREGATES SUPPLY FROM MULTIPLE FARMERS

        ↓

AI FINDS NEARBY AVAILABLE TRANSPORTERS

        ↓

AI OPTIMIZES PICKUP + DELIVERY ROUTE

        ↓

FARMERS + TRANSPORTER RECEIVE REQUESTS

        ↓

ORDER FULFILLED

        ↓

BUYER RECEIVES PRODUCE

IMPORTANT:

The AI should not treat the buyer's order as only one product.

A single buyer order can contain multiple vegetables with different quantities and quality requirements.

The AI should:

- Match each product requirement with suitable farmers/FPOs

- Combine supplies from multiple farmers when required

- Prefer geographically efficient matches

- Find nearby available transporters

- Consider vehicle capacity

- Combine compatible pickups where possible

- Generate an efficient route

- Calculate estimated farmer realization, buyer cost and transportation cost

DEMO SCENARIO:

Create a realistic demo order for a wholesale buyer in Hyderabad:

Buyer needs:

- 1,000 kg Onion – Grade A

- 100 kg Green Chillies – Grade A

- 500 kg Tomatoes – Grade A

- 300 kg Carrots – Grade A

Show the AI processing the order.

Example result:

ONION

Farmer A → 400 kg

Farmer B → 350 kg

FPO C → 250 kg

Total → 1,000 kg

TOMATOES

Farmer D → 300 kg

FPO E → 200 kg

Total → 500 kg

GREEN CHILLIES

Farmer F → 100 kg

CARROTS

Farmer G → 300 kg

Then show:

MULTIPLE FARMERS

        ↓

SMART AGGREGATION

        ↓

MULTI-PRODUCT ORDER

        ↓

NEARBY TRANSPORTER

        ↓

OPTIMIZED PICKUP ROUTE

        ↓

BUYER

TRANSPORTER WORKFLOW:

When a buyer places an order, the AI identifies suitable nearby transporters based on:

- Current location

- Vehicle capacity

- Vehicle type

- Pickup locations

- Delivery destination

- Availability

The system sends a transport request to suitable nearby truck drivers.

Example:

“New Transport Request”

Pickup Points:

1. Farmer A – 400 kg Onion

2. Farmer B – 350 kg Onion

3. FPO C – 250 kg Onion

4. Farmer D – 300 kg Tomato

Delivery:

Hyderabad Wholesale Market

Vehicle Required:

Minimum 2,000 kg capacity

Estimated Distance:

XX km

Estimated Earnings:

₹XXXX

[Accept Request] [Reject]

FARMER DASHBOARD:

Show:

- Available Produce

- AI Buyer Matches

- Incoming Requests

- Active Orders

- Expected Earnings

- Order History

BUYER DASHBOARD:

Show:

- Create Purchase Request

- Active Orders

- AI Matched Supply

- Total Quantity

- Estimated Cost

- Transportation Status

TRANSPORTER DASHBOARD:

Show:

- Current Location

- Vehicle Details

- Available Requests

- Active Trips

- Route

- Estimated Earnings

- Delivery Status

BUYER REQUEST PAGE:

Allow buyers to dynamically add MULTIPLE products.

Use an interface like:

Product        Quantity       Grade

Onion          1,000 kg       A

Tomato         500 kg         A

Chillies       100 kg         A

[+ Add Another Product]

Delivery Location

Required Date

[Find Supply]

AI MATCHING SCREEN:

Show the AI matching process visually.

For every product, display:

- Required quantity

- Matched quantity

- Number of farmers/FPOs

- Locations

- Distance

- Quality

- Expected price

- Match score

Example:

Tomatoes

Required: 500 kg

Matched: 500 kg

Sources: 2

Match Score: 94%

SMART AGGREGATION:

Visually show multiple farmers contributing smaller quantities to fulfill one larger requirement.

Example:

Farmer A ── 400 kg ┐

Farmer B ── 350 kg ├──→ 1,000 kg Onion Order

FPO C ───── 250 kg ┘

LOGISTICS:

Show a map-style interface with:

- Farmer locations

- Pickup points

- Transporter location

- Buyer destination

- Optimized route

- Distance

- Estimated delivery time

IMPORTANT:

Agri Connect does NOT own trucks.

It connects buyers/farmers with existing nearby transporters and coordinates the transportation.

AI / INTELLIGENCE:

For the MVP, realistic seeded/demo data and rule-based intelligence are acceptable.

Create an AI matching system that considers:

- Crop/product

- Quantity

- Quality

- Price

- Farmer location

- Buyer location

- Transporter location

- Vehicle capacity

- Delivery time

Display an understandable “AI Match Score” rather than making the AI a black box.

MAIN PAGES:

- Landing Page

- Login / Role Selection

- Farmer/FPO Dashboard

- Buyer Dashboard

- Transporter Dashboard

- Multi-Product Purchase Request

- AI Matching Results

- Smart Aggregation

- Logistics & Route Tracking

- Order Details

DESIGN:

- Clean premium agricultural technology aesthetic

- White background with green accents

- Modern professional dashboard

- Simple and intuitive navigation

- Use cards, icons, charts, maps and visual flows

- Minimal text

- Make the core workflow understandable within seconds

- Responsive design

- Professional enough for a hackathon demonstration

TECHNOLOGY:

Use React + TypeScript.

Use Supabase if backend/database functionality is required.

Use realistic seeded data for the prototype.

MOST IMPORTANT:

Prioritize ONE polished end-to-end demonstration over many unfinished features.

The main demo should be:

MULTI-PRODUCT BUYER ORDER

→ AI SUPPLY MATCHING

→ MULTI-FARMER AGGREGATION

→ NEARBY TRANSPORTER MATCHING

→ ROUTE OPTIMIZATION

→ DELIVERY TRACKING

Every important button in this flow should work and navigate to the appropriate screen.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3c6002b-bae1-4e1b-a942-a0ff1f3c98cc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
